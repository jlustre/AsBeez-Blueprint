<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\HomeSlide;
use App\Models\Product;
use App\Models\Store;
use Database\Seeders\DemoHomepageSeeder;
use Database\Seeders\DemoProductSeeder;
use Database\Seeders\DemoStoreSeeder;
use Database\Seeders\StoreStructureSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicHomeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_homepage_is_public_and_empty_without_fixtures(): void
    {
        $this->getJson('/api/v1/home')
            ->assertOk()
            ->assertJsonPath('slides', [])
            ->assertJsonPath('deals', [])
            ->assertJsonPath('services', [])
            ->assertJsonPath('products', [])
            ->assertJsonMissingPath('ratings')
            ->assertJsonMissingPath('reviews')
            ->assertJsonMissingPath('gmv');
    }

    public function test_the_seeder_publishes_slides_and_listing_images(): void
    {
        $this->seed([
            UserSeeder::class,
            StoreStructureSeeder::class,
            DemoStoreSeeder::class,
            DemoProductSeeder::class,
            DemoHomepageSeeder::class,
        ]);

        $response = $this->getJson('/api/v1/home')
            ->assertOk()
            ->assertJsonCount(3, 'slides')
            ->assertJsonPath('slides.0.copy_key', 'hero.slide1');

        $this->assertNotEmpty($response->json('slides.0.image_url'));
        $this->assertNotEmpty($response->json('deals'));
        $this->assertNotEmpty($response->json('services'));
        $this->assertNotEmpty($response->json('products'));
        $this->assertNotEmpty($response->json('categories'));

        $this->assertNull($response->json('deals.0.rating'));
        $this->assertNull($response->json('services.0.reviews'));
        $this->assertNull($response->json('services.0.distance'));

        $this->assertTrue(
            Product::query()->where('status', Product::STATUS_PUBLISHED)->whereNotNull('image_path')->exists(),
        );
        $this->assertSame(3, HomeSlide::query()->count());
    }

    public function test_unpublished_listings_do_not_appear(): void
    {
        $store = Store::factory()->create(['status' => Store::STATUS_ACTIVE]);
        $category = Category::factory()->create();
        Product::factory()->forStore($store)->create([
            'category_id' => $category->id,
            'status' => Product::STATUS_DRAFT,
            'name' => 'Hidden Draft Honey',
        ]);
        Product::factory()->forStore($store)->published()->create([
            'category_id' => $category->id,
            'name' => 'Listed Honey',
            'compare_at_price' => 20,
            'price' => 12,
        ]);

        $names = collect($this->getJson('/api/v1/home')->json('products'))->pluck('name');

        $this->assertTrue($names->contains('Listed Honey'));
        $this->assertFalse($names->contains('Hidden Draft Honey'));
    }

    public function test_reseeding_does_not_duplicate_slides(): void
    {
        $this->seed([
            UserSeeder::class,
            StoreStructureSeeder::class,
            DemoStoreSeeder::class,
            DemoProductSeeder::class,
            DemoHomepageSeeder::class,
        ]);
        $this->seed(DemoHomepageSeeder::class);

        $this->assertSame(3, HomeSlide::query()->count());
    }
}
