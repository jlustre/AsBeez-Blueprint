<?php

namespace Tests\Feature;

use App\Models\MemberAddress;
use App\Models\MemberAdminEvent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMemberApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->role(User::ROLE_SUPER_ADMIN)->create();
    }

    private function asAdmin(): static
    {
        return $this->actingAs($this->admin);
    }

    public function test_the_list_requires_an_administrator(): void
    {
        $this->getJson('/api/v1/admin/members')->assertUnauthorized();

        $this->actingAs(User::factory()->role(User::ROLE_MEMBER)->create())
            ->getJson('/api/v1/admin/members')
            ->assertForbidden();
    }

    public function test_the_list_only_includes_member_accounts(): void
    {
        $member = User::factory()->role(User::ROLE_MEMBER)->create(['name' => 'Ada Lovelace']);
        User::factory()->role(User::ROLE_VENDOR)->create(['name' => 'Vendor Person']);
        User::factory()->role(User::ROLE_SUPER_ADMIN)->create(['name' => 'Other Admin']);

        $this->asAdmin()
            ->getJson('/api/v1/admin/members')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('members.0.id', $member->id)
            ->assertJsonPath('stats.total', 1);
    }

    public function test_the_list_can_be_filtered_and_sorted(): void
    {
        $verified = User::factory()->role(User::ROLE_MEMBER)->create([
            'name' => 'Verified Member',
            'status' => User::STATUS_ACTIVE,
            'created_at' => now()->subDays(10),
        ]);
        $pending = User::factory()->role(User::ROLE_MEMBER)->unverified()->create([
            'name' => 'Pending Member',
            'status' => User::STATUS_PENDING,
            'created_at' => now()->subDays(2),
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/members?status=pending')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('members.0.id', $pending->id);

        $this->asAdmin()
            ->getJson('/api/v1/admin/members?verification=verified')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('members.0.id', $verified->id);

        $this->asAdmin()
            ->getJson('/api/v1/admin/members?search=Pending')
            ->assertOk()
            ->assertJsonPath('members.0.id', $pending->id);

        $this->asAdmin()
            ->getJson('/api/v1/admin/members?sort=name-asc')
            ->assertOk()
            ->assertJsonPath('members.0.name', 'Pending Member');

        $this->asAdmin()
            ->getJson('/api/v1/admin/members?registered_from='.now()->subDays(5)->toDateString())
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('members.0.id', $pending->id);
    }

    public function test_show_includes_profile_location_and_events(): void
    {
        $member = User::factory()->role(User::ROLE_MEMBER)->create();
        $member->profileOrNew()->update([
            'username' => 'ada-l',
            'language' => 'es',
            'timezone' => 'America/Vancouver',
        ]);
        MemberAddress::create([
            'user_id' => $member->id,
            'label' => 'Home',
            'recipient' => 'Ada Lovelace',
            'line1' => '1 Analytical Engine',
            'city' => 'Burnaby',
            'state' => 'BC',
            'country' => 'CA',
            'is_default_shipping' => true,
        ]);

        $this->asAdmin()
            ->getJson("/api/v1/admin/members/{$member->id}")
            ->assertOk()
            ->assertJsonPath('member.username', 'ada-l')
            ->assertJsonPath('member.language', 'es')
            ->assertJsonPath('member.timezone', 'America/Vancouver')
            ->assertJsonPath('member.address_count', 1)
            ->assertJsonPath('member.location.city', 'Burnaby')
            ->assertJsonPath('member.events', []);
    }

    public function test_vendors_are_not_addressable_on_the_member_screen(): void
    {
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create();

        $this->asAdmin()
            ->getJson("/api/v1/admin/members/{$vendor->id}")
            ->assertNotFound();
    }

    public function test_an_administrator_can_change_status_and_add_a_note(): void
    {
        $member = User::factory()->role(User::ROLE_MEMBER)->create();

        $this->asAdmin()
            ->putJson("/api/v1/admin/members/{$member->id}/status", [
                'status' => User::STATUS_SUSPENDED,
            ])
            ->assertUnprocessable();

        $this->asAdmin()
            ->putJson("/api/v1/admin/members/{$member->id}/status", [
                'status' => User::STATUS_SUSPENDED,
                'reason' => 'Identity mismatch under review.',
            ])
            ->assertOk()
            ->assertJsonPath('member.status', User::STATUS_SUSPENDED)
            ->assertJsonPath('member.status_reason', 'Identity mismatch under review.')
            ->assertJsonPath('member.events.0.type', MemberAdminEvent::TYPE_STATUS)
            ->assertJsonPath('member.events.0.to_status', User::STATUS_SUSPENDED);

        $this->asAdmin()
            ->postJson("/api/v1/admin/members/{$member->id}/notes", [
                'body' => 'Called the member; awaiting documents.',
            ])
            ->assertOk()
            ->assertJsonPath('member.events.0.type', MemberAdminEvent::TYPE_NOTE)
            ->assertJsonPath('member.events.0.body', 'Called the member; awaiting documents.');

        $this->assertDatabaseHas('users', [
            'id' => $member->id,
            'status' => User::STATUS_SUSPENDED,
        ]);
    }

    public function test_an_administrator_is_not_addressable_as_a_member(): void
    {
        $this->asAdmin()
            ->putJson("/api/v1/admin/members/{$this->admin->id}/status", [
                'status' => User::STATUS_SUSPENDED,
                'reason' => 'Should never land.',
            ])
            ->assertNotFound();
    }

    public function test_the_audit_feed_lists_recent_member_events(): void
    {
        $member = User::factory()->role(User::ROLE_MEMBER)->create();

        $member->adminEvents()->create([
            'author_id' => $this->admin->id,
            'type' => MemberAdminEvent::TYPE_NOTE,
            'body' => 'Looked over the account.',
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/members/events')
            ->assertOk()
            ->assertJsonPath('events.0.member', $member->name)
            ->assertJsonPath('events.0.author', $this->admin->name)
            ->assertJsonPath('events.0.body', 'Looked over the account.');
    }
}
