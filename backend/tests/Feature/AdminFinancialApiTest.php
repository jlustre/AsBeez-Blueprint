<?php

namespace Tests\Feature;

use App\Models\FinancialEntry;
use App\Models\FinancialEntryAdminEvent;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminFinancialApiTest extends TestCase
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
        $this->getJson('/api/v1/admin/financials')->assertUnauthorized();

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/admin/financials')
            ->assertForbidden();
    }

    public function test_the_empty_directory_reports_zero_money(): void
    {
        $this->asAdmin()
            ->getJson('/api/v1/admin/financials')
            ->assertOk()
            ->assertJsonPath('meta.total', 0)
            ->assertJsonPath('stats.total', 0)
            ->assertJsonPath('stats.inflow_total', 0)
            ->assertJsonPath('stats.outflow_total', 0)
            ->assertJsonPath('stats.net_total', 0)
            ->assertJsonMissingPath('stats.gmv')
            ->assertJsonMissingPath('stats.platform_balance');
    }

    public function test_the_list_can_be_filtered_by_type_and_sums_posted_flows(): void
    {
        FinancialEntry::factory()->create([
            'type' => FinancialEntry::TYPE_PAYMENT,
            'direction' => FinancialEntry::DIRECTION_IN,
            'status' => FinancialEntry::STATUS_POSTED,
            'amount' => 100,
            'subject' => 'Hive Honey Jar',
        ]);
        FinancialEntry::factory()->payout()->create([
            'status' => FinancialEntry::STATUS_POSTED,
            'amount' => 40,
            'subject' => 'Vendor payout',
        ]);
        FinancialEntry::factory()->payout()->create([
            'status' => FinancialEntry::STATUS_PENDING,
            'amount' => 15,
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/financials')
            ->assertOk()
            ->assertJsonPath('meta.total', 3)
            ->assertJsonPath('stats.payment', 1)
            ->assertJsonPath('stats.payout', 2)
            ->assertJsonPath('stats.inflow_total', 100)
            ->assertJsonPath('stats.outflow_total', 40)
            ->assertJsonPath('stats.net_total', 60);

        $this->asAdmin()
            ->getJson('/api/v1/admin/financials?type=payout')
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
    }

    public function test_attention_includes_failed_entries(): void
    {
        $failed = FinancialEntry::factory()->failed()->create();
        FinancialEntry::factory()->create(['status' => FinancialEntry::STATUS_POSTED]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/financials?attention=1')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('entries.0.id', $failed->id)
            ->assertJsonPath('entries.0.needs_attention', true)
            ->assertJsonPath('stats.attention', 1);
    }

    public function test_an_administrator_can_change_status_and_add_a_note(): void
    {
        $entry = FinancialEntry::factory()->create(['status' => FinancialEntry::STATUS_PENDING]);

        $this->asAdmin()
            ->putJson("/api/v1/admin/financials/{$entry->id}/status", [
                'status' => FinancialEntry::STATUS_ON_HOLD,
            ])
            ->assertUnprocessable();

        $this->asAdmin()
            ->putJson("/api/v1/admin/financials/{$entry->id}/status", [
                'status' => FinancialEntry::STATUS_ON_HOLD,
                'reason' => 'Bank account details are incomplete.',
            ])
            ->assertOk()
            ->assertJsonPath('entry.status', FinancialEntry::STATUS_ON_HOLD)
            ->assertJsonPath('entry.events.0.type', FinancialEntryAdminEvent::TYPE_STATUS);

        $this->asAdmin()
            ->postJson("/api/v1/admin/financials/{$entry->id}/notes", [
                'body' => 'Asked the vendor for a replacement routing number.',
            ])
            ->assertOk()
            ->assertJsonPath('entry.events.0.type', FinancialEntryAdminEvent::TYPE_NOTE);
    }

    public function test_an_entry_can_point_at_an_order_without_inventing_fees(): void
    {
        $order = Order::factory()->create(['item_name' => 'Hive Honey Jar', 'total' => 24.50]);
        $entry = FinancialEntry::factory()->forOrder($order)->create();

        $this->asAdmin()
            ->getJson("/api/v1/admin/financials/{$entry->id}")
            ->assertOk()
            ->assertJsonPath('entry.order.code', $order->code())
            ->assertJsonPath('entry.amount', 24.5)
            ->assertJsonMissingPath('entry.processor_fee')
            ->assertJsonMissingPath('entry.vendor_net');
    }
}
