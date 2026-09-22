<?php

namespace App\Models;

use Database\Factories\PpfMarketFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'parent_id', 'slug', 'label', 'subtitle', 'description', 'has_cards',
    'columns', 'example_note', 'upgrade_note', 'compliance_note', 'footnote',
    'position', 'is_active',
])]
class PpfMarket extends Model
{
    /** @use HasFactory<PpfMarketFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'has_cards' => 'boolean',
            'columns' => 'array',
            'position' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('position')->orderBy('id');
    }

    public function plans(): HasMany
    {
        return $this->hasMany(PpfPlan::class)->orderBy('position')->orderBy('id');
    }
}
