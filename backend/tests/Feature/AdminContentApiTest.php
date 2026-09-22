<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\NavLink;
use App\Models\PolicyType;
use App\Models\User;
use Database\Seeders\MemberStructureSeeder;
use Database\Seeders\SpanishContentSeeder;
use Database\Seeders\StoreStructureSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminContentApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(StoreStructureSeeder::class);
        $this->seed(MemberStructureSeeder::class);
        $this->admin = User::factory()->role(User::ROLE_SUPER_ADMIN)->create();
    }

    private function asAdmin(): static
    {
        return $this->actingAs($this->admin);
    }

    public function test_the_list_requires_an_administrator(): void
    {
        $this->getJson('/api/v1/admin/content')->assertUnauthorized();

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/admin/content')
            ->assertForbidden();
    }

    public function test_the_directory_lists_recorded_registries_without_invented_cms_metrics(): void
    {
        $this->asAdmin()
            ->getJson('/api/v1/admin/content')
            ->assertOk()
            ->assertJsonPath('stats.navigation', NavLink::count())
            ->assertJsonPath('stats.policies', PolicyType::count())
            ->assertJsonPath('stats.categories', Category::count())
            ->assertJsonMissingPath('stats.views')
            ->assertJsonMissingPath('stats.seo')
            ->assertJsonMissingPath('stats.gmv')
            ->assertJsonMissingPath('items.0.views')
            ->assertJsonMissingPath('items.0.seo');

        $this->assertGreaterThan(50, $this->asAdmin()->getJson('/api/v1/admin/content')->json('stats.total'));
    }

    public function test_it_filters_by_type_and_search(): void
    {
        $this->asAdmin()
            ->getJson('/api/v1/admin/content?type=categories&search=digital')
            ->assertOk()
            ->assertJsonPath('stats.categories', Category::count());

        $titles = collect($this->asAdmin()->getJson('/api/v1/admin/content?type=categories&search=digital')->json('items'))
            ->pluck('identifier')
            ->all();

        $this->assertContains('digital-products', $titles);
        $this->assertNotContains('food-beverage', $titles);
    }

    public function test_incomplete_translation_filter_uses_real_spanish_coverage(): void
    {
        $before = $this->asAdmin()
            ->getJson('/api/v1/admin/content?translation=incomplete')
            ->assertOk()
            ->json('meta.total');

        $this->assertGreaterThan(0, $before);

        $this->seed(SpanishContentSeeder::class);

        $after = $this->asAdmin()
            ->getJson('/api/v1/admin/content?translation=incomplete')
            ->json('meta.total');

        $this->assertLessThan($before, $after);
    }

    public function test_an_administrator_can_hide_toggleable_content(): void
    {
        $link = NavLink::query()->firstOrFail();

        $this->asAdmin()
            ->putJson("/api/v1/admin/content/nav-links/{$link->id}", ['is_active' => false])
            ->assertOk()
            ->assertJsonPath('item.is_active', false);

        $this->assertFalse($link->fresh()->is_active);
    }

    public function test_policy_types_cannot_be_hidden_from_this_screen(): void
    {
        $policy = PolicyType::query()->firstOrFail();

        $this->asAdmin()
            ->putJson("/api/v1/admin/content/policy-types/{$policy->id}", ['is_active' => false])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('is_active');
    }

    public function test_the_navigation_tree_is_grouped_by_recorded_context(): void
    {
        $tree = $this->asAdmin()->getJson('/api/v1/admin/content')->json('tree');

        $this->assertContains('vendor', collect($tree)->pluck('context')->all());
        $this->assertContains('member', collect($tree)->pluck('context')->all());
    }
}
