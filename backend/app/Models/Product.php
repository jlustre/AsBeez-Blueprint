<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'store_id', 'category_id', 'name', 'slug', 'sku', 'type', 'status',
    'brand', 'tagline', 'description', 'image_path', 'country',
    'price', 'compare_at_price', 'currency',
    'track_inventory', 'stock_qty', 'low_stock_threshold',
    'duration_minutes', 'delivery_method', 'booking_model', 'published_at',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    public const TYPE_PHYSICAL = 'physical';
    public const TYPE_DIGITAL = 'digital';
    public const TYPE_SERVICE = 'service';
    public const TYPE_BUNDLE = 'bundle';
    public const TYPE_CUSTOM = 'custom';

    /** @var list<string> */
    public const TYPES = [
        self::TYPE_PHYSICAL,
        self::TYPE_DIGITAL,
        self::TYPE_SERVICE,
        self::TYPE_BUNDLE,
        self::TYPE_CUSTOM,
    ];

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PENDING = 'pending';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_HIDDEN = 'hidden';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_ARCHIVED = 'archived';

    /** @var list<string> */
    public const STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_PENDING,
        self::STATUS_PUBLISHED,
        self::STATUS_HIDDEN,
        self::STATUS_REJECTED,
        self::STATUS_ARCHIVED,
    ];

    /** Taking a listing off the floor needs a written reason. */
    public const STATUSES_NEEDING_REASON = [
        self::STATUS_HIDDEN,
        self::STATUS_REJECTED,
        self::STATUS_ARCHIVED,
    ];

    public const INVENTORY_IN_STOCK = 'in_stock';
    public const INVENTORY_LOW_STOCK = 'low_stock';
    public const INVENTORY_OUT_OF_STOCK = 'out_of_stock';
    public const INVENTORY_NOT_TRACKED = 'not_tracked';

    public const DELIVERY_ON_SITE = 'on_site';
    public const DELIVERY_REMOTE = 'remote';
    public const DELIVERY_PROVIDER = 'provider_location';
    public const DELIVERY_HYBRID = 'hybrid';

    /** @var list<string> */
    public const DELIVERY_METHODS = [
        self::DELIVERY_ON_SITE,
        self::DELIVERY_REMOTE,
        self::DELIVERY_PROVIDER,
        self::DELIVERY_HYBRID,
    ];

    public const BOOKING_INSTANT = 'instant';
    public const BOOKING_REQUEST = 'request';
    public const BOOKING_QUOTE = 'quote';
    public const BOOKING_NONE = 'none';

    /** @var list<string> */
    public const BOOKING_MODELS = [
        self::BOOKING_INSTANT,
        self::BOOKING_REQUEST,
        self::BOOKING_QUOTE,
        self::BOOKING_NONE,
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'compare_at_price' => 'decimal:2',
            'track_inventory' => 'boolean',
            'stock_qty' => 'integer',
            'low_stock_threshold' => 'integer',
            'duration_minutes' => 'integer',
            'published_at' => 'datetime',
            'status_changed_at' => 'datetime',
        ];
    }

    public function imageUrl(): ?string
    {
        return $this->image_path ? Storage::disk(Store::MEDIA_DISK)->url($this->image_path) : null;
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function adminEvents(): HasMany
    {
        return $this->hasMany(ProductAdminEvent::class)->latest();
    }

    public function statusChangedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'status_changed_by');
    }

    public function inventoryState(): string
    {
        if (! $this->track_inventory) {
            return self::INVENTORY_NOT_TRACKED;
        }

        $qty = (int) ($this->stock_qty ?? 0);

        if ($qty <= 0) {
            return self::INVENTORY_OUT_OF_STOCK;
        }

        $threshold = $this->low_stock_threshold ?? 10;

        return $qty <= $threshold ? self::INVENTORY_LOW_STOCK : self::INVENTORY_IN_STOCK;
    }
}
