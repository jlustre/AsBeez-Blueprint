<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\PolicyType;
use App\Models\SocialPlatform;
use App\Models\Store;
use App\Models\StorePolicy;
use App\Models\User;
use Database\Seeders\StoreStructureSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VendorStoreApiTest extends TestCase
{
    use RefreshDatabase;

    private User $vendor;

    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(StoreStructureSeeder::class);
        $this->vendor = User::factory()->role(User::ROLE_VENDOR)->create();
        $this->store = Store::factory()->ownedBy($this->vendor)->create();
    }

    private function asVendor(): static
    {
        return $this->actingAs($this->vendor);
    }

    private function url(string $suffix = ''): string
    {
        return "/api/v1/vendor/stores/{$this->store->getKey()}{$suffix}";
    }

    /* ---------------------------------------------------------------- */
    /* Ownership — the part that must never regress                      */
    /* ---------------------------------------------------------------- */

    public function test_a_vendor_cannot_read_another_vendors_store(): void
    {
        $intruder = User::factory()->role(User::ROLE_VENDOR)->create();

        $this->actingAs($intruder)->getJson($this->url())->assertForbidden();
    }

    public function test_a_vendor_cannot_write_to_another_vendors_store(): void
    {
        $intruder = User::factory()->role(User::ROLE_VENDOR)->create();

        $this->actingAs($intruder)->putJson($this->url(), ['name' => 'Hijacked'])->assertForbidden();
        $this->actingAs($intruder)->putJson($this->url('/settings'), ['settings' => []])->assertForbidden();
        $this->actingAs($intruder)->deleteJson($this->url())->assertForbidden();

        $this->assertSame($this->store->name, $this->store->fresh()->name);
    }

    public function test_a_member_cannot_reach_the_vendor_area_at_all(): void
    {
        $member = User::factory()->role(User::ROLE_MEMBER)->create();

        $this->actingAs($member)->getJson('/api/v1/vendor/stores')->assertForbidden();
    }

    public function test_an_admin_may_reach_any_store(): void
    {
        $admin = User::factory()->role(User::ROLE_SUPER_ADMIN)->create();

        $this->actingAs($admin)->getJson($this->url())->assertOk();
    }

    public function test_the_vendor_area_requires_authentication(): void
    {
        $this->getJson('/api/v1/vendor/stores')->assertUnauthorized();
    }

    public function test_the_index_lists_only_the_callers_own_stores(): void
    {
        Store::factory()->ownedBy($this->vendor)->create();
        Store::factory()->create(); // someone else's

        $response = $this->asVendor()->getJson('/api/v1/vendor/stores')->assertOk();

        $this->assertCount(2, $response->json('stores'));
    }

    /* ---------------------------------------------------------------- */
    /* Core profile                                                      */
    /* ---------------------------------------------------------------- */

    public function test_it_returns_the_full_profile(): void
    {
        $this->asVendor()->getJson($this->url())
            ->assertOk()
            ->assertJsonStructure(['store' => [
                'id', 'name', 'slug', 'media', 'contact', 'location', 'commerce',
                'categories', 'hours', 'socials', 'policies', 'verifications',
                'settings', 'completeness' => ['percent', 'completed', 'total', 'tasks'],
            ]]);
    }

    public function test_it_updates_core_fields(): void
    {
        $this->asVendor()->putJson($this->url(), [
            'name' => 'Renamed Store',
            'tagline' => 'A new tagline',
            'public_email' => 'hi@example.com',
        ])->assertOk()->assertJsonPath('store.name', 'Renamed Store');

        $this->assertSame('hi@example.com', $this->store->fresh()->public_email);
    }

    public function test_slugs_stay_unique_across_all_stores(): void
    {
        $other = Store::factory()->create(['slug' => 'already-taken']);

        $this->asVendor()->putJson($this->url(), ['slug' => $other->slug])
            ->assertStatus(422)
            ->assertJsonValidationErrors('slug');
    }

    public function test_it_rejects_a_malformed_slug(): void
    {
        $this->asVendor()->putJson($this->url(), ['slug' => 'Not A Slug!'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('slug');
    }

    public function test_a_vendor_cannot_suspend_their_own_store(): void
    {
        $this->asVendor()->putJson($this->url(), ['status' => Store::STATUS_SUSPENDED])
            ->assertStatus(422)
            ->assertJsonValidationErrors('status');
    }

    public function test_creating_a_store_derives_a_unique_slug(): void
    {
        Store::factory()->create(['slug' => 'honey-barn']);

        $response = $this->asVendor()->postJson('/api/v1/vendor/stores', ['name' => 'Honey Barn'])
            ->assertCreated();

        $this->assertSame('honey-barn-2', $response->json('store.slug'));
        $this->assertSame(Store::STATUS_DRAFT, $response->json('store.status'));
    }

    public function test_destroy_soft_deletes(): void
    {
        $this->asVendor()->deleteJson($this->url())->assertOk();

        $this->assertNull(Store::find($this->store->getKey()));
        $this->assertNotNull(Store::withTrashed()->find($this->store->getKey()));
    }

    /* ---------------------------------------------------------------- */
    /* Bulk-replace sections                                             */
    /* ---------------------------------------------------------------- */

    public function test_it_replaces_business_hours(): void
    {
        $hours = collect(range(0, 6))->map(fn (int $day) => [
            'weekday' => $day,
            'is_closed' => $day === 0,
            'opens_at' => '09:00',
            'closes_at' => '18:00',
        ])->all();

        $this->asVendor()->putJson($this->url('/hours'), ['hours' => $hours])->assertOk();

        $this->assertSame(7, $this->store->hours()->count());
        $this->assertTrue($this->store->hours()->where('weekday', 0)->value('is_closed'));

        // Replacing with fewer days leaves no orphans behind.
        $this->asVendor()->putJson($this->url('/hours'), ['hours' => [$hours[1]]])->assertOk();
        $this->assertSame(1, $this->store->hours()->count());
    }

    public function test_it_rejects_a_duplicated_weekday(): void
    {
        $row = ['weekday' => 1, 'is_closed' => false, 'opens_at' => '09:00', 'closes_at' => '17:00'];

        $this->asVendor()->putJson($this->url('/hours'), ['hours' => [$row, $row]])->assertStatus(422);
        $this->assertSame(0, $this->store->hours()->count());
    }

    public function test_it_replaces_socials_and_drops_blank_values(): void
    {
        $facebook = SocialPlatform::whereKey(SocialPlatform::where('key', 'facebook')->value('id'))->first();
        $instagram = SocialPlatform::where('key', 'instagram')->first();

        $this->asVendor()->putJson($this->url('/socials'), ['socials' => [
            ['platform_id' => $facebook->id, 'value' => 'https://facebook.com/x'],
            ['platform_id' => $instagram->id, 'value' => ''],
        ]])->assertOk();

        $this->assertSame(1, $this->store->socials()->count());
        $this->assertSame('https://facebook.com/x', $this->store->socials()->value('value'));
    }

    public function test_it_syncs_categories_and_keeps_their_order(): void
    {
        $ids = Category::orderBy('position')->limit(3)->pluck('id')->all();

        $this->asVendor()->putJson($this->url('/categories'), ['category_ids' => array_reverse($ids)])->assertOk();

        $this->assertSame(array_reverse($ids), $this->store->categories()->pluck('categories.id')->all());
    }

    public function test_it_rejects_an_unknown_category(): void
    {
        $this->asVendor()->putJson($this->url('/categories'), ['category_ids' => [99999]])
            ->assertStatus(422);
    }

    public function test_it_saves_settings_and_normalises_booleans(): void
    {
        $this->asVendor()->putJson($this->url('/settings'), ['settings' => [
            'store_visibility' => false,
            'vacation_mode' => true,
            'min_order_amount' => '25.00',
        ]])->assertOk();

        $resolved = $this->store->fresh()->resolvedSettings();

        $this->assertSame('0', $resolved['store_visibility']);
        $this->assertSame('1', $resolved['vacation_mode']);
        $this->assertSame('25.00', $resolved['min_order_amount']);
    }

    public function test_it_rejects_an_unknown_setting_key(): void
    {
        $this->asVendor()->putJson($this->url('/settings'), ['settings' => ['made_up_key' => '1']])
            ->assertStatus(422);

        $this->assertSame(0, $this->store->settingValues()->count());
    }

    /* ---------------------------------------------------------------- */
    /* Media                                                             */
    /* ---------------------------------------------------------------- */

    public function test_it_uploads_and_replaces_a_logo(): void
    {
        Storage::fake(Store::MEDIA_DISK);

        $this->asVendor()->post($this->url('/media/logo'), [
            'file' => UploadedFile::fake()->image('logo.png', 400, 400),
        ])->assertOk();

        $first = $this->store->fresh()->logo_path;
        $this->assertNotNull($first);
        Storage::disk(Store::MEDIA_DISK)->assertExists($first);

        $this->asVendor()->post($this->url('/media/logo'), [
            'file' => UploadedFile::fake()->image('logo2.png', 400, 400),
        ])->assertOk();

        // The superseded file is cleaned up rather than orphaned on the disk.
        Storage::disk(Store::MEDIA_DISK)->assertMissing($first);
    }

    public function test_it_rejects_an_undersized_image(): void
    {
        Storage::fake(Store::MEDIA_DISK);

        $this->asVendor()->post($this->url('/media/logo'), [
            'file' => UploadedFile::fake()->image('tiny.png', 50, 50),
        ])->assertStatus(422)->assertJsonValidationErrors('file');

        $this->assertNull($this->store->fresh()->logo_path);
    }

    public function test_it_rejects_a_non_image(): void
    {
        Storage::fake(Store::MEDIA_DISK);

        $this->asVendor()->post($this->url('/media/logo'), [
            'file' => UploadedFile::fake()->create('invoice.pdf', 100, 'application/pdf'),
        ])->assertStatus(422);
    }

    public function test_it_refuses_an_svg_upload(): void
    {
        Storage::fake(Store::MEDIA_DISK);

        // SVG can carry script and is served from this application's own origin,
        // so accepting one would be stored XSS.
        $this->asVendor()->post($this->url('/media/logo'), [
            'file' => UploadedFile::fake()->createWithContent('logo.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'),
        ])->assertStatus(422)->assertJsonValidationErrors('file');

        $this->assertNull($this->store->fresh()->logo_path);
    }

    public function test_it_404s_on_an_unknown_media_kind(): void
    {
        Storage::fake(Store::MEDIA_DISK);

        $this->asVendor()->post($this->url('/media/mascot'), [
            'file' => UploadedFile::fake()->image('x.png', 400, 400),
        ])->assertNotFound();
    }

    public function test_it_removes_media(): void
    {
        Storage::fake(Store::MEDIA_DISK);

        $this->asVendor()->post($this->url('/media/banner'), [
            'file' => UploadedFile::fake()->image('b.png', 1600, 400),
        ])->assertOk();

        $path = $this->store->fresh()->banner_path;

        $this->asVendor()->deleteJson($this->url('/media/banner'))->assertOk();

        $this->assertNull($this->store->fresh()->banner_path);
        Storage::disk(Store::MEDIA_DISK)->assertMissing($path);
    }

    /* ---------------------------------------------------------------- */
    /* Policies                                                          */
    /* ---------------------------------------------------------------- */

    public function test_it_upserts_a_policy(): void
    {
        $type = PolicyType::where('key', 'shipping')->firstOrFail();

        $this->asVendor()->putJson($this->url('/policies'), [
            'policy_type_id' => $type->id,
            'body' => 'We ship within 3 days.',
            'status' => StorePolicy::STATUS_PUBLISHED,
        ])->assertCreated();

        // A second call to the same type edits rather than duplicates.
        $this->asVendor()->putJson($this->url('/policies'), [
            'policy_type_id' => $type->id,
            'body' => 'We ship within 2 days.',
            'status' => StorePolicy::STATUS_PUBLISHED,
        ])->assertOk();

        $this->assertSame(1, $this->store->policies()->count());
        $this->assertSame('We ship within 2 days.', $this->store->policies()->value('body'));
    }

    public function test_it_refuses_to_publish_an_empty_policy(): void
    {
        $type = PolicyType::where('key', 'privacy')->firstOrFail();

        $this->asVendor()->putJson($this->url('/policies'), [
            'policy_type_id' => $type->id,
            'body' => '',
            'status' => StorePolicy::STATUS_PUBLISHED,
        ])->assertStatus(422)->assertJsonValidationErrors('body');
    }

    public function test_it_will_not_delete_a_policy_belonging_to_another_store(): void
    {
        $other = Store::factory()->create();
        $policy = StorePolicy::create([
            'store_id' => $other->getKey(),
            'policy_type_id' => PolicyType::value('id'),
            'body' => 'Theirs',
            'status' => StorePolicy::STATUS_DRAFT,
        ]);

        $this->asVendor()->deleteJson($this->url("/policies/{$policy->getKey()}"))->assertNotFound();

        $this->assertDatabaseHas('store_policies', ['id' => $policy->getKey()]);
    }

    /* ---------------------------------------------------------------- */
    /* Verification                                                      */
    /* ---------------------------------------------------------------- */

    public function test_a_vendor_can_only_request_verification_never_grant_it(): void
    {
        $this->asVendor()->postJson($this->url('/verifications'), ['kind' => 'business'])->assertOk();

        $this->assertSame('pending', $this->store->verifications()->where('kind', 'business')->value('status'));
        $this->assertNull($this->store->verifications()->where('kind', 'business')->value('verified_at'));
    }

    public function test_it_rejects_an_unknown_verification_kind(): void
    {
        $this->asVendor()->postJson($this->url('/verifications'), ['kind' => 'vibes'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('kind');
    }

    /* ---------------------------------------------------------------- */
    /* Completeness                                                      */
    /* ---------------------------------------------------------------- */

    public function test_completeness_is_computed_not_hard_coded(): void
    {
        $bare = Store::factory()->ownedBy($this->vendor)->create([
            'description' => null,
            'public_email' => null,
            'public_phone' => null,
            'logo_path' => null,
            'banner_path' => null,
        ]);

        $before = $this->actingAs($this->vendor)
            ->getJson("/api/v1/vendor/stores/{$bare->getKey()}/completeness")
            ->assertOk()
            ->json('percent');

        $bare->update([
            'description' => str_repeat('Locally sourced honey and beeswax goods. ', 3),
            'public_email' => 'hi@example.com',
            'public_phone' => '+1 512 555 0142',
        ]);

        $after = $this->actingAs($this->vendor)
            ->getJson("/api/v1/vendor/stores/{$bare->getKey()}/completeness")
            ->json('percent');

        $this->assertGreaterThan($before, $after);
    }
}
