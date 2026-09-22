<?php

namespace Tests\Feature;

use App\Models\PpfMarket;
use App\Models\PpfTier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPpfApiTest extends TestCase
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

    public function test_the_directory_requires_an_administrator(): void
    {
        $this->getJson('/api/v1/admin/ppf')->assertUnauthorized();

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/admin/ppf')
            ->assertForbidden();
    }

    public function test_the_empty_directory_reports_zero_stats(): void
    {
        $this->asAdmin()
            ->getJson('/api/v1/admin/ppf')
            ->assertOk()
            ->assertJsonPath('stats.tiers', 0)
            ->assertJsonPath('stats.markets', 0)
            ->assertJsonPath('stats.plans', 0)
            ->assertJsonPath('stats.faqs', 0)
            ->assertJsonPath('stats.published', false)
            ->assertJsonPath('settings.copy.title', '');
    }

    public function test_an_administrator_can_save_page_settings(): void
    {
        $this->asAdmin()
            ->putJson('/api/v1/admin/ppf/settings', [
                'is_published' => true,
                'copy' => [
                    'title' => 'Platform Participation Fees',
                    'eyebrow' => 'Transparent partner pricing',
                ],
                'processing_percent' => 2.9,
                'processing_fixed' => 0.30,
                'company_percent' => 40,
                'compensation_percent' => 60,
                'rp_per_dollar' => 10,
                'example_ppf_amount' => 8,
                'anatomy_items' => [
                    ['title' => 'Participation fee', 'body' => 'Market-specific platform charge.'],
                ],
            ])
            ->assertOk()
            ->assertJsonPath('settings.is_published', true)
            ->assertJsonPath('settings.copy.title', 'Platform Participation Fees')
            ->assertJsonPath('settings.copy.eyebrow', 'Transparent partner pricing')
            ->assertJsonPath('settings.processing_percent', 2.9)
            ->assertJsonPath('settings.company_percent', 40)
            ->assertJsonPath('settings.compensation_percent', 60)
            ->assertJsonPath('settings.rp_per_dollar', 10)
            ->assertJsonPath('settings.example_ppf_amount', 8)
            ->assertJsonCount(1, 'settings.anatomy_items');

        $this->assertDatabaseHas('ppf_settings', ['is_published' => true]);
    }

    public function test_unknown_copy_keys_are_rejected(): void
    {
        $this->asAdmin()
            ->putJson('/api/v1/admin/ppf/settings', [
                'copy' => ['invented' => 'No'],
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('copy');
    }

    public function test_an_administrator_can_create_update_and_delete_a_tier(): void
    {
        $created = $this->asAdmin()
            ->postJson('/api/v1/admin/ppf/tiers', [
                'name' => 'Hive Start',
                'badge' => 'ENTRY',
                'summary' => 'Affordable entry.',
            ])
            ->assertCreated()
            ->assertJsonPath('tier.slug', 'hive-start')
            ->assertJsonPath('tier.badge', 'ENTRY')
            ->assertJsonPath('tier.is_active', true);

        $id = $created->json('tier.id');

        $this->asAdmin()
            ->putJson("/api/v1/admin/ppf/tiers/{$id}", [
                'name' => 'Hive Starter',
                'is_active' => false,
            ])
            ->assertOk()
            ->assertJsonPath('tier.name', 'Hive Starter')
            ->assertJsonPath('tier.is_active', false);

        $this->asAdmin()
            ->deleteJson("/api/v1/admin/ppf/tiers/{$id}")
            ->assertOk();

        $this->assertDatabaseMissing('ppf_tiers', ['id' => $id]);
    }

    public function test_an_administrator_can_create_update_and_delete_a_market_and_plan(): void
    {
        $tier = PpfTier::factory()->create(['name' => 'Hive Growth']);

        $market = $this->asAdmin()
            ->postJson('/api/v1/admin/ppf/markets', [
                'label' => 'Shop',
                'subtitle' => 'Physical Products',
                'has_cards' => true,
                'columns' => [
                    ['key' => 'subscription', 'label' => 'Subscription'],
                    ['key' => 'ppf', 'label' => 'PPF'],
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('market.slug', 'shop')
            ->assertJsonPath('market.has_cards', true);

        $marketId = $market->json('market.id');

        $plan = $this->asAdmin()
            ->postJson('/api/v1/admin/ppf/plans', [
                'ppf_market_id' => $marketId,
                'ppf_tier_id' => $tier->id,
                'name' => 'Hive Growth',
                'rate_label' => '8%',
                'percent_rate' => 8,
                'subscription_amount' => 39,
                'cells' => ['subscription' => '$39/month', 'ppf' => '8%'],
            ])
            ->assertCreated()
            ->assertJsonPath('plan.percent_rate', 8)
            ->assertJsonPath('plan.cells.ppf', '8%');

        $planId = $plan->json('plan.id');

        $this->asAdmin()
            ->putJson("/api/v1/admin/ppf/plans/{$planId}", [
                'percent_rate' => 7.5,
                'is_featured' => true,
            ])
            ->assertOk()
            ->assertJsonPath('plan.percent_rate', 7.5)
            ->assertJsonPath('plan.is_featured', true);

        $this->asAdmin()
            ->deleteJson("/api/v1/admin/ppf/plans/{$planId}")
            ->assertOk();

        $this->asAdmin()
            ->deleteJson("/api/v1/admin/ppf/markets/{$marketId}")
            ->assertOk();

        $this->assertDatabaseMissing('ppf_markets', ['id' => $marketId]);
        $this->assertDatabaseMissing('ppf_plans', ['id' => $planId]);
    }

    public function test_a_market_cannot_be_nested_under_itself(): void
    {
        $parent = PpfMarket::factory()->create(['label' => 'Travel']);
        $child = PpfMarket::factory()->childOf($parent)->create(['label' => 'Hotels']);

        $this->asAdmin()
            ->putJson("/api/v1/admin/ppf/markets/{$parent->id}", [
                'parent_id' => $child->id,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('parent_id');
    }

    public function test_an_administrator_can_create_update_and_delete_a_faq(): void
    {
        $created = $this->asAdmin()
            ->postJson('/api/v1/admin/ppf/faqs', [
                'question' => 'What is a Platform Participation Fee?',
                'answer' => 'The market-specific amount AsBeez charges for platform access.',
            ])
            ->assertCreated()
            ->assertJsonPath('faq.question', 'What is a Platform Participation Fee?');

        $id = $created->json('faq.id');

        $this->asAdmin()
            ->putJson("/api/v1/admin/ppf/faqs/{$id}", [
                'answer' => 'Updated answer.',
                'is_active' => false,
            ])
            ->assertOk()
            ->assertJsonPath('faq.answer', 'Updated answer.')
            ->assertJsonPath('faq.is_active', false);

        $this->asAdmin()
            ->deleteJson("/api/v1/admin/ppf/faqs/{$id}")
            ->assertOk();

        $this->assertDatabaseMissing('ppf_faqs', ['id' => $id]);
    }

    public function test_a_plan_requires_a_market_and_a_name(): void
    {
        $this->asAdmin()
            ->postJson('/api/v1/admin/ppf/plans', [
                'percent_rate' => 8,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['ppf_market_id', 'name']);
    }
}
