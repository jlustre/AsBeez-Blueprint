<?php

namespace Tests\Feature;

use App\Models\MemberAdminEvent;
use App\Models\Store;
use App\Models\StoreVerification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminVendorApiTest extends TestCase
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
        $this->getJson('/api/v1/admin/vendors')->assertUnauthorized();

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/admin/vendors')
            ->assertForbidden();
    }

    public function test_the_list_only_includes_vendor_accounts(): void
    {
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create(['name' => 'Hive Goods']);
        Store::factory()->ownedBy($vendor)->create(['name' => 'Golden Hive Market', 'slug' => 'golden-hive-market']);
        User::factory()->role(User::ROLE_MEMBER)->create(['name' => 'Just A Member']);

        $this->asAdmin()
            ->getJson('/api/v1/admin/vendors')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('vendors.0.id', $vendor->id)
            ->assertJsonPath('vendors.0.store_count', 1)
            ->assertJsonPath('vendors.0.stores.0.slug', 'golden-hive-market')
            ->assertJsonPath('stats.total', 1)
            ->assertJsonPath('stats.stores_active', 1)
            ->assertJsonPath('stats.store_verified', 0);
    }

    public function test_the_list_can_be_filtered_by_store_and_verification(): void
    {
        $active = User::factory()->role(User::ROLE_VENDOR)->create(['name' => 'Active Vendor']);
        Store::factory()->ownedBy($active)->verified()->create(['name' => 'Live Shop', 'status' => Store::STATUS_ACTIVE]);

        $pending = User::factory()->role(User::ROLE_VENDOR)->create([
            'name' => 'Pending Vendor',
            'status' => User::STATUS_PENDING,
        ]);
        $draft = Store::factory()->ownedBy($pending)->draft()->create(['name' => 'Draft Shop']);
        $draft->verifications()->create([
            'kind' => 'business',
            'status' => StoreVerification::STATUS_PENDING,
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/vendors?status=pending')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('vendors.0.id', $pending->id);

        $this->asAdmin()
            ->getJson('/api/v1/admin/vendors?store_status=draft')
            ->assertOk()
            ->assertJsonPath('vendors.0.id', $pending->id);

        $this->asAdmin()
            ->getJson('/api/v1/admin/vendors?verification=verified')
            ->assertOk()
            ->assertJsonPath('vendors.0.id', $active->id);

        $this->asAdmin()
            ->getJson('/api/v1/admin/vendors?verification=pending')
            ->assertOk()
            ->assertJsonPath('vendors.0.id', $pending->id);

        $this->asAdmin()
            ->getJson('/api/v1/admin/vendors?search=Live')
            ->assertOk()
            ->assertJsonPath('vendors.0.id', $active->id);
    }

    public function test_show_includes_store_completeness_and_events(): void
    {
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create();
        $store = Store::factory()->ownedBy($vendor)->create();

        $this->asAdmin()
            ->getJson("/api/v1/admin/vendors/{$vendor->id}")
            ->assertOk()
            ->assertJsonPath('vendor.id', $vendor->id)
            ->assertJsonPath('vendor.stores.0.id', $store->id)
            ->assertJsonStructure(['vendor' => ['stores' => [['completeness', 'verifications']]]]);
    }

    public function test_members_are_not_addressable_on_the_vendor_screen(): void
    {
        $member = User::factory()->role(User::ROLE_MEMBER)->create();

        $this->asAdmin()
            ->getJson("/api/v1/admin/vendors/{$member->id}")
            ->assertNotFound();
    }

    public function test_an_administrator_can_change_vendor_and_store_status(): void
    {
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create();
        $store = Store::factory()->ownedBy($vendor)->create(['status' => Store::STATUS_ACTIVE]);

        $this->asAdmin()
            ->putJson("/api/v1/admin/vendors/{$vendor->id}/status", [
                'status' => User::STATUS_SUSPENDED,
            ])
            ->assertUnprocessable();

        $this->asAdmin()
            ->putJson("/api/v1/admin/vendors/{$vendor->id}/status", [
                'status' => User::STATUS_SUSPENDED,
                'reason' => 'Compliance review.',
            ])
            ->assertOk()
            ->assertJsonPath('vendor.status', User::STATUS_SUSPENDED)
            ->assertJsonPath('vendor.events.0.type', MemberAdminEvent::TYPE_STATUS);

        $this->asAdmin()
            ->putJson("/api/v1/admin/vendors/{$vendor->id}/stores/{$store->id}/status", [
                'status' => Store::STATUS_PAUSED,
            ])
            ->assertOk()
            ->assertJsonPath('vendor.stores.0.status', Store::STATUS_PAUSED);

        $this->asAdmin()
            ->postJson("/api/v1/admin/vendors/{$vendor->id}/notes", [
                'body' => 'Asked for updated documents.',
            ])
            ->assertOk()
            ->assertJsonPath('vendor.events.0.type', MemberAdminEvent::TYPE_NOTE);
    }

    public function test_a_store_from_another_vendor_cannot_be_moved(): void
    {
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create();
        $other = Store::factory()->create();

        $this->asAdmin()
            ->putJson("/api/v1/admin/vendors/{$vendor->id}/stores/{$other->id}/status", [
                'status' => Store::STATUS_PAUSED,
            ])
            ->assertNotFound();
    }

    public function test_the_audit_feed_lists_recent_vendor_events(): void
    {
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create();

        $vendor->adminEvents()->create([
            'author_id' => $this->admin->id,
            'type' => MemberAdminEvent::TYPE_NOTE,
            'body' => 'Looked over the storefront.',
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/vendors/events')
            ->assertOk()
            ->assertJsonPath('events.0.vendor', $vendor->name)
            ->assertJsonPath('events.0.body', 'Looked over the storefront.');
    }
}
