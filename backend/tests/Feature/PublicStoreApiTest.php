<?php

namespace Tests\Feature;

use App\Models\PolicyType;
use App\Models\Store;
use App\Models\StorePolicy;
use App\Models\User;
use Database\Seeders\StoreStructureSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicStoreApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(StoreStructureSeeder::class);
    }

    public function test_an_active_store_is_public_and_needs_no_token(): void
    {
        $store = Store::factory()->create(['status' => Store::STATUS_ACTIVE]);

        $this->getJson("/api/v1/stores/{$store->slug}")
            ->assertOk()
            ->assertJsonPath('store.slug', $store->slug);
    }

    public function test_a_store_that_is_not_active_is_a_404(): void
    {
        foreach ([Store::STATUS_DRAFT, Store::STATUS_PAUSED, Store::STATUS_SUSPENDED] as $status) {
            $store = Store::factory()->create(['status' => $status]);

            $this->getJson("/api/v1/stores/{$store->slug}")->assertNotFound();
        }
    }

    public function test_the_owner_may_preview_their_unpublished_store(): void
    {
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create();
        $store = Store::factory()->ownedBy($vendor)->create(['status' => Store::STATUS_DRAFT]);

        // Anonymous callers still get nothing.
        $this->getJson("/api/v1/stores/{$store->slug}")->assertNotFound();

        $this->actingAs($vendor)
            ->getJson("/api/v1/stores/{$store->slug}")
            ->assertOk()
            ->assertJsonPath('preview', true)
            ->assertJsonPath('store.slug', $store->slug);
    }

    public function test_another_vendor_cannot_preview_an_unpublished_store(): void
    {
        $store = Store::factory()->create(['status' => Store::STATUS_DRAFT]);
        $intruder = User::factory()->role(User::ROLE_VENDOR)->create();

        $this->actingAs($intruder)->getJson("/api/v1/stores/{$store->slug}")->assertNotFound();
    }

    public function test_an_admin_may_preview_any_unpublished_store(): void
    {
        $store = Store::factory()->create(['status' => Store::STATUS_DRAFT]);
        $admin = User::factory()->role(User::ROLE_SUPER_ADMIN)->create();

        $this->actingAs($admin)->getJson("/api/v1/stores/{$store->slug}")->assertOk();
    }

    public function test_a_live_store_is_not_flagged_as_a_preview(): void
    {
        $store = Store::factory()->create(['status' => Store::STATUS_ACTIVE]);

        $this->getJson("/api/v1/stores/{$store->slug}")
            ->assertOk()
            ->assertJsonPath('preview', false);
    }

    public function test_a_soft_deleted_store_is_a_404(): void
    {
        $store = Store::factory()->create(['status' => Store::STATUS_ACTIVE]);
        $store->delete();

        $this->getJson("/api/v1/stores/{$store->slug}")->assertNotFound();
    }

    public function test_the_public_payload_hides_the_vendors_workspace(): void
    {
        $store = Store::factory()->create(['status' => Store::STATUS_ACTIVE]);

        $payload = $this->getJson("/api/v1/stores/{$store->slug}")->assertOk()->json('store');

        // Completeness is a vendor tool, not shopper-facing.
        $this->assertArrayNotHasKey('completeness', $payload);
    }

    public function test_it_honours_the_hidden_address_flag(): void
    {
        $store = Store::factory()->create([
            'status' => Store::STATUS_ACTIVE,
            'address_line' => '1842 Honeycomb Lane',
            'hide_address' => true,
        ]);

        $payload = $this->getJson("/api/v1/stores/{$store->slug}")->json('store');

        $this->assertNull($payload['location']['address_line']);
        // The city stays, so shoppers still know roughly where the store is.
        $this->assertSame($store->city, $payload['location']['city']);
    }

    public function test_only_published_policies_are_public(): void
    {
        $store = Store::factory()->create(['status' => Store::STATUS_ACTIVE]);
        $types = PolicyType::orderBy('position')->take(2)->get();

        StorePolicy::create(['store_id' => $store->id, 'policy_type_id' => $types[0]->id, 'body' => 'Public', 'status' => StorePolicy::STATUS_PUBLISHED]);
        StorePolicy::create(['store_id' => $store->id, 'policy_type_id' => $types[1]->id, 'body' => 'Hidden', 'status' => StorePolicy::STATUS_DRAFT]);

        $policies = $this->getJson("/api/v1/stores/{$store->slug}")->json('store.policies');

        $this->assertCount(1, $policies);
        $this->assertSame('Public', $policies[0]['body']);
    }

    /* ---------------------------------------------------------------- */
    /* Structure endpoint                                                */
    /* ---------------------------------------------------------------- */

    public function test_structure_requires_authentication(): void
    {
        $this->getJson('/api/v1/structure')->assertUnauthorized();
    }

    public function test_structure_returns_every_registry(): void
    {
        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/structure')
            ->assertOk()
            ->assertJsonCount(8, 'categories')
            ->assertJsonCount(9, 'social_platforms')
            ->assertJsonCount(7, 'policy_types')
            ->assertJsonCount(14, 'setting_definitions')
            ->assertJsonCount(31, 'nav_links');
    }

    public function test_structure_omits_inactive_rows(): void
    {
        \App\Models\Category::query()->limit(2)->update(['is_active' => false]);

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/structure')
            ->assertOk()
            ->assertJsonCount(6, 'categories');
    }

    public function test_structure_carries_the_brand_paths_so_the_page_ships_none(): void
    {
        $platforms = $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/structure')
            ->json('social_platforms');

        $facebook = collect($platforms)->firstWhere('key', 'facebook');

        $this->assertNotEmpty($facebook['icon_path']);
    }

    public function test_nav_links_are_filtered_by_the_callers_role(): void
    {
        \App\Models\NavLink::query()->limit(3)->update(['roles' => ['super-admin']]);

        $vendorCount = $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/structure')->json('nav_links');

        $adminCount = $this->actingAs(User::factory()->role(User::ROLE_SUPER_ADMIN)->create())
            ->getJson('/api/v1/structure')->json('nav_links');

        $this->assertCount(28, $vendorCount);
        $this->assertCount(31, $adminCount);
    }
}
