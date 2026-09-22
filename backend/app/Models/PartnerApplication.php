<?php

namespace App\Models;

use App\Support\PartnerApplicationCompleteness;
use Database\Factories\PartnerApplicationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id', 'reference', 'status', 'current_step',
    'partnership_type',
    'business_name', 'display_name', 'tagline', 'about', 'website', 'profile_country',
    'contact_name', 'contact_email', 'contact_phone', 'contact_role',
    'legal_name', 'entity_type', 'registration_number', 'year_established',
    'address_line', 'city', 'state', 'postal_code', 'business_country',
    'offering', 'categories', 'primary_product_category', 'product_count',
    'product_condition', 'avg_product_price', 'low_price', 'high_price',
    'inventory_ownership', 'seller_relationship', 'product_origin', 'regulated',
    'primary_service_category', 'delivery_method', 'service_area', 'booking_duration',
    'avg_service_price', 'team_size', 'professional_licenses', 'insurance_coverage',
    'store_name', 'store_slug', 'brand_story', 'public_email', 'public_phone',
    'fulfillment_method', 'ships_from', 'handling_days', 'service_radius_km', 'operates_remotely',
    'payout_method', 'payout_account_holder', 'payout_country', 'payout_currency',
    'tax_registered', 'tax_id', 'tax_country',
    'identity_document_type', 'identity_full_name',
    'accepted_terms', 'accepted_ppa', 'accepted_seller_standards', 'agreements_accepted_at',
    'changes_step', 'reviewer_note', 'applicant_reply', 'decision_reason',
    'submitted_at', 'decision_at', 'reapply_after',
])]
#[Hidden(['tax_id'])]
class PartnerApplication extends Model
{
    /** @use HasFactory<PartnerApplicationFactory> */
    use HasFactory;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_SUBMITTED = 'submitted';
    public const STATUS_CHANGES_REQUESTED = 'changes_requested';
    public const STATUS_UNDER_REVIEW = 'under_review';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    public const STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_SUBMITTED,
        self::STATUS_CHANGES_REQUESTED,
        self::STATUS_UNDER_REVIEW,
        self::STATUS_APPROVED,
        self::STATUS_REJECTED,
    ];

    public const EDITABLE = [
        self::STATUS_DRAFT,
        self::STATUS_CHANGES_REQUESTED,
    ];

    /**
     * The market a store sells in — the seven root category slugs.
     *
     * One per application, because one store belongs to one market. A vendor
     * who sells across two opens a second store: `stores` is a hasMany on the
     * owner, and `current()` hands back the latest application, so applying
     * again starts a fresh one.
     *
     * Mirrored here rather than read from `categories` so validation does not
     * depend on seed state; the roots are a product decision, not an
     * admin-editable list.
     */
    public const PARTNERSHIP_TYPES = [
        'physical-products',
        'digital-products',
        'professional-services',
        'real-estate',
        'automotive',
        'insurance',
        'travel',
    ];

    public const OFFERINGS = ['products', 'services', 'both'];
    public const ENTITY_TYPES = ['sole_proprietor', 'llc', 'corporation', 'partnership', 'nonprofit', 'other'];
    public const CONDITIONS = ['new', 'refurbished', 'used'];
    public const INVENTORY = ['own', 'made', 'drop'];
    public const RELATIONSHIPS = ['brand', 'reseller', 'distributor'];
    public const DELIVERIES = ['both', 'inPerson', 'remote'];
    public const INSURANCE = ['general', 'professional', 'none'];
    public const FULFILLMENT = ['own_stock', 'made_to_order', 'dropship', 'service_only'];
    public const PAYOUT_METHODS = ['bank', 'paypal', 'other'];
    public const IDENTITY_TYPES = ['passport', 'national_id', 'drivers_license', 'business_license'];
    public const FILE_KINDS = ['catalog', 'service_listing', 'identity', 'license', 'logo'];
    public const CATEGORIES = ['home', 'electronics', 'beauty', 'pro', 'homeServices', 'auto', 'food', 'education'];

    public const MEDIA_DISK = Store::MEDIA_DISK;
    public const TOTAL_STEPS = 12;

    protected function casts(): array
    {
        return [
            'categories' => 'array',
            'regulated' => 'boolean',
            'operates_remotely' => 'boolean',
            'tax_registered' => 'boolean',
            'accepted_terms' => 'boolean',
            'accepted_ppa' => 'boolean',
            'accepted_seller_standards' => 'boolean',
            'avg_product_price' => 'decimal:2',
            'low_price' => 'decimal:2',
            'high_price' => 'decimal:2',
            'avg_service_price' => 'decimal:2',
            'agreements_accepted_at' => 'datetime',
            'submitted_at' => 'datetime',
            'decision_at' => 'datetime',
            'reapply_after' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(PartnerApplicationFile::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(PartnerApplicationEvent::class)->latest();
    }

    public function canEdit(): bool
    {
        return in_array($this->status, self::EDITABLE, true);
    }

    public function completeness(): PartnerApplicationCompleteness
    {
        return PartnerApplicationCompleteness::for($this);
    }

    public function recordEvent(string $action, string $actor = 'applicant', ?int $step = null): PartnerApplicationEvent
    {
        return $this->events()->create([
            'action' => $action,
            'actor' => $actor,
            'step' => $step ?? $this->current_step,
        ]);
    }

    public static function nextReference(): string
    {
        $year = now()->year;
        $last = static::query()
            ->where('reference', 'like', "ASB-APP-{$year}-%")
            ->orderByDesc('id')
            ->value('reference');

        $sequence = 1;

        if (is_string($last) && preg_match('/ASB-APP-\d{4}-(\d+)$/', $last, $match)) {
            $sequence = ((int) $match[1]) + 1;
        }

        return sprintf('ASB-APP-%d-%05d', $year, $sequence);
    }
}
