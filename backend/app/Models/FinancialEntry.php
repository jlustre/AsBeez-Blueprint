<?php

namespace App\Models;

use Database\Factories\FinancialEntryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'customer_id', 'store_id', 'order_id',
    'type', 'direction', 'status', 'subject', 'amount', 'currency',
])]
class FinancialEntry extends Model
{
    /** @use HasFactory<FinancialEntryFactory> */
    use HasFactory;

    public const TYPE_PAYMENT = 'payment';

    public const TYPE_PAYOUT = 'payout';

    public const TYPE_REFUND = 'refund';

    public const TYPE_COMMISSION = 'commission';

    public const TYPE_FEE = 'fee';

    public const TYPE_TAX = 'tax';

    public const TYPE_CHARGEBACK = 'chargeback';

    public const TYPE_ADJUSTMENT = 'adjustment';

    /** @var list<string> */
    public const TYPES = [
        self::TYPE_PAYMENT,
        self::TYPE_PAYOUT,
        self::TYPE_REFUND,
        self::TYPE_COMMISSION,
        self::TYPE_FEE,
        self::TYPE_TAX,
        self::TYPE_CHARGEBACK,
        self::TYPE_ADJUSTMENT,
    ];

    public const DIRECTION_IN = 'inflow';

    public const DIRECTION_OUT = 'outflow';

    /** @var list<string> */
    public const DIRECTIONS = [
        self::DIRECTION_IN,
        self::DIRECTION_OUT,
    ];

    public const STATUS_PENDING = 'pending';

    public const STATUS_POSTED = 'posted';

    public const STATUS_FAILED = 'failed';

    public const STATUS_ON_HOLD = 'on_hold';

    public const STATUS_REVERSED = 'reversed';

    /** @var list<string> */
    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_POSTED,
        self::STATUS_FAILED,
        self::STATUS_ON_HOLD,
        self::STATUS_REVERSED,
    ];

    public const STATUSES_NEEDING_REASON = [
        self::STATUS_FAILED,
        self::STATUS_ON_HOLD,
        self::STATUS_REVERSED,
    ];

    /** @var array<string, string> */
    public const TYPE_PREFIXES = [
        self::TYPE_PAYMENT => 'TXN',
        self::TYPE_PAYOUT => 'PAY',
        self::TYPE_REFUND => 'RF',
        self::TYPE_COMMISSION => 'COM',
        self::TYPE_FEE => 'FEE',
        self::TYPE_TAX => 'TAX',
        self::TYPE_CHARGEBACK => 'CB',
        self::TYPE_ADJUSTMENT => 'ADJ',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'status_changed_at' => 'datetime',
        ];
    }

    public function code(): string
    {
        $prefix = self::TYPE_PREFIXES[$this->type] ?? 'FIN';

        return $prefix.'-'.str_pad((string) $this->getKey(), 5, '0', STR_PAD_LEFT);
    }

    public function signedAmount(): float
    {
        $amount = (float) $this->amount;

        return $this->direction === self::DIRECTION_OUT ? -$amount : $amount;
    }

    public function needsAttention(): bool
    {
        return in_array($this->status, [self::STATUS_FAILED, self::STATUS_ON_HOLD], true);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function adminEvents(): HasMany
    {
        return $this->hasMany(FinancialEntryAdminEvent::class)->latest();
    }

    public function statusChangedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'status_changed_by');
    }
}
