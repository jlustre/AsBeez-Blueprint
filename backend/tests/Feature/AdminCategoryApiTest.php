<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCategoryApiTest extends TestCase
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
        $this->getJson('/api/v1/admin/categories')->assertUnauthorized();

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/admin/categories')
            ->assertForbidden();
    }

    public function test_the_empty_directory_reports_zero_stats(): void
    {
        $this->asAdmin()
            ->getJson('/api/v1/admin/categories')
            ->assertOk()
            ->assertJsonPath('meta.total', 0)
            ->assertJsonPath('stats.total', 0)
            ->assertJsonPath('stats.product_listings', 0)
            ->assertJsonPath('stats.service_listings', 0)
            ->assertJsonMissingPath('stats.gmv')
            ->assertJsonMissingPath('stats.commission');
    }

    public function test_the_list_counts_real_listings_and_can_filter_empty_rows(): void
    {
        $filled = Category::factory()->create(['name' => 'Home & Living', 'slug' => 'home-living']);
        $empty = Category::factory()->create(['name' => 'Jobs', 'slug' => 'jobs']);
        Product::factory()->forStore(Store::factory()->create())->create([
            'category_id' => $filled->id,
            'type' => Product::TYPE_PHYSICAL,
        ]);
        Product::factory()->service()->create(['category_id' => $filled->id]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/categories')
            ->assertOk()
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('stats.product_listings', 1)
            ->assertJsonPath('stats.service_listings', 1)
            ->assertJsonPath('stats.empty', 1);

        $this->asAdmin()
            ->getJson('/api/v1/admin/categories?empty=1')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('categories.0.id', $empty->id)
            ->assertJsonPath('categories.0.is_empty', true);
    }

    public function test_an_administrator_can_create_and_update_a_category(): void
    {
        $parent = Category::factory()->create(['name' => 'Local Services', 'slug' => 'local-services']);

        $created = $this->asAdmin()
            ->postJson('/api/v1/admin/categories', [
                'name' => 'Home Help',
                'parent_id' => $parent->id,
                'tone' => 'sky',
            ])
            ->assertCreated()
            ->assertJsonPath('category.parent.slug', 'local-services')
            ->assertJsonPath('category.level', 1)
            ->assertJsonPath('category.is_active', true);

        $id = $created->json('category.id');

        $this->asAdmin()
            ->putJson("/api/v1/admin/categories/{$id}", [
                'name' => 'Home Services',
                'slug' => 'home-services',
                'is_active' => false,
            ])
            ->assertOk()
            ->assertJsonPath('category.name', 'Home Services')
            ->assertJsonPath('category.slug', 'home-services')
            ->assertJsonPath('category.is_active', false);
    }

    public function test_a_category_cannot_be_nested_under_itself(): void
    {
        $category = Category::factory()->create();

        $this->asAdmin()
            ->putJson("/api/v1/admin/categories/{$category->id}", [
                'parent_id' => $category->id,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('parent_id');
    }
}
