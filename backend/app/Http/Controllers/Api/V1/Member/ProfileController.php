<?php

namespace App\Http\Controllers\Api\V1\Member;

use App\Http\Controllers\Controller;
use App\Http\Resources\MemberProfileResource;
use App\Models\MemberProfile;
use App\Models\NotificationChannel;
use App\Models\NotificationTopic;
use App\Models\Store;
use App\Models\User;
use App\Support\MemberCompleteness;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

/**
 * The signed-in member's own profile.
 *
 * Every action works on $request->user(); there is no member id in any route,
 * so one member can never address another's profile.
 */
class ProfileController extends Controller
{
    private const RELATIONS = ['profile', 'interests', 'addresses', 'notificationPreferences'];

    public function show(Request $request): JsonResponse
    {
        return $this->profile($request->user());
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profileOrNew();

        $validated = $request->validate([
            'first_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'middle_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'last_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'display_name' => ['sometimes', 'nullable', 'string', 'max:100'],
            'username' => [
                'sometimes', 'nullable', 'string', 'min:3', 'max:50', 'lowercase',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('member_profiles', 'username')->ignore($profile->getKey()),
            ],
            'birth_date' => ['sometimes', 'nullable', 'date', 'before:today', 'after:1900-01-01'],
            'gender' => ['sometimes', 'nullable', Rule::in(MemberProfile::GENDERS)],
            'pronouns' => ['sometimes', 'nullable', 'string', 'max:50'],
            'occupation' => ['sometimes', 'nullable', 'string', 'max:150'],
            'company' => ['sometimes', 'nullable', 'string', 'max:150'],
            'website' => ['sometimes', 'nullable', 'url', 'max:255'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:500'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'language' => ['sometimes', 'string', 'max:5'],
            'timezone' => ['sometimes', 'string', 'timezone'],

            'is_public' => ['sometimes', 'boolean'],
            'show_activity' => ['sometimes', 'boolean'],
            'show_reviews' => ['sometimes', 'boolean'],
            'allow_vendor_contact' => ['sometimes', 'boolean'],

            'favorite_business' => ['sometimes', 'nullable', 'string', 'max:150'],
            'shopping_radius_km' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:20000'],
        ]);

        $profile->update($validated);

        return $this->profile($user);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'file' => [
                'required', 'file', 'image',
                // SVG is excluded for the same reason as store media: it can
                // carry script and is served from this application's origin.
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
                Rule::dimensions()->minWidth(120)->minHeight(120),
            ],
        ], [
            'file.dimensions' => 'The photo must be at least 120×120px.',
            'file.max' => 'The photo may not be larger than 2MB.',
        ]);

        $user = $request->user();
        $profile = $user->profileOrNew();
        $previous = $profile->avatar_path;

        $path = $request->file('file')->store("members/{$user->getKey()}/avatar", MemberProfile::MEDIA_DISK);
        $profile->update(['avatar_path' => $path]);

        if ($previous && $previous !== $path) {
            Storage::disk(MemberProfile::MEDIA_DISK)->delete($previous);
        }

        return $this->profile($user);
    }

    public function removeAvatar(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profileOrNew();

        if ($profile->avatar_path) {
            Storage::disk(MemberProfile::MEDIA_DISK)->delete($profile->avatar_path);
            $profile->update(['avatar_path' => null]);
        }

        return $this->profile($user);
    }

    public function interests(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_ids' => ['present', 'array', 'max:20'],
            'category_ids.*' => ['integer', Rule::exists('categories', 'id')->where('is_active', true)],
        ]);

        $request->user()->interests()->sync(
            collect($validated['category_ids'])
                ->unique()
                ->values()
                ->mapWithKeys(fn (int $id, int $index) => [$id => ['position' => $index]])
                ->all(),
        );

        return $this->profile($request->user());
    }

    /**
     * Replaces the whole notification matrix. Mandatory topics are ignored
     * rather than rejected: the UI does not offer them, and a client that sends
     * them anyway should not be able to switch off a security alert.
     */
    public function notifications(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'preferences' => ['present', 'array'],
            'preferences.*' => ['array'],
            'preferences.*.*' => ['boolean'],
        ]);

        $topics = NotificationTopic::active()->get()->keyBy('key');
        $channels = NotificationChannel::active()->get()->keyBy('key');

        DB::transaction(function () use ($user, $validated, $topics, $channels) {
            $user->notificationPreferences()->delete();

            foreach ($validated['preferences'] as $topicKey => $cells) {
                $topic = $topics->get($topicKey);

                if (! $topic || $topic->is_mandatory) {
                    continue;
                }

                foreach ($cells as $channelKey => $enabled) {
                    if (! $channels->has($channelKey)) {
                        continue;
                    }

                    $user->notificationPreferences()->create([
                        'topic_key' => $topicKey,
                        'channel_key' => $channelKey,
                        'enabled' => (bool) $enabled,
                    ]);
                }
            }
        });

        return $this->profile($user);
    }

    public function completeness(Request $request): JsonResponse
    {
        return response()->json(MemberCompleteness::for($request->user())->toArray());
    }

    private function profile(User $user): JsonResponse
    {
        return response()->json([
            'profile' => new MemberProfileResource($user->load(self::RELATIONS)),
        ]);
    }
}
