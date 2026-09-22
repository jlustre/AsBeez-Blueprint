<?php

namespace App\Http\Resources;

use App\Models\Country;
use App\Models\CountryRegion;
use App\Models\MemberAddress;
use App\Models\NotificationChannel;
use App\Models\NotificationTopic;
use App\Models\User;
use App\Support\MemberCompleteness;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The member profile in the shape the page consumes.
 *
 * @mixin User
 */
class MemberProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var User $user */
        $user = $this->resource;
        $profile = $user->profileOrNew();

        return [
            'id' => $user->id,
            'account' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                'member_since' => $user->created_at?->toIso8601String(),
            ],

            'personal' => [
                'first_name' => $profile->first_name,
                'middle_name' => $profile->middle_name,
                'last_name' => $profile->last_name,
                'display_name' => $profile->display_name,
                'username' => $profile->username,
                'birth_date' => $profile->birth_date?->toDateString(),
                'gender' => $profile->gender,
                'pronouns' => $profile->pronouns,
                'occupation' => $profile->occupation,
                'company' => $profile->company,
                'website' => $profile->website,
                'bio' => $profile->bio,
                'phone' => $profile->phone,
                'language' => $profile->language,
                'timezone' => $profile->timezone,
            ],

            'public_profile' => [
                'is_public' => $profile->is_public,
                'show_activity' => $profile->show_activity,
                'show_reviews' => $profile->show_reviews,
                'allow_vendor_contact' => $profile->allow_vendor_contact,
                'avatar_url' => $profile->avatarUrl(),
                'initials' => $profile->initials(),
                'public_name' => $profile->publicName(),
            ],

            'preferences' => [
                'favorite_business' => $profile->favorite_business,
                'shopping_radius_km' => $profile->shopping_radius_km,
            ],

            'interests' => $user->interests->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'tone' => $c->tone,
            ])->values(),

            'addresses' => $user->addresses->map(fn (MemberAddress $a) => [
                'id' => $a->id,
                'label' => $a->label,
                'recipient' => $a->recipient,
                'line1' => $a->line1,
                'line2' => $a->line2,
                'city' => $a->city,
                'state' => $a->state,
                'state_name' => $this->regionName($a->country, $a->state),
                'postal_code' => $a->postal_code,
                'country' => $a->country,
                'country_name' => Country::whereKey($a->country)->value('name') ?? $a->country,
                'phone' => $a->phone,
                'is_default_shipping' => $a->is_default_shipping,
                'is_default_billing' => $a->is_default_billing,
            ])->values(),

            'notifications' => $this->notificationMatrix($user),
            'completeness' => MemberCompleteness::for($user)->toArray(),
        ];
    }

    private function regionName(?string $country, ?string $code): ?string
    {
        if (blank($code)) {
            return null;
        }

        return CountryRegion::where('country_code', $country)->where('code', $code)->value('name') ?? $code;
    }

    /**
     * Topics and channels from the admin registry, with each member's saved
     * answers layered over the topic defaults.
     *
     * @return array<string, mixed>
     */
    private function notificationMatrix(User $user): array
    {
        $channels = NotificationChannel::active()->orderBy('position')->get();
        $topics = NotificationTopic::active()->orderBy('position')->get();
        $saved = $user->notificationPreferences
            ->mapWithKeys(fn ($p) => ["{$p->topic_key}|{$p->channel_key}" => $p->enabled]);

        return [
            'channels' => $channels->map(fn ($c) => [
                'key' => $c->key,
                'label' => $c->label,
                // A channel needing a contact detail the member has not given
                // is reported as unavailable rather than silently failing.
                'available' => $this->channelAvailable($c->requires, $user),
            ])->values(),

            'topics' => $topics->map(function (NotificationTopic $topic) use ($channels, $saved) {
                $defaults = $topic->default_channels ?? [];

                return [
                    'key' => $topic->key,
                    'label' => $topic->label,
                    'group' => $topic->group,
                    'is_mandatory' => $topic->is_mandatory,
                    'channels' => $channels->mapWithKeys(fn ($channel) => [
                        $channel->key => $saved["{$topic->key}|{$channel->key}"]
                            ?? in_array($channel->key, $defaults, true),
                    ]),
                ];
            })->values(),
        ];
    }

    private function channelAvailable(?string $requires, User $user): bool
    {
        return match ($requires) {
            'email' => filled($user->email),
            'phone' => filled($user->profile?->phone),
            default => true,
        };
    }
}
