<?php

namespace Database\Factories;

use App\Models\PpfTier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PpfTier>
 */
class PpfTierFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = 'Hive '.Str::title(fake()->unique()->word());

        return [
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1000, 9999),
            'badge' => strtoupper(fake()->word()),
            'name' => $name,
            'summary' => fake()->sentence(),
            'emphasis' => PpfTier::EMPHASIS_DEFAULT,
            'position' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }

    public function hidden(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
