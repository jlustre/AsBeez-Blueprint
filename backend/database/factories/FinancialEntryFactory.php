<?php

namespace Database\Factories;

use App\Models\FinancialEntry;
use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FinancialEntry>
 */
class FinancialEntryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => User::factory(),
            'store_id' => Store::factory(),
            'order_id' => null,
            'type' => FinancialEntry::TYPE_PAYMENT,
            'direction' => FinancialEntry::DIRECTION_IN,
            'status' => FinancialEntry::STATUS_PENDING,
            'subject' => fake()->sentence(3),
            'amount' => fake()->randomFloat(2, 12, 220),
            'currency' => 'USD',
        ];
    }

    public function payout(): static
    {
        return $this->state(fn () => [
            'type' => FinancialEntry::TYPE_PAYOUT,
            'direction' => FinancialEntry::DIRECTION_OUT,
            'customer_id' => null,
        ]);
    }

    public function refund(): static
    {
        return $this->state(fn () => [
            'type' => FinancialEntry::TYPE_REFUND,
            'direction' => FinancialEntry::DIRECTION_OUT,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => ['status' => FinancialEntry::STATUS_FAILED]);
    }

    public function forOrder(Order $order): static
    {
        return $this->state(fn () => [
            'customer_id' => $order->customer_id,
            'store_id' => $order->store_id,
            'order_id' => $order->getKey(),
            'subject' => $order->item_name,
            'amount' => $order->total ?? 0,
            'currency' => $order->currency ?: 'USD',
        ]);
    }
}
