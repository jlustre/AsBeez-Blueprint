<?php

namespace App\Models;

use Database\Factories\CommissionRuleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name', 'description', 'status', 'calculation_type',
    'percentage_rate', 'fixed_amount', 'min_commission', 'max_commission',
    'applies_to', 'category_id', 'store_id', 'priority',
    'starts_at', 'ends_at', 'min_order_value', 'max_order_value',
    'tax_treatment', 'shipping_treatment', 'discount_treatment', 'refund_treatment',
    'notes',
])]
class CommissionRule extends Model
{
    /** @use HasFactory<CommissionRuleFactory> */
    use HasFactory;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_SCHEDULED = 'scheduled';

    public const STATUS_DISABLED = 'disabled';

    public const STATUS_EXPIRED = 'expired';

    /** @var list<string> */
    public const STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_ACTIVE,
        self::STATUS_SCHEDULED,
        self::STATUS_DISABLED,
    ];

    /** @var list<string> */
    public const EFFECTIVE_STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_ACTIVE,
        self::STATUS_SCHEDULED,
        self::STATUS_DISABLED,
        self::STATUS_EXPIRED,
    ];

    public const CALC_PERCENTAGE = 'percentage';

    public const CALC_FIXED = 'fixed';

    public const CALC_PERCENTAGE_PLUS_FIXED = 'percentage_plus_fixed';

    /** @var list<string> */
    public const CALCULATION_TYPES = [
        self::CALC_PERCENTAGE,
        self::CALC_FIXED,
        self::CALC_PERCENTAGE_PLUS_FIXED,
    ];

    public const APPLIES_ALL = 'all_vendors';

    public const APPLIES_VENDOR = 'selected_vendors';

    public const APPLIES_PRODUCTS = 'products';

    public const APPLIES_SERVICES = 'services';

    public const APPLIES_CATEGORIES = 'categories';

    /** @var list<string> */
    public const APPLIES_TO = [
        self::APPLIES_ALL,
        self::APPLIES_VENDOR,
        self::APPLIES_PRODUCTS,
        self::APPLIES_SERVICES,
        self::APPLIES_CATEGORIES,
    ];

    public const TREAT_EXCLUDE = 'exclude';

    public const TREAT_INCLUDE = 'include';

    /** @var list<string> */
    public const INCLUDE_TREATMENTS = [
        self::TREAT_EXCLUDE,
        self::TREAT_INCLUDE,
    ];

    public const DISCOUNT_AFTER = 'after';

    public const DISCOUNT_BEFORE = 'before';

    /** @var list<string> */
    public const DISCOUNT_TREATMENTS = [
        self::DISCOUNT_AFTER,
        self::DISCOUNT_BEFORE,
    ];

    public const REFUND_PROPORTIONAL = 'proportional';

    public const REFUND_FULL = 'full';

    public const REFUND_RETAIN = 'retain';

    public const REFUND_MANUAL = 'manual';

    /** @var list<string> */
    public const REFUND_TREATMENTS = [
        self::REFUND_PROPORTIONAL,
        self::REFUND_FULL,
        self::REFUND_RETAIN,
        self::REFUND_MANUAL,
    ];

    protected function casts(): array
    {
        return [
            'percentage_rate' => 'decimal:3',
            'fixed_amount' => 'decimal:2',
            'min_commission' => 'decimal:2',
            'max_commission' => 'decimal:2',
            'min_order_value' => 'decimal:2',
            'max_order_value' => 'decimal:2',
            'priority' => 'integer',
            'starts_at' => 'date',
            'ends_at' => 'date',
        ];
    }

    public function code(): string
    {
        return 'RUL-'.str_pad((string) $this->getKey(), 5, '0', STR_PAD_LEFT);
    }

    public function effectiveStatus(): string
    {
        if (in_array($this->status, [self::STATUS_DRAFT, self::STATUS_DISABLED], true)) {
            return $this->status;
        }

        if ($this->ends_at?->isPast()) {
            return self::STATUS_EXPIRED;
        }

        if ($this->status === self::STATUS_SCHEDULED || $this->starts_at?->isFuture()) {
            return $this->starts_at?->isFuture() ? self::STATUS_SCHEDULED : self::STATUS_ACTIVE;
        }

        return self::STATUS_ACTIVE;
    }

    public function rateLabel(): string
    {
        $percent = $this->percentage_rate !== null
            ? rtrim(rtrim(number_format((float) $this->percentage_rate, 3, '.', ''), '0'), '.').'%'
            : null;
        $fixed = $this->fixed_amount !== null
            ? '$'.number_format((float) $this->fixed_amount, 2)
            : null;

        return match ($this->calculation_type) {
            self::CALC_FIXED => $fixed ?? '—',
            self::CALC_PERCENTAGE_PLUS_FIXED => trim(($percent ?? '—').' + '.($fixed ?? '$0.00')),
            default => $percent ?? '—',
        };
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function adminEvents(): HasMany
    {
        return $this->hasMany(CommissionRuleAdminEvent::class)->latest();
    }
}
