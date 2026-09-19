<?php

namespace Database\Factories;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Store>
 */
class StoreFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'owner_id' => User::factory()->role(User::ROLE_VENDOR),
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1000, 9999),
            'tagline' => fake()->catchPhrase(),
            'description' => fake()->paragraph(),
            'public_email' => fake()->companyEmail(),
            'public_phone' => fake()->phoneNumber(),
            'website' => fake()->url(),
            'country' => 'US',
            'state' => 'TX',
            'city' => 'Austin',
            'postal_code' => fake()->postcode(),
            'address_line' => fake()->streetAddress(),
            'hide_address' => false,
            'service_area' => 'Greater Austin metro area',
            'timezone' => 'America/Chicago',
            'currency' => 'USD',
            'language' => 'en',
            'min_order_amount' => 15.00,
            'status' => Store::STATUS_ACTIVE,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['status' => Store::STATUS_DRAFT]);
    }

    public function verified(): static
    {
        return $this->state(fn () => ['verified_at' => now()]);
    }

    /** Give the store to an existing owner instead of making a new vendor. */
    public function ownedBy(User $owner): static
    {
        return $this->state(fn () => ['owner_id' => $owner->getKey()]);
    }
}
