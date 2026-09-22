<?php

namespace Database\Factories;

use App\Models\Dispute;
use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Dispute>
 */
class DisputeFactory extends Factory
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
            'assigned_to' => null,
            'type' => Dispute::TYPE_ORDER,
            'reason' => Dispute::REASON_NOT_RECEIVED,
            'status' => Dispute::STATUS_NEW,
            'priority' => Dispute::PRIORITY_NORMAL,
            'outcome' => Dispute::OUTCOME_NONE,
            'subject' => fake()->sentence(4),
            'amount' => fake()->randomFloat(2, 20, 240),
            'currency' => 'USD',
        ];
    }

    public function forStore(Store $store): static
    {
        return $this->state(fn () => [
            'store_id' => $store->getKey(),
            'currency' => $store->currency ?: 'USD',
        ]);
    }

    public function forOrder(Order $order): static
    {
        $booking = $order->type === Order::TYPE_BOOKING;

        return $this->state(fn () => [
            'customer_id' => $order->customer_id,
            'store_id' => $order->store_id,
            'order_id' => $order->getKey(),
            'type' => $booking ? Dispute::TYPE_BOOKING : Dispute::TYPE_ORDER,
            'subject' => $order->item_name,
            'amount' => $order->total,
            'currency' => $order->currency ?: 'USD',
        ]);
    }

    public function escalated(): static
    {
        return $this->state(fn () => [
            'status' => Dispute::STATUS_ESCALATED,
            'priority' => Dispute::PRIORITY_CRITICAL,
        ]);
    }

    public function overdue(): static
    {
        return $this->state(fn () => [
            'status' => Dispute::STATUS_OPEN,
            'due_at' => now()->subHours(6),
        ]);
    }
}
