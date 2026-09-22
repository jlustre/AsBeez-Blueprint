<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\CommissionRule;
use App\Models\CommissionSetting;
use App\Models\FinancialEntry;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCommissionApiTest extends TestCase
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
        $this->getJson('/api/v1/admin/commissions')->assertUnauthorized();

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/admin/commissions')
            ->assertForbidden();
    }

    public function test_the_empty_directory_reports_zero_stats_and_omits_invented_money(): void
    {
        $this->asAdmin()
            ->getJson('/api/v1/admin/commissions')
            ->assertOk()
            ->assertJsonPath('meta.total', 0)
            ->assertJsonPath('stats.total', 0)
            ->assertJsonPath('stats.active', 0)
            ->assertJsonPath('stats.average_rate', null)
            ->assertJsonPath('stats.commission_entries', 0)
            ->assertJsonPath('stats.commission_amount', 0)
            ->assertJsonPath('settings.global_rate', null)
            ->assertJsonCount(0, 'entries')
            ->assertJsonMissingPath('stats.gmv')
            ->assertJsonMissingPath('stats.earned_this_month')
            ->assertJsonMissingPath('stats.pending_amount')
            ->assertJsonMissingPath('stats.available_to_settle');
    }

    public function test_the_list_counts_effective_statuses_and_can_filter_expired_rules(): void
    {
        CommissionRule::factory()->active()->create(['name' => 'Marketplace default']);
        $expired = CommissionRule::factory()->expired()->create(['name' => 'Summer promo']);
        CommissionRule::factory()->scheduled()->create(['name' => 'Holiday intro']);
        CommissionRule::factory()->create(['name' => 'Draft premium']);

        $this->asAdmin()
            ->getJson('/api/v1/admin/commissions')
            ->assertOk()
            ->assertJsonPath('meta.total', 4)
            ->assertJsonPath('stats.active', 1)
            ->assertJsonPath('stats.scheduled', 1)
            ->assertJsonPath('stats.draft', 1)
            ->assertJsonPath('stats.expired', 1)
            ->assertJsonPath('stats.attention', 1);

        $this->asAdmin()
            ->getJson('/api/v1/admin/commissions?status=expired')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('rules.0.id', $expired->id)
            ->assertJsonPath('rules.0.effective_status', 'expired');
    }

    public function test_an_administrator_can_create_and_update_a_category_rule(): void
    {
        $category = Category::factory()->create(['name' => 'Electronics', 'slug' => 'electronics']);

        $created = $this->asAdmin()
            ->postJson('/api/v1/admin/commissions', [
                'name' => 'Electronics category rate',
                'status' => 'active',
                'calculation_type' => 'percentage',
                'percentage_rate' => 9.5,
                'applies_to' => 'categories',
                'category_id' => $category->id,
                'priority' => 20,
            ])
            ->assertCreated()
            ->assertJsonPath('rule.category.slug', 'electronics')
            ->assertJsonPath('rule.rate_label', '9.5%')
            ->assertJsonPath('rule.effective_status', 'active');

        $id = $created->json('rule.id');

        $this->asAdmin()
            ->putJson("/api/v1/admin/commissions/{$id}", [
                'name' => 'Electronics seasonal rate',
                'percentage_rate' => 8,
                'status' => 'disabled',
            ])
            ->assertOk()
            ->assertJsonPath('rule.name', 'Electronics seasonal rate')
            ->assertJsonPath('rule.percentage_rate', 8)
            ->assertJsonPath('rule.effective_status', 'disabled');
    }

    public function test_a_vendor_rule_requires_a_store_and_a_percentage_rule_requires_a_rate(): void
    {
        $this->asAdmin()
            ->postJson('/api/v1/admin/commissions', [
                'name' => 'Vendor override',
                'applies_to' => 'selected_vendors',
                'calculation_type' => 'percentage',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['store_id', 'percentage_rate']);
    }

    public function test_an_administrator_can_change_status_add_a_note_and_save_settings(): void
    {
        $rule = CommissionRule::factory()->create(['status' => 'draft']);

        $this->asAdmin()
            ->putJson("/api/v1/admin/commissions/{$rule->id}/status", ['status' => 'active'])
            ->assertOk()
            ->assertJsonPath('rule.status', 'active');

        $this->asAdmin()
            ->putJson("/api/v1/admin/commissions/{$rule->id}/status", ['status' => 'active'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $this->asAdmin()
            ->postJson("/api/v1/admin/commissions/{$rule->id}/notes", ['body' => 'Agreed with the vendor.'])
            ->assertOk()
            ->assertJsonPath('rule.events.0.body', 'Agreed with the vendor.');

        $this->asAdmin()
            ->putJson('/api/v1/admin/commissions/settings', [
                'global_rate' => 11,
                'currency' => 'CAD',
                'include_shipping' => true,
            ])
            ->assertOk()
            ->assertJsonPath('settings.global_rate', 11)
            ->assertJsonPath('settings.currency', 'CAD')
            ->assertJsonPath('settings.include_shipping', true);

        $this->assertSame(1, CommissionSetting::query()->count());
    }

    public function test_recorded_commission_entries_appear_without_inventing_earnings(): void
    {
        FinancialEntry::factory()->create([
            'type' => FinancialEntry::TYPE_COMMISSION,
            'subject' => 'Platform commission',
            'amount' => 18.40,
            'store_id' => Store::factory(),
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/commissions')
            ->assertOk()
            ->assertJsonPath('stats.commission_entries', 1)
            ->assertJsonPath('stats.commission_amount', 18.4)
            ->assertJsonPath('entries.0.code', 'COM-00001')
            ->assertJsonPath('entries.0.amount', 18.4);
    }
}
