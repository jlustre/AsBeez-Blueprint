<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\OrderAdminEvent;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOrderApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->role(User::ROLE_SUPER_ADMIN)->create();
    }

    private function asAdmin(): static
    {
        return $this->actingAs($this->admin);
    }

    public function test_the_list_requires_an_administrator(): void
    {
        $this->getJson('/api/v1/admin/orders')->assertUnauthorized();

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/admin/orders')
            ->assertForbidden();
    }

    public function test_the_empty_directory_reports_zero_stats(): void
    {
        $this->asAdmin()
            ->getJson('/api/v1/admin/orders')
            ->assertOk()
            ->assertJsonPath('meta.total', 0)
            ->assertJsonPath('stats.total', 0)
            ->assertJsonPath('stats.product_orders', 0)
            ->assertJsonPath('stats.service_bookings', 0)
            ->assertJsonPath('stats.attention', 0)
            ->assertJsonMissingPath('stats.gmv');
    }

    public function test_the_list_separates_orders_and_bookings(): void
    {
        $store = Store::factory()->create();
        $order = Order::factory()->forStore($store)->create([
            'item_name' => 'Beeswax Board',
            'status' => Order::STATUS_CONFIRMED,
        ]);
        $booking = Order::factory()->forStore($store)->booking()->create([
            'item_name' => 'Home Cleaning Visit',
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/orders')
            ->assertOk()
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('stats.product_orders', 1)
            ->assertJsonPath('stats.service_bookings', 1)
            ->assertJsonPath('stats.confirmed', 1);

        $this->asAdmin()
            ->getJson('/api/v1/admin/orders?type=service_booking')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('orders.0.id', $booking->id)
            ->assertJsonPath('orders.0.code', $booking->code());

        $this->asAdmin()
            ->getJson('/api/v1/admin/orders?search='.$order->code())
            ->assertOk()
            ->assertJsonPath('orders.0.id', $order->id);
    }

    public function test_attention_filters_failed_payments_and_holds(): void
    {
        $failed = Order::factory()->create([
            'payment_status' => Order::PAYMENT_FAILED,
        ]);
        Order::factory()->create([
            'status' => Order::STATUS_CONFIRMED,
            'payment_status' => Order::PAYMENT_PAID,
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/orders?attention=1')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('orders.0.id', $failed->id)
            ->assertJsonPath('orders.0.needs_attention', true)
            ->assertJsonPath('stats.attention', 1);
    }

    public function test_an_administrator_can_change_status_and_add_a_note(): void
    {
        $order = Order::factory()->create(['status' => Order::STATUS_CONFIRMED]);

        $this->asAdmin()
            ->putJson("/api/v1/admin/orders/{$order->id}/status", [
                'status' => Order::STATUS_ON_HOLD,
            ])
            ->assertUnprocessable();

        $this->asAdmin()
            ->putJson("/api/v1/admin/orders/{$order->id}/status", [
                'status' => Order::STATUS_ON_HOLD,
                'reason' => 'Payment failed and the vendor asked to pause fulfillment.',
            ])
            ->assertOk()
            ->assertJsonPath('order.status', Order::STATUS_ON_HOLD)
            ->assertJsonPath('order.events.0.type', OrderAdminEvent::TYPE_STATUS);

        $this->asAdmin()
            ->postJson("/api/v1/admin/orders/{$order->id}/notes", [
                'body' => 'Called the customer about the card.',
            ])
            ->assertOk()
            ->assertJsonPath('order.events.0.type', OrderAdminEvent::TYPE_NOTE);
    }

    public function test_a_listing_can_be_attached_without_inventing_commerce(): void
    {
        $product = Product::factory()->published()->create(['name' => 'Hive Honey Jar']);
        $order = Order::factory()->forListing($product)->create();

        $this->asAdmin()
            ->getJson("/api/v1/admin/orders/{$order->id}")
            ->assertOk()
            ->assertJsonPath('order.listing.name', 'Hive Honey Jar')
            ->assertJsonPath('order.item_name', 'Hive Honey Jar')
            ->assertJsonMissingPath('order.gmv')
            ->assertJsonMissingPath('order.fraud_score');
    }
}
