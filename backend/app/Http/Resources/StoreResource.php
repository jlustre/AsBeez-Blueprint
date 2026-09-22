<?php

namespace App\Http\Resources;

use App\Models\Country;
use App\Models\CountryRegion;
use App\Models\Store;
use App\Support\StoreCompleteness;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The whole store profile, in the shape the React page consumes.
 *
 * @mixin Store
 */
class StoreResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'tagline' => $this->tagline,
            'description' => $this->description,
            'status' => $this->status,
            'verified_at' => $this->verified_at?->toIso8601String(),

            'media' => [
                'banner_url' => $this->bannerUrl(),
                'logo_url' => $this->logoUrl(),
            ],

            'contact' => [
                'public_email' => $this->public_email,
                'public_phone' => $this->public_phone,
                'website' => $this->website,
            ],

            'location' => [
                'country' => $this->country,
                // Codes are what is stored; names are resolved here so neither
                // the profile form nor the storefront has to look them up.
                'country_name' => $this->countryName(),
                'state' => $this->state,
                'state_name' => $this->regionName(),
                'city' => $this->city,
                'postal_code' => $this->postal_code,
                'address_line' => $this->address_line,
                'hide_address' => $this->hide_address,
                'service_area' => $this->service_area,
                'latitude' => $this->latitude !== null ? (float) $this->latitude : null,
                'longitude' => $this->longitude !== null ? (float) $this->longitude : null,
            ],

            'commerce' => [
                'timezone' => $this->timezone,
                'currency' => $this->currency,
                'language' => $this->language,
                'min_order_amount' => $this->min_order_amount !== null ? (float) $this->min_order_amount : null,
            ],

            'categories' => $this->whenLoaded('categories', fn () => $this->categories->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'tone' => $c->tone,
            ])->values()),

            'hours' => $this->whenLoaded('hours', fn () => $this->hours->map(fn ($h) => [
                'weekday' => $h->weekday,
                'day' => $h->dayName(),
                'opens_at' => $h->opens_at ? substr((string) $h->opens_at, 0, 5) : null,
                'closes_at' => $h->closes_at ? substr((string) $h->closes_at, 0, 5) : null,
                'is_closed' => $h->is_closed,
            ])->values()),

            'socials' => $this->whenLoaded('socials', fn () => $this->socials->map(fn ($s) => [
                'platform_id' => $s->social_platform_id,
                'platform_key' => $s->platform?->key,
                'value' => $s->value,
            ])->values()),

            'policies' => $this->whenLoaded('policies', fn () => $this->policies->map(fn ($p) => [
                'id' => $p->id,
                'policy_type_id' => $p->policy_type_id,
                'type_key' => $p->type?->key,
                'status' => $p->status,
                'body' => $p->body,
                'published_at' => $p->published_at?->toIso8601String(),
            ])->values()),

            'verifications' => $this->whenLoaded('verifications', fn () => $this->verifications->map(fn ($v) => [
                'kind' => $v->kind,
                'status' => $v->status,
                'reference' => $v->reference,
                'verified_at' => $v->verified_at?->toIso8601String(),
            ])->values()),

            'settings' => $this->resolvedSettings(),
            'completeness' => StoreCompleteness::for($this->resource)->toArray(),
        ];
    }

    private function countryName(): ?string
    {
        return $this->country
            ? Country::whereKey($this->country)->value('name') ?? $this->country
            : null;
    }

    /**
     * Falls back to the stored value: countries with no seeded subdivisions
     * keep a free-text state, which is already the display name.
     */
    private function regionName(): ?string
    {
        if (blank($this->state)) {
            return null;
        }

        return CountryRegion::where('country_code', $this->country)
            ->where('code', $this->state)
            ->value('name') ?? $this->state;
    }
}
