<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductAdminEvent;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminServiceApiTest extends TestCase
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
        $this->getJson('/api/v1/admin/services')->assertUnauthorized();

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/admin/services')
            ->assertForbidden();
    }

    public function test_the_list_only_includes_service_listings(): void
    {
        $store = Store::factory()->create();
        $service = Product::factory()->forStore($store)->service()->published()->create([
            'name' => 'Home Cleaning Visit',
        ]);
        Product::factory()->forStore($store)->published()->create([
            'name' => 'Beeswax Board',
            'type' => Product::TYPE_PHYSICAL,
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/services')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('services.0.id', $service->id)
            ->assertJsonPath('services.0.delivery_method', Product::DELIVERY_ON_SITE)
            ->assertJsonPath('stats.total', 1)
            ->assertJsonPath('stats.published', 1);
    }

    public function test_the_list_can_be_filtered_by_delivery_and_booking(): void
    {
        $store = Store::factory()->create(['service_area' => 'Greater Austin']);
        $remote = Product::factory()->forStore($store)->service()->create([
            'name' => 'Strategy Session',
            'delivery_method' => Product::DELIVERY_REMOTE,
            'booking_model' => Product::BOOKING_QUOTE,
        ]);
        Product::factory()->forStore($store)->service()->create([
            'name' => 'Yard Work',
            'delivery_method' => Product::DELIVERY_ON_SITE,
            'booking_model' => Product::BOOKING_INSTANT,
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/services?delivery_method=remote')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('services.0.id', $remote->id)
            ->assertJsonPath('services.0.service_area', 'Greater Austin');

        $this->asAdmin()
            ->getJson('/api/v1/admin/services?booking_model=quote')
            ->assertOk()
            ->assertJsonPath('services.0.id', $remote->id);
    }

    public function test_a_physical_listing_is_not_addressable_on_the_service_screen(): void
    {
        $product = Product::factory()->create(['type' => Product::TYPE_PHYSICAL]);

        $this->asAdmin()
            ->getJson("/api/v1/admin/services/{$product->id}")
            ->assertNotFound();
    }

    public function test_an_administrator_can_change_status_and_add_a_note(): void
    {
        $service = Product::factory()->service()->published()->create();

        $this->asAdmin()
            ->putJson("/api/v1/admin/services/{$service->id}/status", [
                'status' => Product::STATUS_HIDDEN,
            ])
            ->assertUnprocessable();

        $this->asAdmin()
            ->putJson("/api/v1/admin/services/{$service->id}/status", [
                'status' => Product::STATUS_HIDDEN,
                'reason' => 'Misleading claims under review.',
            ])
            ->assertOk()
            ->assertJsonPath('service.status', Product::STATUS_HIDDEN)
            ->assertJsonPath('service.events.0.type', ProductAdminEvent::TYPE_STATUS);

        $this->asAdmin()
            ->postJson("/api/v1/admin/services/{$service->id}/notes", [
                'body' => 'Asked the vendor for credentials.',
            ])
            ->assertOk()
            ->assertJsonPath('service.events.0.type', ProductAdminEvent::TYPE_NOTE);
    }
}
