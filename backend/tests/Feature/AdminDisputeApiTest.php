<?php

namespace Tests\Feature;

use App\Models\Dispute;
use App\Models\DisputeAdminEvent;
use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDisputeApiTest extends TestCase
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
        $this->getJson('/api/v1/admin/disputes')->assertUnauthorized();

        $this->actingAs(User::factory()->role(User::ROLE_VENDOR)->create())
            ->getJson('/api/v1/admin/disputes')
            ->assertForbidden();
    }

    public function test_the_empty_directory_reports_zero_stats(): void
    {
        $this->asAdmin()
            ->getJson('/api/v1/admin/disputes')
            ->assertOk()
            ->assertJsonPath('meta.total', 0)
            ->assertJsonPath('stats.total', 0)
            ->assertJsonPath('stats.open_total', 0)
            ->assertJsonPath('stats.attention', 0)
            ->assertJsonMissingPath('stats.refunded_amount')
            ->assertJsonMissingPath('stats.average_resolution');
    }

    public function test_the_list_can_be_filtered_by_status_and_type(): void
    {
        $store = Store::factory()->create();
        $open = Dispute::factory()->forStore($store)->create([
            'subject' => 'Item not received',
            'status' => Dispute::STATUS_OPEN,
            'type' => Dispute::TYPE_ORDER,
        ]);
        Dispute::factory()->forStore($store)->create([
            'subject' => 'Provider no-show',
            'type' => Dispute::TYPE_BOOKING,
            'reason' => Dispute::REASON_NO_SHOW,
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/disputes')
            ->assertOk()
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('stats.open', 1);

        $this->asAdmin()
            ->getJson('/api/v1/admin/disputes?status=open')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('disputes.0.id', $open->id)
            ->assertJsonPath('disputes.0.code', $open->code());

        $this->asAdmin()
            ->getJson('/api/v1/admin/disputes?type=booking_dispute')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('disputes.0.type', Dispute::TYPE_BOOKING);
    }

    public function test_attention_includes_overdue_and_escalated_cases(): void
    {
        $overdue = Dispute::factory()->overdue()->create();
        Dispute::factory()->create([
            'status' => Dispute::STATUS_RESOLVED,
            'priority' => Dispute::PRIORITY_CRITICAL,
        ]);

        $this->asAdmin()
            ->getJson('/api/v1/admin/disputes?overdue=1')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('disputes.0.id', $overdue->id)
            ->assertJsonPath('disputes.0.is_overdue', true)
            ->assertJsonPath('stats.overdue', 1)
            ->assertJsonPath('stats.attention', 1);
    }

    public function test_an_administrator_can_change_status_and_add_a_note(): void
    {
        $dispute = Dispute::factory()->create(['status' => Dispute::STATUS_OPEN]);

        $this->asAdmin()
            ->putJson("/api/v1/admin/disputes/{$dispute->id}/status", [
                'status' => Dispute::STATUS_ESCALATED,
            ])
            ->assertUnprocessable();

        $this->asAdmin()
            ->putJson("/api/v1/admin/disputes/{$dispute->id}/status", [
                'status' => Dispute::STATUS_ESCALATED,
                'reason' => 'Vendor missed the evidence deadline.',
            ])
            ->assertOk()
            ->assertJsonPath('dispute.status', Dispute::STATUS_ESCALATED)
            ->assertJsonPath('dispute.events.0.type', DisputeAdminEvent::TYPE_STATUS);

        $this->asAdmin()
            ->postJson("/api/v1/admin/disputes/{$dispute->id}/notes", [
                'body' => 'Asked the vendor for the appointment log.',
            ])
            ->assertOk()
            ->assertJsonPath('dispute.events.0.type', DisputeAdminEvent::TYPE_NOTE);
    }

    public function test_a_case_can_point_at_an_order_without_inventing_finance(): void
    {
        $order = Order::factory()->create(['item_name' => 'Hive Honey Jar']);
        $dispute = Dispute::factory()->forOrder($order)->create();

        $this->asAdmin()
            ->getJson("/api/v1/admin/disputes/{$dispute->id}")
            ->assertOk()
            ->assertJsonPath('dispute.order.code', $order->code())
            ->assertJsonPath('dispute.order.item_name', 'Hive Honey Jar')
            ->assertJsonMissingPath('dispute.refunded_amount')
            ->assertJsonMissingPath('dispute.evidence_count');
    }
}
