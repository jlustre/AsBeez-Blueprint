<?php

namespace App\Support;

use App\Models\Product;

/**
 * How finished a listing is, from fields that actually exist.
 *
 * The admin template used to show a hard-coded quality score. This number
 * moves when the listing fills in name, SKU, copy, category and price.
 */
class ProductCompleteness
{
    public function __construct(private readonly Product $product)
    {
    }

    public static function for(Product $product): self
    {
        return new self($product);
    }

    /**
     * @return array{percent: int, completed: int, total: int, remaining: int, tasks: list<array<string, mixed>>}
     */
    public function toArray(): array
    {
        $tasks = $this->tasks();
        $completed = count(array_filter($tasks, fn (array $task) => $task['done']));
        $total = count($tasks);

        return [
            'percent' => $total > 0 ? (int) round($completed / $total * 100) : 0,
            'completed' => $completed,
            'total' => $total,
            'remaining' => $total - $completed,
            'tasks' => $tasks,
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function tasks(): array
    {
        $product = $this->product;

        return [
            $this->task('name', filled($product->name)),
            $this->task('sku', filled($product->sku)),
            $this->task('tagline', filled($product->tagline)),
            $this->task('description', mb_strlen((string) $product->description) >= 40),
            $this->task('category', $product->category_id !== null),
            $this->task('price', $product->price !== null),
            $this->task('brand', filled($product->brand)),
            ...($product->type === Product::TYPE_SERVICE ? [
                $this->task('duration', $product->duration_minutes !== null),
                $this->task('delivery', filled($product->delivery_method)),
                $this->task('booking', filled($product->booking_model)),
            ] : []),
        ];
    }

    /**
     * @return array{key: string, done: bool}
     */
    private function task(string $key, bool $done): array
    {
        return ['key' => $key, 'done' => $done];
    }
}
