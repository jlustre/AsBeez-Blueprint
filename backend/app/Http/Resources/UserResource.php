<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // The avatar hangs off the member profile, but every dashboard shell
        // shows it in the sidebar and top bar, so it travels with the account
        // rather than making each shell fetch a whole profile for one URL.
        // Read-only: unlike profileOrNew(), this never writes a row.
        $profile = $this->relationLoaded('profile') ? $this->profile : $this->profile()->first();

        // initials() falls back through publicName() to the account name; hand
        // it the user we already have so it does not query back for one.
        $profile?->setRelation('user', $this->resource);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'avatar_url' => $profile?->avatarUrl(),
            'initials' => $profile?->initials() ?? mb_strtoupper(mb_substr($this->name, 0, 1)),
        ];
    }
}
