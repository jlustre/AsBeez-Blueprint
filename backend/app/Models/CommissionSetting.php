<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * Singleton marketplace defaults used when no higher-priority rule matches.
 *
 * Rates stay null until an administrator saves them — this is not a seeded
 * 12% marketplace. Settlements and payouts are not represented here.
 */
#[Fillable([
    'global_rate', 'product_rate', 'service_rate', 'fixed_fee',
    'min_commission', 'max_commission', 'tax_treatment', 'discount_treatment',
    'reserve_days', 'rounding', 'currency',
    'include_shipping', 'include_taxes', 'auto_refund_reversal',
    'allow_negative_balances', 'approve_adjustments',
])]
class CommissionSetting extends Model
{
    public const ROUND_HALF_UP = 'half_up';

    public const ROUND_DOWN = 'down';

    public const ROUND_BANKERS = 'bankers';

    /** @var list<string> */
    public const ROUNDINGS = [
        self::ROUND_HALF_UP,
        self::ROUND_DOWN,
        self::ROUND_BANKERS,
    ];

    /** @var list<string> */
    public const CURRENCIES = ['USD', 'CAD'];

    protected function casts(): array
    {
        return [
            'global_rate' => 'decimal:3',
            'product_rate' => 'decimal:3',
            'service_rate' => 'decimal:3',
            'fixed_fee' => 'decimal:2',
            'min_commission' => 'decimal:2',
            'max_commission' => 'decimal:2',
            'reserve_days' => 'integer',
            'include_shipping' => 'boolean',
            'include_taxes' => 'boolean',
            'auto_refund_reversal' => 'boolean',
            'allow_negative_balances' => 'boolean',
            'approve_adjustments' => 'boolean',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function defaults(): array
    {
        return [
            'global_rate' => null,
            'product_rate' => null,
            'service_rate' => null,
            'fixed_fee' => null,
            'min_commission' => null,
            'max_commission' => null,
            'tax_treatment' => CommissionRule::TREAT_EXCLUDE,
            'discount_treatment' => CommissionRule::DISCOUNT_AFTER,
            'reserve_days' => null,
            'rounding' => self::ROUND_HALF_UP,
            'currency' => 'USD',
            'include_shipping' => false,
            'include_taxes' => false,
            'auto_refund_reversal' => false,
            'allow_negative_balances' => false,
            'approve_adjustments' => false,
        ];
    }

    public static function current(): self
    {
        return static::query()->first() ?? static::make(self::defaults());
    }
}
