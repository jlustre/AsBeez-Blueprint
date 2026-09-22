<?php

namespace Database\Factories;

use App\Models\PpfMarket;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PpfMarket>
 */
class PpfMarketFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $label = Str::title(fake()->unique()->word());

        return [
            'parent_id' => null,
            'slug' => Str::slug($label).'-'.fake()->unique()->numberBetween(1000, 9999),
            'label' => $label,
            'subtitle' => fake()->optional()->words(2, true),
            'description' => fake()->sentence(),
            'has_cards' => false,
            'columns' => [
                ['key' => 'qualification', 'label' => 'Qualification'],
                ['key' => 'subscription', 'label' => 'Subscription'],
                ['key' => 'ppf', 'label' => 'PPF'],
            ],
            'example_note' => null,
            'upgrade_note' => null,
            'compliance_note' => null,
            'footnote' => null,
            'position' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }

    public function hidden(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function childOf(PpfMarket $parent): static
    {
        return $this->state(fn () => ['parent_id' => $parent->getKey()]);
    }
}
