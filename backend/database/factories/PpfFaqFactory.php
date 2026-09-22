<?php

namespace Database\Factories;

use App\Models\PpfFaq;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PpfFaq>
 */
class PpfFaqFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'question' => fake()->unique()->sentence().'?',
            'answer' => fake()->paragraph(),
            'position' => fake()->numberBetween(0, 20),
            'is_active' => true,
        ];
    }

    public function hidden(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
