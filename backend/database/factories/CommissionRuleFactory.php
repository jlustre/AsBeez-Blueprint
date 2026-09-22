<?php

namespace Database\Factories;

use App\Models\CommissionRule;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<CommissionRule>
 */
class CommissionRuleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => Str::title(fake()->unique()->words(3, true)).' Rate',
            'description' => fake()->optional()->sentence(),
            'status' => CommissionRule::STATUS_DRAFT,
            'calculation_type' => CommissionRule::CALC_PERCENTAGE,
            'percentage_rate' => fake()->randomFloat(1, 4, 18),
            'fixed_amount' => null,
            'min_commission' => null,
            'max_commission' => null,
            'applies_to' => CommissionRule::APPLIES_ALL,
            'category_id' => null,
            'store_id' => null,
            'priority' => fake()->numberBetween(5, 200),
            'starts_at' => null,
            'ends_at' => null,
            'min_order_value' => null,
            'max_order_value' => null,
            'tax_treatment' => CommissionRule::TREAT_EXCLUDE,
            'shipping_treatment' => CommissionRule::TREAT_EXCLUDE,
            'discount_treatment' => CommissionRule::DISCOUNT_AFTER,
            'refund_treatment' => CommissionRule::REFUND_PROPORTIONAL,
            'notes' => null,
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'status' => CommissionRule::STATUS_ACTIVE,
            'starts_at' => now()->subMonth()->toDateString(),
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn () => [
            'status' => CommissionRule::STATUS_SCHEDULED,
            'starts_at' => now()->addMonth()->toDateString(),
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'status' => CommissionRule::STATUS_ACTIVE,
            'starts_at' => now()->subMonths(6)->toDateString(),
            'ends_at' => now()->subDay()->toDateString(),
        ]);
    }
}
