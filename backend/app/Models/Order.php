<?php

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'customer_id', 'store_id', 'product_id',
    'type', 'status', 'payment_status', 'fulfillment_status', 'appointment_status',
    'item_name', 'item_count', 'total', 'currency', 'scheduled_at',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    public const TYPE_PRODUCT = 'product_order';

    public const TYPE_BOOKING = 'service_booking';

    /** @var list<string> */
    public const TYPES = [
        self::TYPE_PRODUCT,
        self::TYPE_BOOKING,
    ];

    public const STATUS_NEW = 'new';

    public const STATUS_CONFIRMED = 'confirmed';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_CANCELLED = 'cancelled';

    public const STATUS_ON_HOLD = 'on_hold';

    /** @var list<string> */
    public const STATUSES = [
        self::STATUS_NEW,
        self::STATUS_CONFIRMED,
        self::STATUS_IN_PROGRESS,
        self::STATUS_COMPLETED,
        self::STATUS_CANCELLED,
        self::STATUS_ON_HOLD,
    ];

    public const STATUSES_NEEDING_REASON = [
        self::STATUS_CANCELLED,
        self::STATUS_ON_HOLD,
    ];

    public const PAYMENT_NONE = 'none';

    public const PAYMENT_PENDING = 'pending';

    public const PAYMENT_AUTHORIZED = 'authorized';

    public const PAYMENT_PAID = 'paid';

    public const PAYMENT_FAILED = 'failed';

    public const PAYMENT_REFUNDED = 'refunded';

    /** @var list<string> */
    public const PAYMENT_STATUSES = [
        self::PAYMENT_NONE,
        self::PAYMENT_PENDING,
        self::PAYMENT_AUTHORIZED,
        self::PAYMENT_PAID,
        self::PAYMENT_FAILED,
        self::PAYMENT_REFUNDED,
    ];

    public const FULFILLMENT_UNFULFILLED = 'unfulfilled';

    public const FULFILLMENT_PROCESSING = 'processing';

    public const FULFILLMENT_SHIPPED = 'shipped';

    public const FULFILLMENT_DELIVERED = 'delivered';

    public const FULFILLMENT_READY = 'ready_for_pickup';

    public const FULFILLMENT_NA = 'not_applicable';

    /** @var list<string> */
    public const FULFILLMENT_STATUSES = [
        self::FULFILLMENT_UNFULFILLED,
        self::FULFILLMENT_PROCESSING,
        self::FULFILLMENT_SHIPPED,
        self::FULFILLMENT_DELIVERED,
        self::FULFILLMENT_READY,
        self::FULFILLMENT_NA,
    ];

    public const APPOINTMENT_SCHEDULED = 'scheduled';

    public const APPOINTMENT_ASSIGNED = 'assigned';

    public const APPOINTMENT_IN_PROGRESS = 'in_progress';

    public const APPOINTMENT_COMPLETED = 'completed';

    public const APPOINTMENT_NO_SHOW = 'no_show';

    public const APPOINTMENT_NA = 'not_applicable';

    /** @var list<string> */
    public const APPOINTMENT_STATUSES = [
        self::APPOINTMENT_SCHEDULED,
        self::APPOINTMENT_ASSIGNED,
        self::APPOINTMENT_IN_PROGRESS,
        self::APPOINTMENT_COMPLETED,
        self::APPOINTMENT_NO_SHOW,
        self::APPOINTMENT_NA,
    ];

    protected function casts(): array
    {
        return [
            'item_count' => 'integer',
            'total' => 'decimal:2',
            'scheduled_at' => 'datetime',
            'status_changed_at' => 'datetime',
        ];
    }

    public function code(): string
    {
        $prefix = $this->type === self::TYPE_BOOKING ? 'BKG' : 'ASB';

        return $prefix.'-'.str_pad((string) $this->getKey(), 5, '0', STR_PAD_LEFT);
    }

    public function needsAttention(): bool
    {
        return $this->status === self::STATUS_ON_HOLD
            || $this->payment_status === self::PAYMENT_FAILED;
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function adminEvents(): HasMany
    {
        return $this->hasMany(OrderAdminEvent::class)->latest();
    }

    public function statusChangedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'status_changed_by');
    }
}
