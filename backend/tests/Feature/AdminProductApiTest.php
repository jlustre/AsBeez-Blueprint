<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAdminEvent;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProductApiTest extends TestCase
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
        $this->getJson('/api/v1/admin/products')->assertUnauthorized();

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/admin/products')
            ->assertForbidden();
    }

    public function test_the_list_includes_store_and_inventory_state(): void
    {
        $vendor = User::factory()->role(User::ROLE_VENDOR)->create(['name' => 'Hive Goods']);
        $store = Store::factory()->ownedBy($vendor)->create(['name' => 'Golden Hive Market', 'slug' => 'golden-hive-market']);
        $product = Product::factory()->forStore($store)->published()->create([
            'name' => 'Wildflower Honey',
            'sku' => 'GH-HNY-1',
            'stock_qty' => 12,
            'low_stock_threshold' => 10,
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/products')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('products.0.id', $product->id)
            ->assertJsonPath('products.0.store.slug', 'golden-hive-market')
            ->assertJsonPath('products.0.inventory', Product::INVENTORY_IN_STOCK)
            ->assertJsonPath('stats.total', 1)
            ->assertJsonPath('stats.published', 1);
    }

    public function test_the_list_can_be_filtered_by_status_type_and_inventory(): void
    {
        $store = Store::factory()->create();
        $published = Product::factory()->forStore($store)->published()->create([
            'name' => 'Live Board',
            'type' => Product::TYPE_PHYSICAL,
            'stock_qty' => 80,
        ]);
        $pending = Product::factory()->forStore($store)->pending()->digital()->create([
            'name' => 'Invoice Template',
        ]);
        Product::factory()->forStore($store)->create([
            'name' => 'Empty Jar',
            'status' => Product::STATUS_PUBLISHED,
            'stock_qty' => 0,
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/products?status=pending')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('products.0.id', $pending->id);

        $this->asAdmin()
            ->getJson('/api/v1/admin/products?type=digital')
            ->assertOk()
            ->assertJsonPath('products.0.id', $pending->id);

        $this->asAdmin()
            ->getJson('/api/v1/admin/products?inventory=out_of_stock')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);

        $this->asAdmin()
            ->getJson('/api/v1/admin/products?search=Live')
            ->assertOk()
            ->assertJsonPath('products.0.id', $published->id);
    }

    public function test_show_includes_completeness_and_events(): void
    {
        $category = Category::query()->create([
            'name' => 'Home & Living',
            'slug' => 'home-living',
            'tone' => 'amber',
            'position' => 1,
            'is_active' => true,
        ]);
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'description' => str_repeat('A finished listing needs a real description. ', 2),
            'brand' => 'Hive',
            'tagline' => 'Serving board',
            'sku' => 'HH-BOARD-01',
            'price' => 74,
        ]);

        $this->asAdmin()
            ->getJson("/api/v1/admin/products/{$product->id}")
            ->assertOk()
            ->assertJsonPath('product.id', $product->id)
            ->assertJsonPath('product.category.slug', 'home-living')
            ->assertJsonStructure(['product' => ['completeness' => ['percent', 'tasks'], 'events']]);
    }

    public function test_an_administrator_can_change_status_and_add_a_note(): void
    {
        $product = Product::factory()->published()->create();

        $this->asAdmin()
            ->putJson("/api/v1/admin/products/{$product->id}/status", [
                'status' => Product::STATUS_HIDDEN,
            ])
            ->assertUnprocessable();

        $this->asAdmin()
            ->putJson("/api/v1/admin/products/{$product->id}/status", [
                'status' => Product::STATUS_HIDDEN,
                'reason' => 'Trademark report pending review.',
            ])
            ->assertOk()
            ->assertJsonPath('product.status', Product::STATUS_HIDDEN)
            ->assertJsonPath('product.events.0.type', ProductAdminEvent::TYPE_STATUS);

        $this->asAdmin()
            ->postJson("/api/v1/admin/products/{$product->id}/notes", [
                'body' => 'Asked the vendor for brand authorization.',
            ])
            ->assertOk()
            ->assertJsonPath('product.events.0.type', ProductAdminEvent::TYPE_NOTE);
    }

    public function test_the_audit_feed_lists_recent_product_events(): void
    {
        $product = Product::factory()->create(['name' => 'Coastal Throw']);

        $product->adminEvents()->create([
            'author_id' => $this->admin->id,
            'type' => ProductAdminEvent::TYPE_NOTE,
            'body' => 'Looked over the listing copy.',
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/products/events')
            ->assertOk()
            ->assertJsonPath('events.0.product', 'Coastal Throw')
            ->assertJsonPath('events.0.body', 'Looked over the listing copy.');
    }
}
