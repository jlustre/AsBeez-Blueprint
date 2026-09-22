<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\NavLink;
use App\Models\PolicyType;
use App\Models\SettingDefinition;
use App\Models\SocialPlatform;
use App\Models\Store;
use App\Models\StoreHour;
use App\Models\StoreSettingValue;
use App\Models\User;
use Database\Seeders\DemoStoreSeeder;
use Database\Seeders\StoreStructureSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StoreDomainTest extends TestCase
{
    use RefreshDatabase;

    public function test_structure_seeder_populates_every_admin_curated_registry(): void
    {
        $this->seed(StoreStructureSeeder::class);

        // The roots are the seven markets, pinned because the homepage grid
        // renders exactly them — an eighth root is a product decision, not an
        // incidental edit. Everything below stays counted rather than pinned:
        // the taxonomy is meant to grow, and a magic total turns every new
        // category into a test edit.
        $this->assertSame(
            ['physical-products', 'digital-products', 'professional-services', 'real-estate', 'automotive', 'insurance', 'travel'],
            Category::whereNull('parent_id')->orderBy('position')->pluck('slug')->all(),
        );
        $this->assertGreaterThan(Category::whereNull('parent_id')->count(), Category::count());

        // A fourth level exists, so nothing has quietly flattened the tree.
        $this->assertSame(3, Category::whereSlug('laptops')->firstOrFail()->level());
        $this->assertSame(
            Category::whereSlug('digital-products')->value('id'),
            Category::whereSlug('digital-templates')->value('parent_id'),
        );

        // The departments that used to be roots hang off a market now.
        $this->assertSame(
            Category::whereSlug('physical-products')->value('id'),
            Category::whereSlug('electronics')->value('parent_id'),
        );
        $this->assertSame(9, SocialPlatform::count());
        $this->assertSame(7, PolicyType::count());
        $this->assertSame(14, SettingDefinition::count());
        $this->assertSame(31, NavLink::count());
    }

    public function test_structure_seeder_is_idempotent(): void
    {
        $this->seed(StoreStructureSeeder::class);
        $seeded = Category::count();
        Category::whereSlug('electronics')->update(['name' => 'Renamed By Hand']);

        $this->seed(StoreStructureSeeder::class);

        $this->assertSame($seeded, Category::count());
        $this->assertSame('Electronics and Computers', Category::whereSlug('electronics')->value('name'));
        $this->assertSame(
            Category::whereSlug('digital-products')->value('id'),
            Category::whereSlug('digital-templates')->value('parent_id'),
        );
    }

    public function test_policy_and_setting_keys_are_clean_snake_case(): void
    {
        $this->seed(StoreStructureSeeder::class);

        foreach (PolicyType::pluck('key') as $key) {
            $this->assertMatchesRegularExpression('/^[a-z][a-z0-9_]*$/', $key, "Policy key {$key} is malformed.");
        }

        foreach (SettingDefinition::pluck('key') as $key) {
            $this->assertMatchesRegularExpression('/^[a-z][a-z0-9_]*$/', $key, "Setting key {$key} is malformed.");
        }

        // Guards the generator bug that produced "custom-custom".
        $this->assertTrue(PolicyType::where('key', 'custom')->exists());
        $this->assertFalse(PolicyType::where('key', 'like', '%-%')->exists());
    }

    public function test_a_vendor_can_own_several_independent_stores(): void
    {
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create();

        $first = Store::factory()->ownedBy($vendor)->create();
        $second = Store::factory()->ownedBy($vendor)->create();

        $this->assertSame(2, $vendor->stores()->count());
        $this->assertNotSame($first->slug, $second->slug);

        // Independent: content on one store never leaks into the other.
        StoreHour::create(['store_id' => $first->getKey(), 'weekday' => 1, 'opens_at' => '09:00', 'closes_at' => '17:00']);

        $this->assertSame(1, $first->hours()->count());
        $this->assertSame(0, $second->hours()->count());
    }

    public function test_store_slugs_are_globally_unique(): void
    {
        Store::factory()->create(['slug' => 'taken']);

        $this->expectException(\Illuminate\Database\UniqueConstraintViolationException::class);
        Store::factory()->create(['slug' => 'taken']);
    }

    public function test_resolved_settings_merge_saved_values_over_platform_defaults(): void
    {
        $this->seed(StoreStructureSeeder::class);
        $store = Store::factory()->create();

        // Untouched: the store reports the admin-defined default.
        $this->assertSame('1', $store->resolvedSettings()['store_visibility']);

        StoreSettingValue::create([
            'store_id' => $store->getKey(),
            'setting_key' => 'store_visibility',
            'value' => '0',
        ]);

        $this->assertSame('0', $store->fresh()->resolvedSettings()['store_visibility']);
    }

    public function test_deleting_a_store_takes_its_content_with_it(): void
    {
        $this->seed(StoreStructureSeeder::class);
        $this->seed(UserSeeder::class);
        $this->seed(DemoStoreSeeder::class);

        $store = Store::whereSlug('golden-hive-market')->firstOrFail();
        $id = $store->getKey();

        $this->assertGreaterThan(0, $store->hours()->count());

        // forceDelete, because soft-deleting deliberately leaves the rows alone.
        $store->forceDelete();

        $this->assertDatabaseMissing('store_hours', ['store_id' => $id]);
        $this->assertDatabaseMissing('store_socials', ['store_id' => $id]);
        $this->assertDatabaseMissing('store_policies', ['store_id' => $id]);
        $this->assertDatabaseMissing('store_setting_values', ['store_id' => $id]);
        $this->assertDatabaseMissing('category_store', ['store_id' => $id]);
        $this->assertDatabaseMissing('store_verifications', ['store_id' => $id]);
    }

    public function test_soft_deleting_a_store_keeps_it_out_of_queries_but_on_disk(): void
    {
        $store = Store::factory()->create();

        $store->delete();

        $this->assertNull(Store::find($store->getKey()));
        $this->assertNotNull(Store::withTrashed()->find($store->getKey()));
    }

    public function test_demo_seeder_reproduces_the_pages_hard_coded_content(): void
    {
        $this->seed(UserSeeder::class);
        $this->seed(StoreStructureSeeder::class);
        $this->seed(DemoStoreSeeder::class);

        $store = Store::with(['categories', 'hours', 'socials', 'policies.type', 'verifications'])
            ->whereSlug('golden-hive-market')
            ->firstOrFail();

        $this->assertSame('Golden Hive Market', $store->name);
        $this->assertSame(3, $store->categories->count());
        $this->assertSame(7, $store->hours->count());
        $this->assertSame(8, $store->socials->count());

        // Sunday closed, as the page shows.
        $this->assertTrue($store->hours->firstWhere('weekday', 0)->is_closed);

        // Terms and conditions is deliberately absent — the page renders that
        // missing row as "Not configured".
        $this->assertSame(6, $store->policies->count());
        $this->assertFalse($store->policies->contains(fn ($p) => $p->type->key === 'terms_and_conditions'));

        // Phone verification is the one still pending.
        $this->assertSame('pending', $store->verifications->firstWhere('kind', 'phone')->status);
    }

    public function test_the_seeded_vendor_owns_two_stores(): void
    {
        $this->seed(UserSeeder::class);
        $this->seed(StoreStructureSeeder::class);
        $this->seed(DemoStoreSeeder::class);

        $vendor = User::whereEmail('vendor@asbeez.test')->firstOrFail();

        $this->assertSame(2, $vendor->stores()->count());
        $this->assertSame(
            ['golden-hive-market', 'hive-home-services'],
            $vendor->stores()->orderBy('slug')->pluck('slug')->all(),
        );
    }

    public function test_demo_seeder_draws_banner_and_logo_for_every_store(): void
    {
        $this->seed(UserSeeder::class);
        $this->seed(StoreStructureSeeder::class);
        $this->seed(DemoStoreSeeder::class);

        $disk = Storage::disk(Store::MEDIA_DISK);

        foreach (Store::all() as $store) {
            $this->assertNotNull($store->banner_path, "{$store->name} has no banner.");
            $this->assertNotNull($store->logo_path, "{$store->name} has no logo.");

            $disk->assertExists($store->banner_path);
            $disk->assertExists($store->logo_path);

            // Real PNG bytes at the advertised size, not an empty placeholder.
            [$width, $height] = getimagesizefromstring($disk->get($store->banner_path));
            $this->assertSame([1600, 400], [$width, $height]);

            [$width, $height] = getimagesizefromstring($disk->get($store->logo_path));
            $this->assertSame([400, 400], [$width, $height]);
        }
    }

    public function test_seeded_media_uses_the_fetched_photography_when_present(): void
    {
        // Only meaningful once `php artisan demo:fetch-images` has been run.
        if (! is_file(database_path('seeders/assets/golden-hive-banner.jpg'))) {
            $this->markTestSkipped('Demo photography has not been fetched.');
        }

        $this->seed(UserSeeder::class);
        $this->seed(StoreStructureSeeder::class);
        $this->seed(DemoStoreSeeder::class);

        $store = Store::whereSlug('golden-hive-market')->firstOrFail();

        $this->assertStringEndsWith('.jpg', $store->banner_path);
        $this->assertSame(
            file_get_contents(database_path('seeders/assets/golden-hive-banner.jpg')),
            Storage::disk(Store::MEDIA_DISK)->get($store->banner_path),
        );
    }

    public function test_seeding_falls_back_to_generated_art_without_the_photography(): void
    {
        // Seeding must not depend on those binaries being present, so point the
        // seeder at a directory with no assets in it and confirm it still works.
        $real = database_path('seeders/assets');
        $moved = $real.'-hidden-for-test';

        if (! is_dir($real)) {
            $this->markTestSkipped('No assets directory to hide.');
        }

        rename($real, $moved);

        try {
            $this->seed(UserSeeder::class);
            $this->seed(StoreStructureSeeder::class);
            $this->seed(DemoStoreSeeder::class);

            $store = Store::whereSlug('golden-hive-market')->firstOrFail();

            $this->assertStringEndsWith('.png', $store->banner_path);
            Storage::disk(Store::MEDIA_DISK)->assertExists($store->banner_path);

            [$width, $height] = getimagesizefromstring(
                Storage::disk(Store::MEDIA_DISK)->get($store->banner_path),
            );
            $this->assertSame([1600, 400], [$width, $height]);
        } finally {
            rename($moved, $real);
        }
    }

    public function test_reseeding_media_overwrites_rather_than_accumulating(): void
    {
        $this->seed(UserSeeder::class);
        $this->seed(StoreStructureSeeder::class);
        $this->seed(DemoStoreSeeder::class);

        $before = Storage::disk(Store::MEDIA_DISK)->allFiles();

        $this->seed(DemoStoreSeeder::class);

        $this->assertSame($before, Storage::disk(Store::MEDIA_DISK)->allFiles());
    }

    public function test_seeded_artwork_makes_the_flagship_store_fully_complete(): void
    {
        $this->seed(UserSeeder::class);
        $this->seed(StoreStructureSeeder::class);
        $this->seed(DemoStoreSeeder::class);

        $store = Store::whereSlug('golden-hive-market')->firstOrFail();

        // Logo and banner were the two outstanding tasks before artwork existed.
        $this->assertSame(100, \App\Support\StoreCompleteness::for($store)->toArray()['percent']);
    }

    public function test_media_disk_is_addressed_by_name_so_it_can_be_swapped(): void
    {
        $store = Store::factory()->create(['logo_path' => 'logos/example.png']);

        $this->assertSame(Store::MEDIA_DISK, 'store_media');
        $this->assertStringContainsString('logos/example.png', $store->logoUrl());
        $this->assertNull(Store::factory()->create(['logo_path' => null])->logoUrl());
    }
}
