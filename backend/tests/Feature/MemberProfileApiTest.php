<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MemberAddress;
use App\Models\MemberProfile;
use App\Models\NotificationTopic;
use App\Models\User;
use Database\Seeders\MemberStructureSeeder;
use Database\Seeders\ReferenceLocationSeeder;
use Database\Seeders\StoreStructureSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MemberProfileApiTest extends TestCase
{
    use RefreshDatabase;

    private User $member;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(StoreStructureSeeder::class);
        $this->seed(MemberStructureSeeder::class);
        $this->seed(ReferenceLocationSeeder::class);

        $this->member = User::factory()->role(User::ROLE_MEMBER)->create();
    }

    private function asMember(): static
    {
        return $this->actingAs($this->member);
    }

    /* ---------------------------------------------------------------- */
    /* Access                                                            */
    /* ---------------------------------------------------------------- */

    public function test_the_member_area_requires_authentication(): void
    {
        $this->getJson('/api/v1/member/profile')->assertUnauthorized();
        $this->putJson('/api/v1/member/profile', [])->assertUnauthorized();
    }

    public function test_the_profile_is_always_the_callers_own(): void
    {
        $other = User::factory()->role(User::ROLE_MEMBER)->create();
        $other->profileOrNew()->update(['display_name' => 'Someone Else']);

        // No route carries a member id, so there is nothing to tamper with —
        // the response is always the authenticated user's own profile.
        $this->asMember()
            ->getJson('/api/v1/member/profile')
            ->assertOk()
            ->assertJsonPath('profile.id', $this->member->id);
    }

    public function test_a_profile_row_is_created_on_first_read(): void
    {
        $this->assertNull($this->member->profile);

        $this->asMember()->getJson('/api/v1/member/profile')->assertOk();

        $this->assertNotNull($this->member->fresh()->profile);
    }

    public function test_it_returns_the_whole_profile_shape(): void
    {
        $this->asMember()->getJson('/api/v1/member/profile')
            ->assertOk()
            ->assertJsonStructure(['profile' => [
                'id', 'account', 'personal', 'public_profile', 'preferences',
                'interests', 'addresses',
                'notifications' => ['channels', 'topics'],
                'completeness' => ['percent', 'completed', 'total', 'tasks'],
            ]]);
    }

    /* ---------------------------------------------------------------- */
    /* Personal details                                                  */
    /* ---------------------------------------------------------------- */

    public function test_it_updates_personal_details(): void
    {
        $this->asMember()->putJson('/api/v1/member/profile', [
            'first_name' => 'Joey',
            'last_name' => 'Lustre',
            'pronouns' => 'They/Them',
            'bio' => 'Building things on the marketplace.',
        ])->assertOk()->assertJsonPath('profile.personal.first_name', 'Joey');

        $this->assertSame('They/Them', $this->member->fresh()->profile->pronouns);
    }

    public function test_usernames_are_unique_across_members(): void
    {
        $other = User::factory()->role(User::ROLE_MEMBER)->create();
        $other->profileOrNew()->update(['username' => 'taken']);

        $this->asMember()->putJson('/api/v1/member/profile', ['username' => 'taken'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('username');
    }

    public function test_it_rejects_a_malformed_username(): void
    {
        $this->asMember()->putJson('/api/v1/member/profile', ['username' => 'Not A Username'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('username');
    }

    public function test_it_rejects_an_impossible_birth_date(): void
    {
        $this->asMember()->putJson('/api/v1/member/profile', ['birth_date' => now()->addYear()->toDateString()])
            ->assertStatus(422)
            ->assertJsonValidationErrors('birth_date');
    }

    public function test_it_rejects_a_gender_outside_the_offered_options(): void
    {
        $this->asMember()->putJson('/api/v1/member/profile', ['gender' => 'whatever'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('gender');
    }

    public function test_the_biography_is_capped(): void
    {
        $this->asMember()->putJson('/api/v1/member/profile', ['bio' => str_repeat('a', 501)])
            ->assertStatus(422)
            ->assertJsonValidationErrors('bio');
    }

    /* ---------------------------------------------------------------- */
    /* Avatar                                                            */
    /* ---------------------------------------------------------------- */

    public function test_it_uploads_and_replaces_an_avatar(): void
    {
        Storage::fake(MemberProfile::MEDIA_DISK);

        $this->asMember()->post('/api/v1/member/profile/avatar', [
            'file' => UploadedFile::fake()->image('me.png', 400, 400),
        ])->assertOk();

        $first = $this->member->fresh()->profile->avatar_path;
        Storage::disk(MemberProfile::MEDIA_DISK)->assertExists($first);

        $this->asMember()->post('/api/v1/member/profile/avatar', [
            'file' => UploadedFile::fake()->image('me2.png', 400, 400),
        ])->assertOk();

        Storage::disk(MemberProfile::MEDIA_DISK)->assertMissing($first);
    }

    public function test_it_refuses_an_svg_avatar(): void
    {
        Storage::fake(MemberProfile::MEDIA_DISK);

        $this->asMember()->post('/api/v1/member/profile/avatar', [
            'file' => UploadedFile::fake()->createWithContent('me.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'),
        ])->assertStatus(422)->assertJsonValidationErrors('file');
    }

    public function test_it_removes_an_avatar(): void
    {
        Storage::fake(MemberProfile::MEDIA_DISK);

        $this->asMember()->post('/api/v1/member/profile/avatar', [
            'file' => UploadedFile::fake()->image('me.png', 400, 400),
        ])->assertOk();

        $path = $this->member->fresh()->profile->avatar_path;

        $this->asMember()->deleteJson('/api/v1/member/profile/avatar')->assertOk();

        $this->assertNull($this->member->fresh()->profile->avatar_path);
        Storage::disk(MemberProfile::MEDIA_DISK)->assertMissing($path);
    }

    /**
     * Every dashboard shell paints the avatar in its sidebar and top bar from
     * the auth user, not from a member-profile fetch. If it stops travelling
     * on that payload those shells silently fall back to initials forever.
     */
    public function test_the_avatar_travels_on_the_authenticated_user(): void
    {
        Storage::fake(MemberProfile::MEDIA_DISK);

        $this->asMember()->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('user.avatar_url', null);

        $this->asMember()->post('/api/v1/member/profile/avatar', [
            'file' => UploadedFile::fake()->image('me.png', 400, 400),
        ])->assertOk();

        $url = $this->asMember()->getJson('/api/v1/auth/me')
            ->assertOk()
            ->json('user.avatar_url');

        $this->assertNotNull($url, 'The uploaded avatar never reached /auth/me.');
        $this->assertSame(
            $this->member->fresh()->profile->avatarUrl(),
            $url,
            'The auth payload disagrees with the profile about the avatar.',
        );
    }

    public function test_the_authenticated_user_carries_initials_to_fall_back_to(): void
    {
        $this->asMember()->putJson('/api/v1/member/profile', [
            'display_name' => 'Ada Lovelace',
        ])->assertOk();

        $this->asMember()->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('user.avatar_url', null)
            ->assertJsonPath('user.initials', 'AL');
    }

    /* ---------------------------------------------------------------- */
    /* Interests                                                         */
    /* ---------------------------------------------------------------- */

    public function test_interests_come_from_the_shared_category_taxonomy(): void
    {
        $ids = Category::orderBy('position')->limit(3)->pluck('id')->all();

        $this->asMember()->putJson('/api/v1/member/profile/interests', ['category_ids' => $ids])
            ->assertOk()
            ->assertJsonCount(3, 'profile.interests');

        $this->assertSame($ids, $this->member->interests()->pluck('categories.id')->all());
    }

    public function test_it_rejects_an_unknown_interest(): void
    {
        $this->asMember()->putJson('/api/v1/member/profile/interests', ['category_ids' => [99999]])
            ->assertStatus(422);
    }

    /* ---------------------------------------------------------------- */
    /* Addresses                                                         */
    /* ---------------------------------------------------------------- */

    private function address(array $overrides = []): array
    {
        return array_merge([
            'label' => 'Home',
            'recipient' => 'Joey Lustre',
            'line1' => '4567 Beechnut Avenue',
            'city' => 'Burnaby',
            'state' => 'BC',
            'postal_code' => 'V5G 3H2',
            'country' => 'CA',
        ], $overrides);
    }

    public function test_it_adds_an_address_and_makes_the_first_one_the_default(): void
    {
        $this->asMember()->postJson('/api/v1/member/addresses', $this->address())
            ->assertCreated()
            ->assertJsonCount(1, 'profile.addresses');

        $address = $this->member->addresses()->first();

        // The very first address is the default whether or not it said so.
        $this->assertTrue($address->is_default_shipping);
        $this->assertTrue($address->is_default_billing);
    }

    public function test_only_one_address_can_be_the_shipping_default(): void
    {
        $this->asMember()->postJson('/api/v1/member/addresses', $this->address())->assertCreated();
        $this->asMember()->postJson('/api/v1/member/addresses', $this->address([
            'label' => 'Family',
            'is_default_shipping' => true,
        ]))->assertCreated();

        $this->assertSame(1, $this->member->addresses()->where('is_default_shipping', true)->count());
        $this->assertSame('Family', $this->member->addresses()->where('is_default_shipping', true)->value('label'));
    }

    public function test_it_promotes_an_address_to_default(): void
    {
        $this->asMember()->postJson('/api/v1/member/addresses', $this->address())->assertCreated();
        $this->asMember()->postJson('/api/v1/member/addresses', $this->address(['label' => 'Family']))->assertCreated();

        $family = $this->member->addresses()->where('label', 'Family')->first();

        $this->asMember()->putJson("/api/v1/member/addresses/{$family->id}/default", ['kind' => 'shipping'])
            ->assertOk();

        $this->assertTrue($family->fresh()->is_default_shipping);
        $this->assertSame(1, $this->member->addresses()->where('is_default_shipping', true)->count());
    }

    public function test_deleting_the_default_promotes_another_address(): void
    {
        $this->asMember()->postJson('/api/v1/member/addresses', $this->address())->assertCreated();
        $this->asMember()->postJson('/api/v1/member/addresses', $this->address(['label' => 'Family']))->assertCreated();

        $default = $this->member->addresses()->where('is_default_shipping', true)->first();

        $this->asMember()->deleteJson("/api/v1/member/addresses/{$default->id}")->assertOk();

        // The book is never left without a default while addresses remain.
        $this->assertSame(1, $this->member->addresses()->where('is_default_shipping', true)->count());
    }

    public function test_a_member_cannot_touch_another_members_address(): void
    {
        $other = User::factory()->role(User::ROLE_MEMBER)->create();
        $theirs = MemberAddress::create([...$this->address(), 'user_id' => $other->getKey()]);

        $this->asMember()->putJson("/api/v1/member/addresses/{$theirs->id}", ['city' => 'Hijacked'])->assertNotFound();
        $this->asMember()->deleteJson("/api/v1/member/addresses/{$theirs->id}")->assertNotFound();
        $this->asMember()->putJson("/api/v1/member/addresses/{$theirs->id}/default", ['kind' => 'shipping'])->assertNotFound();

        $this->assertSame('Burnaby', $theirs->fresh()->city);
    }

    public function test_an_address_state_must_belong_to_its_country(): void
    {
        $this->asMember()->postJson('/api/v1/member/addresses', $this->address(['country' => 'CA', 'state' => 'TX']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('state');
    }

    public function test_address_names_are_resolved_for_display(): void
    {
        $this->asMember()->postJson('/api/v1/member/addresses', $this->address())
            ->assertCreated()
            ->assertJsonPath('profile.addresses.0.state_name', 'British Columbia')
            ->assertJsonPath('profile.addresses.0.country_name', 'Canada');
    }

    /* ---------------------------------------------------------------- */
    /* Notifications                                                     */
    /* ---------------------------------------------------------------- */

    public function test_the_matrix_starts_from_the_admin_defined_defaults(): void
    {
        $payload = $this->asMember()->getJson('/api/v1/member/profile')->json('profile.notifications');

        $this->assertCount(4, $payload['channels']);
        $this->assertCount(11, $payload['topics']);

        $orders = collect($payload['topics'])->firstWhere('key', 'order_updates');
        $this->assertTrue($orders['channels']['email']);
        $this->assertTrue($orders['is_mandatory']);
    }

    public function test_it_saves_a_changed_matrix(): void
    {
        $this->asMember()->putJson('/api/v1/member/profile/notifications', [
            'preferences' => ['promotions' => ['email' => false, 'in_app' => false]],
        ])->assertOk();

        $topics = collect($this->asMember()->getJson('/api/v1/member/profile')->json('profile.notifications.topics'));
        $promotions = $topics->firstWhere('key', 'promotions');

        $this->assertFalse($promotions['channels']['email']);
        $this->assertFalse($promotions['channels']['in_app']);
    }

    public function test_a_mandatory_topic_cannot_be_switched_off(): void
    {
        $this->assertTrue(NotificationTopic::where('key', 'security_alerts')->value('is_mandatory'));

        $this->asMember()->putJson('/api/v1/member/profile/notifications', [
            'preferences' => ['security_alerts' => ['email' => false]],
        ])->assertOk();

        $topics = collect($this->asMember()->getJson('/api/v1/member/profile')->json('profile.notifications.topics'));

        // The write is ignored, so the default still stands.
        $this->assertTrue($topics->firstWhere('key', 'security_alerts')['channels']['email']);
    }

    public function test_a_channel_needing_a_missing_contact_detail_is_unavailable(): void
    {
        $payload = $this->asMember()->getJson('/api/v1/member/profile')->json('profile.notifications.channels');
        $sms = collect($payload)->firstWhere('key', 'sms');

        // No phone number on the profile yet.
        $this->assertFalse($sms['available']);

        $this->asMember()->putJson('/api/v1/member/profile', ['phone' => '+1 604 555 0148'])->assertOk();

        $payload = $this->asMember()->getJson('/api/v1/member/profile')->json('profile.notifications.channels');
        $this->assertTrue(collect($payload)->firstWhere('key', 'sms')['available']);
    }

    /* ---------------------------------------------------------------- */
    /* Completeness                                                      */
    /* ---------------------------------------------------------------- */

    public function test_completeness_is_computed_not_hard_coded(): void
    {
        $before = $this->asMember()->getJson('/api/v1/member/profile/completeness')->assertOk()->json('percent');

        $this->asMember()->putJson('/api/v1/member/profile', [
            'first_name' => 'Joey',
            'last_name' => 'Lustre',
            'username' => 'joey-lustre',
            'bio' => 'Building things on the marketplace, one listing at a time.',
            'phone' => '+1 604 555 0148',
        ])->assertOk();

        $after = $this->asMember()->getJson('/api/v1/member/profile/completeness')->json('percent');

        $this->assertGreaterThan($before, $after);
    }
}
