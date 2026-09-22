<?php

namespace App\Models;

use Database\Factories\PpfPlanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'ppf_market_id', 'ppf_tier_id', 'name', 'qualification', 'rate_label',
    'rate_suffix', 'is_featured', 'style', 'cells', 'features',
    'volume_min', 'volume_max', 'subscription_amount', 'percent_rate',
    'percent_rate_max', 'fixed_amount', 'min_fee', 'cap_fee',
    'listing_amount', 'lead_amount', 'position', 'is_active',
])]
class PpfPlan extends Model
{
    /** @use HasFactory<PpfPlanFactory> */
    use HasFactory;

    public const STYLE_DEFAULT = 'default';

    public const STYLE_FEATURED = 'featured';

    public const STYLE_DARK = 'dark';

    /** @var list<string> */
    public const STYLES = [
        self::STYLE_DEFAULT,
        self::STYLE_FEATURED,
        self::STYLE_DARK,
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'cells' => 'array',
            'features' => 'array',
            'volume_min' => 'decimal:2',
            'volume_max' => 'decimal:2',
            'subscription_amount' => 'decimal:2',
            'percent_rate' => 'decimal:3',
            'percent_rate_max' => 'decimal:3',
            'fixed_amount' => 'decimal:2',
            'min_fee' => 'decimal:2',
            'cap_fee' => 'decimal:2',
            'listing_amount' => 'decimal:2',
            'lead_amount' => 'decimal:2',
            'position' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function market(): BelongsTo
    {
        return $this->belongsTo(PpfMarket::class, 'ppf_market_id');
    }

    public function tier(): BelongsTo
    {
        return $this->belongsTo(PpfTier::class, 'ppf_tier_id');
    }
}
