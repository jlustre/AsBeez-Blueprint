<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmailContract
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

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(self::ROLE_SUPER_ADMIN);
    }
}
