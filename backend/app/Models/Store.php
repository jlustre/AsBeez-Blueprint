<?php

namespace App\Models;

use Database\Factories\StoreFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'owner_id', 'name', 'slug', 'tagline', 'description',
    'banner_path', 'logo_path',
    'public_email', 'public_phone', 'website',
    'country', 'state', 'city', 'postal_code', 'address_line', 'hide_address',
    'service_area', 'latitude', 'longitude',
    'timezone', 'currency', 'language', 'min_order_amount',
    'status', 'verified_at',
])]
class Store extends Model
{
    /** @use HasFactory<StoreFactory> */
    use HasFactory, SoftDeletes;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_PAUSED = 'paused';
    public const STATUS_SUSPENDED = 'suspended';

    /** Verification kinds a store is scored on. */
    public const VERIFICATION_KINDS = ['business', 'identity', 'email', 'phone', 'payment'];

    /** The disk media is written to — swap the disk, not this model, for S3. */
    public const MEDIA_DISK = 'store_media';

    protected function casts(): array
    {
        return [
            'hide_address' => 'boolean',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'min_order_amount' => 'decimal:2',
            'verified_at' => 'datetime',
        ];
    }

    /* ---------------------------------------------------------------- */
    /* Relationships                                                     */
    /* ---------------------------------------------------------------- */

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function hours(): HasMany
    {
        return $this->hasMany(StoreHour::class)->orderBy('weekday');
    }

    public function socials(): HasMany
    {
        return $this->hasMany(StoreSocial::class);
    }

    public function policies(): HasMany
    {
        return $this->hasMany(StorePolicy::class);
    }

    public function settingValues(): HasMany
    {
        return $this->hasMany(StoreSettingValue::class);
    }

    public function categories(): BelongsToMany
    {
        // Qualified: both `categories` and the pivot carry a `position`, so an
        // unqualified order by is ambiguous.
        return $this->belongsToMany(Category::class)
            ->withPivot('position')
            ->orderBy('category_store.position');
    }

    public function verifications(): HasMany
    {
        return $this->hasMany(StoreVerification::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /* ---------------------------------------------------------------- */
    /* Helpers                                                           */
    /* ---------------------------------------------------------------- */

    public function isOwnedBy(User $user): bool
    {
        return $this->owner_id === $user->getKey();
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeOwnedBy($query, User $user)
    {
        return $query->where('owner_id', $user->getKey());
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Saved values merged over the admin-defined defaults, so a store that has
     * never touched a setting still reports the platform default.
     *
     * @return array<string, string|null>
     */
    public function resolvedSettings(): array
    {
        $defaults = SettingDefinition::query()->pluck('default_value', 'key')->all();
        $saved = $this->settingValues()->pluck('value', 'setting_key')->all();

        return array_merge($defaults, $saved);
    }

    public function bannerUrl(): ?string
    {
        return $this->banner_path ? Storage::disk(self::MEDIA_DISK)->url($this->banner_path) : null;
    }

    public function logoUrl(): ?string
    {
        return $this->logo_path ? Storage::disk(self::MEDIA_DISK)->url($this->logo_path) : null;
    }
}
