<?php

namespace Tests\Feature;

use App\Models\Category;
use Database\Seeders\StoreStructureSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CategoryNavigationApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(StoreStructureSeeder::class);
    }

    public function test_browsing_the_catalogue_needs_no_account(): void
    {
        $this->getJson('/api/v1/categories')->assertOk();
    }

    public function test_it_returns_the_whole_tree_not_just_roots(): void
    {
        $payload = $this->getJson('/api/v1/categories')->assertOk()->json('categories');

        $this->assertSame(Category::whereNull('parent_id')->count(), count($payload));
        $this->assertSame(Category::count(), $this->countNodes($payload));

        // Four levels survive the nesting; a flattened tree would pass a
        // node count but lose the descendants.
        $physical = collect($payload)->firstWhere('slug', 'physical-products');
        $electronics = collect($physical['children'])->firstWhere('slug', 'electronics');
        $computers = collect($electronics['children'])->firstWhere('slug', 'computers-accessories');

        $this->assertNotEmpty($computers['children']);
        $this->assertContains('laptops', array_column($computers['children'], 'slug'));
    }

    public function test_totals_roll_descendant_listings_upward(): void
    {
        $payload = $this->getJson('/api/v1/categories')->assertOk()->json('categories');

        foreach ($payload as $root) {
            $this->assertSame(
                $this->sumListings($root),
                $root['total_count'],
                "Rolled-up total for [{$root['slug']}] disagrees with its branch.",
            );
        }
    }

    public function test_inactive_categories_are_withheld(): void
    {
        Category::whereSlug('laptops')->update(['is_active' => false]);

        $payload = $this->getJson('/api/v1/categories')->assertOk()->json('categories');
        $slugs = [];
        $this->collectSlugs($payload, $slugs);

        $this->assertNotContains('laptops', $slugs);
        $this->assertContains('computers-accessories', $slugs);
    }

    /**
     * The tree is ~150 rows; built naively it costs a query per row, and the
     * menu is on every page. Two is the whole tree plus its translations.
     */
    public function test_the_tree_costs_a_constant_number_of_queries(): void
    {
        DB::enableQueryLog();
        $this->getJson('/api/v1/categories')->assertOk();

        $this->assertLessThanOrEqual(5, count(DB::getQueryLog()));
    }

    /** @param array<int, array<string, mixed>> $rows */
    private function countNodes(array $rows): int
    {
        return array_sum(array_map(fn ($row) => 1 + $this->countNodes($row['children']), $rows));
    }

    /** @param array<string, mixed> $node */
    private function sumListings(array $node): int
    {
        return $node['listing_count']
            + array_sum(array_map(fn ($child) => $this->sumListings($child), $node['children']));
    }

    /** @param array<int, array<string, mixed>> $rows */
    private function collectSlugs(array $rows, array &$slugs): void
    {
        foreach ($rows as $row) {
            $slugs[] = $row['slug'];
            $this->collectSlugs($row['children'], $slugs);
        }
    }
}
