<?php

namespace App\Models;

use Database\Factories\PpfTierFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['slug', 'badge', 'name', 'summary', 'emphasis', 'position', 'is_active'])]
class PpfTier extends Model
{
    /** @use HasFactory<PpfTierFactory> */
    use HasFactory;

    public const EMPHASIS_DEFAULT = 'default';

    public const EMPHASIS_FEATURED = 'featured';

    public const EMPHASIS_DARK = 'dark';

    public const EMPHASIS_CUSTOM = 'custom';

    /** @var list<string> */
    public const EMPHASES = [
        self::EMPHASIS_DEFAULT,
        self::EMPHASIS_FEATURED,
        self::EMPHASIS_DARK,
        self::EMPHASIS_CUSTOM,
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function plans(): HasMany
    {
        return $this->hasMany(PpfPlan::class);
    }
}
