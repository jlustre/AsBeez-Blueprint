<?php

namespace Tests\Feature;

use App\Models\PpfFaq;
use App\Models\PpfMarket;
use App\Models\PpfPlan;
use App\Models\PpfSetting;
use App\Models\PpfTier;
use Database\Seeders\PpfSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPpfApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_public_page_is_unpublished_without_fixtures(): void
    {
        $this->getJson('/api/v1/ppf')
            ->assertOk()
            ->assertJsonPath('published', false)
            ->assertJsonPath('settings', null)
            ->assertJsonPath('tiers', [])
            ->assertJsonPath('markets', [])
            ->assertJsonPath('faqs', [])
            ->assertJsonPath('stats.markets', 0)
            ->assertJsonMissingPath('quote');
    }

    public function test_the_seeder_publishes_the_fee_schedule(): void
    {
        $this->seed(PpfSeeder::class);

        $response = $this->getJson('/api/v1/ppf')
            ->assertOk()
            ->assertJsonPath('published', true)
            ->assertJsonPath('settings.copy.title', 'Platform Participation Fees')
            ->assertJsonPath('stats.markets', 7)
            ->assertJsonPath('stats.common_tiers', 4)
            ->assertJsonCount(4, 'tiers')
            ->assertJsonCount(7, 'markets')
            ->assertJsonCount(14, 'faqs')
            ->assertJsonMissingPath('settings.company_percent')
            ->assertJsonMissingPath('settings.copy.rewards_company_label')
            ->assertJsonPath('settings.compensation_percent', 60)
            ->assertJsonPath('settings.rp_per_dollar', 10)
            ->assertJsonPath('settings.example_ppf_amount', 8)
            ->assertJsonPath('settings.copy.rewards_title', 'How the PPF becomes Reward Points');

        $statementLabels = collect($response->json('settings.statement.lines'))->pluck('label');
        $this->assertFalse($statementLabels->contains(fn (string $label) => str_contains(strtolower($label), 'company revenue')));

        $this->assertSame('shop', $response->json('markets.0.slug'));
        $this->assertTrue($response->json('markets.0.has_cards'));
        $this->assertNotEmpty($response->json('markets.0.plans'));
        $this->assertSame('travel', $response->json('markets.6.slug'));
        $this->assertCount(3, $response->json('markets.6.children'));
        $this->assertSame('hotels', $response->json('markets.6.children.0.slug'));
        $this->assertNotEmpty($response->json('markets.6.children.0.plans'));
    }

    public function test_unpublished_and_inactive_rows_are_omitted(): void
    {
        $settings = PpfSetting::query()->create(PpfSetting::defaults());
        $settings->forceFill([
            'is_published' => true,
            'copy' => array_merge(PpfSetting::defaults()['copy'], ['title' => 'Visible fees']),
        ])->save();

        $visible = PpfTier::factory()->create(['name' => 'Hive Visible', 'is_active' => true]);
        PpfTier::factory()->hidden()->create(['name' => 'Hive Hidden']);

        $market = PpfMarket::factory()->create(['label' => 'Shop', 'is_active' => true]);
        PpfMarket::factory()->hidden()->create(['label' => 'Secret']);
        PpfPlan::factory()->create(['ppf_market_id' => $market->id, 'ppf_tier_id' => $visible->id, 'name' => 'Visible plan']);
        PpfPlan::factory()->hidden()->create(['ppf_market_id' => $market->id, 'name' => 'Hidden plan']);
        PpfFaq::factory()->create(['question' => 'Visible question?']);
        PpfFaq::factory()->hidden()->create(['question' => 'Hidden question?']);

        $response = $this->getJson('/api/v1/ppf')
            ->assertOk()
            ->assertJsonPath('published', true)
            ->assertJsonCount(1, 'tiers')
            ->assertJsonCount(1, 'markets')
            ->assertJsonCount(1, 'markets.0.plans')
            ->assertJsonCount(1, 'faqs')
            ->assertJsonPath('tiers.0.name', 'Hive Visible')
            ->assertJsonPath('faqs.0.question', 'Visible question?');

        $this->assertSame('Visible plan', $response->json('markets.0.plans.0.name'));

        $settings->update(['is_published' => false]);

        $this->getJson('/api/v1/ppf')
            ->assertOk()
            ->assertJsonPath('published', false)
            ->assertJsonPath('settings', null)
            ->assertJsonPath('markets', []);
    }

    public function test_company_revenue_stays_off_the_public_payload(): void
    {
        $settings = PpfSetting::query()->create(PpfSetting::defaults());
        $settings->forceFill([
            'is_published' => true,
            'company_percent' => 40,
            'compensation_percent' => 60,
            'rp_per_dollar' => 10,
            'copy' => array_merge(PpfSetting::defaults()['copy'], [
                'title' => 'Visible fees',
                'rewards_company_label' => 'Company revenue',
                'rewards_fund_label' => 'Compensation Fund',
            ]),
            'statement' => [
                'title' => 'Example statement',
                'reference' => 'ABZ-1',
                'status' => 'Completed',
                'note' => '',
                'lines' => [
                    ['label' => 'Hive Growth PPF (8%)', 'value' => '−$8.00'],
                    ['label' => 'Company revenue (40% of PPF)', 'value' => '$3.20'],
                    ['label' => 'Compensation Fund (60% of PPF)', 'value' => '$4.80'],
                ],
            ],
        ])->save();

        $response = $this->getJson('/api/v1/ppf')
            ->assertOk()
            ->assertJsonPath('published', true)
            ->assertJsonMissingPath('settings.company_percent')
            ->assertJsonMissingPath('settings.copy.rewards_company_label')
            ->assertJsonPath('settings.compensation_percent', 60)
            ->assertJsonPath('settings.copy.rewards_fund_label', 'Compensation Fund');

        $this->assertSame(
            ['Hive Growth PPF (8%)', 'Compensation Fund (60% of PPF)'],
            collect($response->json('settings.statement.lines'))->pluck('label')->all(),
        );
    }
}
