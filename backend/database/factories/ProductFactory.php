<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'store_id' => Store::factory(),
            'name' => Str::title($name),
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1000, 9999),
            'sku' => strtoupper(fake()->unique()->bothify('SKU-####')),
            'type' => Product::TYPE_PHYSICAL,
            'status' => Product::STATUS_DRAFT,
            'price' => fake()->randomFloat(2, 8, 200),
            'currency' => 'USD',
            'track_inventory' => true,
            'stock_qty' => fake()->numberBetween(4, 80),
            'low_stock_threshold' => 10,
        ];
    }

    public function forStore(Store $store): static
    {
        return $this->state(fn () => [
            'store_id' => $store->getKey(),
            'currency' => $store->currency ?: 'USD',
            'country' => $store->country,
        ]);
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => Product::STATUS_PUBLISHED,
            'published_at' => now()->subDays(3),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => Product::STATUS_PENDING]);
    }

    public function digital(): static
    {
        return $this->state(fn () => [
            'type' => Product::TYPE_DIGITAL,
            'track_inventory' => false,
            'stock_qty' => null,
        ]);
    }

    public function service(): static
    {
        return $this->state(fn () => [
            'type' => Product::TYPE_SERVICE,
            'track_inventory' => false,
            'stock_qty' => null,
            'duration_minutes' => 90,
            'delivery_method' => Product::DELIVERY_ON_SITE,
            'booking_model' => Product::BOOKING_REQUEST,
        ]);
    }
}
