<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MemberProfile;
use Illuminate\Http\JsonResponse;

class PublicMemberController extends Controller
{
    /**
     * A member's public profile, by username.
     *
     * Only what the member chose to publish: the private profile holds a date
     * of birth, phone number and address book that must never appear here, so
     * this is built field by field rather than filtered from the full resource.
     */
    public function show(string $username): JsonResponse
    {
        $profile = MemberProfile::with(['user'])->where('username', $username)->first();

        $viewer = auth('sanctum')->user();
        $isOwner = $viewer !== null && $profile !== null && $viewer->getKey() === $profile->user_id;

        abort_unless($profile !== null && ($profile->is_public || $isOwner || $viewer?->isAdmin()), 404);

        $user = $profile->user;

        return response()->json([
            'member' => [
                'username' => $profile->username,
                'name' => $profile->publicName(),
                'initials' => $profile->initials(),
                'avatar_url' => $profile->avatarUrl(),
                'bio' => $profile->bio,
                'occupation' => $profile->occupation,
                'website' => $profile->website,
                'pronouns' => $profile->pronouns,
                'verified' => $user?->hasVerifiedEmail() ?? false,
                'member_since' => $user?->created_at?->toIso8601String(),
                'interests' => $user?->interests->map->only(['id', 'name', 'slug', 'tone'])->values() ?? [],
                'show_activity' => $profile->show_activity,
                'show_reviews' => $profile->show_reviews,
                'allow_vendor_contact' => $profile->allow_vendor_contact,
            ],
            'preview' => ! $profile->is_public,
        ]);
    }
}
