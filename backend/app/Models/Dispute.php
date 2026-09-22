<?php

namespace App\Models;

use Database\Factories\DisputeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'customer_id', 'store_id', 'order_id', 'assigned_to',
    'type', 'reason', 'status', 'priority', 'outcome',
    'subject', 'amount', 'currency', 'due_at',
])]
class Dispute extends Model
{
    /** @use HasFactory<DisputeFactory> */
    use HasFactory;

    public const TYPE_ORDER = 'order_dispute';

    public const TYPE_BOOKING = 'booking_dispute';

    public const TYPE_PAYMENT = 'payment_dispute';

    public const TYPE_CHARGEBACK = 'chargeback';

    public const TYPE_SAFETY = 'safety';

    /** @var list<string> */
    public const TYPES = [
        self::TYPE_ORDER,
        self::TYPE_BOOKING,
        self::TYPE_PAYMENT,
        self::TYPE_CHARGEBACK,
        self::TYPE_SAFETY,
    ];

    public const REASON_NOT_RECEIVED = 'not_received';

    public const REASON_DAMAGED = 'damaged';

    public const REASON_UNAUTHORIZED = 'unauthorized';

    public const REASON_NO_SHOW = 'no_show';

    public const REASON_UNSATISFACTORY = 'unsatisfactory';

    public const REASON_OTHER = 'other';

    /** @var list<string> */
    public const REASONS = [
        self::REASON_NOT_RECEIVED,
        self::REASON_DAMAGED,
        self::REASON_UNAUTHORIZED,
        self::REASON_NO_SHOW,
        self::REASON_UNSATISFACTORY,
        self::REASON_OTHER,
    ];

    public const STATUS_NEW = 'new';

    public const STATUS_OPEN = 'open';

    public const STATUS_AWAITING_CUSTOMER = 'awaiting_customer';

    public const STATUS_AWAITING_VENDOR = 'awaiting_vendor';

    public const STATUS_UNDER_REVIEW = 'under_review';

    public const STATUS_ESCALATED = 'escalated';

    public const STATUS_RESOLVED = 'resolved';

    public const STATUS_CLOSED = 'closed';

    /** @var list<string> */
    public const STATUSES = [
        self::STATUS_NEW,
        self::STATUS_OPEN,
        self::STATUS_AWAITING_CUSTOMER,
        self::STATUS_AWAITING_VENDOR,
        self::STATUS_UNDER_REVIEW,
        self::STATUS_ESCALATED,
        self::STATUS_RESOLVED,
        self::STATUS_CLOSED,
    ];

    public const OPEN_STATUSES = [
        self::STATUS_NEW,
        self::STATUS_OPEN,
        self::STATUS_AWAITING_CUSTOMER,
        self::STATUS_AWAITING_VENDOR,
        self::STATUS_UNDER_REVIEW,
        self::STATUS_ESCALATED,
    ];

    public const STATUSES_NEEDING_REASON = [
        self::STATUS_ESCALATED,
        self::STATUS_RESOLVED,
        self::STATUS_CLOSED,
    ];

    public const PRIORITY_LOW = 'low';

    public const PRIORITY_NORMAL = 'normal';

    public const PRIORITY_HIGH = 'high';

    public const PRIORITY_URGENT = 'urgent';

    public const PRIORITY_CRITICAL = 'critical';

    /** @var list<string> */
    public const PRIORITIES = [
        self::PRIORITY_LOW,
        self::PRIORITY_NORMAL,
        self::PRIORITY_HIGH,
        self::PRIORITY_URGENT,
        self::PRIORITY_CRITICAL,
    ];

    public const OUTCOME_NONE = 'none';

    public const OUTCOME_CUSTOMER = 'customer';

    public const OUTCOME_VENDOR = 'vendor';

    public const OUTCOME_SPLIT = 'split';

    public const OUTCOME_DISMISSED = 'dismissed';

    /** @var list<string> */
    public const OUTCOMES = [
        self::OUTCOME_NONE,
        self::OUTCOME_CUSTOMER,
        self::OUTCOME_VENDOR,
        self::OUTCOME_SPLIT,
        self::OUTCOME_DISMISSED,
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'due_at' => 'datetime',
            'status_changed_at' => 'datetime',
        ];
    }

    public function code(): string
    {
        return 'DSP-'.str_pad((string) $this->getKey(), 5, '0', STR_PAD_LEFT);
    }

    public function isOpen(): bool
    {
        return in_array($this->status, self::OPEN_STATUSES, true);
    }

    public function isOverdue(): bool
    {
        return $this->isOpen() && $this->due_at !== null && $this->due_at->isPast();
    }

    public function needsAttention(): bool
    {
        return $this->isOpen() && (
            $this->status === self::STATUS_ESCALATED
            || in_array($this->priority, [self::PRIORITY_URGENT, self::PRIORITY_CRITICAL], true)
            || $this->isOverdue()
        );
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

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function adminEvents(): HasMany
    {
        return $this->hasMany(DisputeAdminEvent::class)->latest();
    }

    public function statusChangedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'status_changed_by');
    }
}
