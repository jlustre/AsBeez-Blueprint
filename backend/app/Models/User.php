<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements HasLocalePreference, MustVerifyEmailContract
{
    public const ROLE_SUPER_ADMIN = 'super-admin';
    public const ROLE_VENDOR = 'vendor';
    public const ROLE_MEMBER = 'member';

    /**
     * Roles a visitor is allowed to pick for themselves at registration.
     * Administrator accounts are provisioned internally, never self-assigned.
     *
     * @var list<string>
     */
    public const SELF_ASSIGNABLE_ROLES = [self::ROLE_MEMBER, self::ROLE_VENDOR];

    public const STATUS_ACTIVE = 'active';
    public const STATUS_PENDING = 'pending';
    public const STATUS_RESTRICTED = 'restricted';
    public const STATUS_SUSPENDED = 'suspended';
    public const STATUS_DEACTIVATED = 'deactivated';

    /**
     * The account lifecycle, in order of severity.
     *
     * @var list<string>
     */
    public const STATUSES = [
        self::STATUS_ACTIVE,
        self::STATUS_PENDING,
        self::STATUS_RESTRICTED,
        self::STATUS_SUSPENDED,
        self::STATUS_DEACTIVATED,
    ];

    /**
     * Statuses an administrator must justify in writing.
     *
     * Restoring an account needs no defence; taking one away does.
     *
     * @var list<string>
     */
    public const STATUSES_NEEDING_REASON = [
        self::STATUS_RESTRICTED,
        self::STATUS_SUSPENDED,
        self::STATUS_DEACTIVATED,
    ];

    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'status_changed_at' => 'datetime',
            'last_active_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * A vendor may own several stores, and each is an independent entity —
     * its own policies, settings and verification. Nothing in the store domain
     * is scoped to the user.
     */
    public function stores(): HasMany
    {
        return $this->hasMany(Store::class, 'owner_id');
    }

    /** Administrative notes and status changes, newest first. */
    public function adminEvents(): HasMany
    {
        return $this->hasMany(MemberAdminEvent::class)->latest();
    }

    /** The administrator who last moved this account through its lifecycle. */
    public function statusChangedBy(): BelongsTo
    {
        return $this->belongsTo(self::class, 'status_changed_by');
    }

    /** An account that may not sign in or transact. */
    public function isBlocked(): bool
    {
        return in_array($this->status, [self::STATUS_SUSPENDED, self::STATUS_DEACTIVATED], true);
    }

    /**
     * The language this user's notifications are rendered in.
     *
     * Laravel honours this automatically for queued and immediate
     * notifications, so a verification or reset mail arrives in the language
     * the member chose rather than whichever locale the request happened to
     * be in when it was triggered.
     */
    public function preferredLocale(): ?string
    {
        $language = $this->profile?->language;

        return array_key_exists((string) $language, config('locales.supported', []))
            ? $language
            : config('app.locale');
    }

    public function profile(): HasOne
    {
        return $this->hasOne(MemberProfile::class);
    }

    public function partnerApplications(): HasMany
    {
        return $this->hasMany(PartnerApplication::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(MemberAddress::class)->orderBy('position');
    }

    /** Shopping interests, drawn from the same taxonomy stores are filed under. */
    public function interests(): BelongsToMany
    {
        return $this->belongsToMany(Category::class)
            ->withPivot('position')
            ->orderBy('category_user.position');
    }

    public function notificationPreferences(): HasMany
    {
        return $this->hasMany(MemberNotificationPreference::class);
    }

    /**
     * The member's profile row, created on first access so callers never see
     * null.
     *
     * The created row is written back into the loaded relation: without that,
     * a second call in the same request still sees the cached null and tries
     * to insert again, which the unique index on user_id rejects.
     */
    public function profileOrNew(): MemberProfile
    {
        if (! $this->relationLoaded('profile') || $this->profile === null) {
            $this->setRelation('profile', $this->profile()->firstOrCreate([]));
        }

        return $this->profile;
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(self::ROLE_SUPER_ADMIN);
    }
}
