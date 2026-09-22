<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'user_id', 'first_name', 'middle_name', 'last_name', 'display_name', 'username',
    'birth_date', 'gender', 'pronouns', 'occupation', 'company', 'website', 'bio',
    'phone', 'language', 'timezone', 'avatar_path',
    'is_public', 'show_activity', 'show_reviews', 'allow_vendor_contact',
    'favorite_business', 'shopping_radius_km',
])]
class MemberProfile extends Model
{
    /** Shares the store media disk, so S3 remains a single config change. */
    public const MEDIA_DISK = Store::MEDIA_DISK;

    public const GENDERS = ['male', 'female', 'non-binary', 'prefer-not-to-say', 'self-describe'];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'is_public' => 'boolean',
            'show_activity' => 'boolean',
            'show_reviews' => 'boolean',
            'allow_vendor_contact' => 'boolean',
            'shopping_radius_km' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function avatarUrl(): ?string
    {
        return $this->avatar_path ? Storage::disk(self::MEDIA_DISK)->url($this->avatar_path) : null;
    }

    /** Falls back through display name, full name, then the account name. */
    public function publicName(): string
    {
        return $this->display_name
            ?: trim("{$this->first_name} {$this->last_name}")
            ?: ($this->user?->name ?? 'Member');
    }

    /** Initials for the placeholder avatar, e.g. "JL". */
    public function initials(): string
    {
        $parts = preg_split('/\s+/', trim($this->publicName())) ?: [];
        $letters = array_map(fn (string $p) => mb_strtoupper(mb_substr($p, 0, 1)), array_slice($parts, 0, 2));

        return implode('', $letters) ?: 'M';
    }
}
