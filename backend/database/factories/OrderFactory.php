<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => User::factory(),
            'store_id' => Store::factory(),
            'product_id' => null,
            'type' => Order::TYPE_PRODUCT,
            'status' => Order::STATUS_NEW,
            'payment_status' => Order::PAYMENT_NONE,
            'fulfillment_status' => Order::FULFILLMENT_UNFULFILLED,
            'appointment_status' => Order::APPOINTMENT_NA,
            'item_name' => fake()->words(3, true),
            'item_count' => 1,
            'total' => fake()->randomFloat(2, 12, 180),
            'currency' => 'USD',
        ];
    }

    public function booking(): static
    {
        return $this->state(fn () => [
            'type' => Order::TYPE_BOOKING,
            'fulfillment_status' => Order::FULFILLMENT_NA,
            'appointment_status' => Order::APPOINTMENT_SCHEDULED,
            'scheduled_at' => now()->addDay(),
        ]);
    }

    public function forStore(Store $store): static
    {
        return $this->state(fn () => [
            'store_id' => $store->getKey(),
            'currency' => $store->currency ?: 'USD',
        ]);
    }

    public function forListing(Product $product): static
    {
        $booking = $product->type === Product::TYPE_SERVICE;

        return $this->state(fn () => [
            'store_id' => $product->store_id,
            'product_id' => $product->getKey(),
            'type' => $booking ? Order::TYPE_BOOKING : Order::TYPE_PRODUCT,
            'item_name' => $product->name,
            'total' => $product->price,
            'currency' => $product->currency ?: 'USD',
            'fulfillment_status' => $booking ? Order::FULFILLMENT_NA : Order::FULFILLMENT_UNFULFILLED,
            'appointment_status' => $booking ? Order::APPOINTMENT_SCHEDULED : Order::APPOINTMENT_NA,
        ]);
    }
}
