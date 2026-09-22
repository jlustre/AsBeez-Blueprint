<?php

namespace Database\Factories;

use App\Models\PpfMarket;
use App\Models\PpfPlan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PpfPlan>
 */
class PpfPlanFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ppf_market_id' => PpfMarket::factory(),
            'ppf_tier_id' => null,
            'name' => 'Hive '.Str::title(fake()->unique()->word()),
            'qualification' => 'Under $'.fake()->numberBetween(2, 10).'k',
            'rate_label' => fake()->numberBetween(6, 12).'%',
            'rate_suffix' => 'PPF',
            'is_featured' => false,
            'style' => PpfPlan::STYLE_DEFAULT,
            'cells' => [
                'qualification' => 'Under $5k GMV',
                'subscription' => '$0',
                'ppf' => '10%',
            ],
            'features' => [],
            'volume_min' => 0,
            'volume_max' => 5000,
            'subscription_amount' => 0,
            'percent_rate' => 10,
            'percent_rate_max' => null,
            'fixed_amount' => null,
            'min_fee' => 0.30,
            'cap_fee' => 100,
            'listing_amount' => null,
            'lead_amount' => null,
            'position' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }

    public function hidden(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
