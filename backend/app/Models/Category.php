<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['parent_id', 'name', 'slug', 'tone', 'position', 'is_active'])]
class Category extends Model
{
    /** @use HasFactory<CategoryFactory> */
    use HasFactory;
    use HasTranslations;

    /** Keys the frontend tone registry knows how to colour. */
    public const TONES = [
        'amber', 'blue', 'emerald', 'fuchsia', 'indigo', 'orange',
        'pink', 'red', 'rose', 'sky', 'slate', 'violet',
    ];

    /**
     * Fields an administrator may translate per locale.
     *
     * @var list<string>
     */
    protected array $translatable = ['name'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('position');
    }

    public function stores(): BelongsToMany
    {
        return $this->belongsToMany(Store::class)->withPivot('position');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function code(): string
    {
        return 'CAT-'.str_pad((string) $this->getKey(), 5, '0', STR_PAD_LEFT);
    }

    public function level(): int
    {
        $level = 0;
        $parent = $this->parent;

        while ($parent) {
            $level++;
            $parent = $parent->parent;
        }

        return $level;
    }

    /**
     * @return list<int>
     */
    public function descendantIds(): array
    {
        $ids = [];
        $frontier = [$this->getKey()];

        while ($frontier !== []) {
            $children = static::query()->whereIn('parent_id', $frontier)->pluck('id')->all();
            $ids = [...$ids, ...array_map('intval', $children)];
            $frontier = $children;
        }

        return $ids;
    }
}
