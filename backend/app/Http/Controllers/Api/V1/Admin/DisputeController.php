<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dispute;
use App\Models\DisputeAdminEvent;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Dispute administration.
 *
 * Chargebacks, evidence files, refunds, payout holds and resolution clocks
 * are not here. This screen lists case records that already exist — today
 * that set is empty until those engines write rows.
 */
class DisputeController extends Controller
{
    private const SORTS = [
        'newest' => ['created_at', 'desc'],
        'oldest' => ['created_at', 'asc'],
        'amount-high' => ['amount', 'desc'],
        'amount-low' => ['amount', 'asc'],
        'deadline' => ['due_at', 'asc'],
        'updated' => ['updated_at', 'desc'],
    ];

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'type' => ['nullable', Rule::in(Dispute::TYPES)],
            'reason' => ['nullable', Rule::in(Dispute::REASONS)],
            'status' => ['nullable', Rule::in(Dispute::STATUSES)],
            'priority' => ['nullable', Rule::in(Dispute::PRIORITIES)],
            'outcome' => ['nullable', Rule::in(Dispute::OUTCOMES)],
            'store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'unassigned' => ['nullable', 'boolean'],
            'attention' => ['nullable', 'boolean'],
            'overdue' => ['nullable', 'boolean'],
            'created_from' => ['nullable', 'date'],
            'created_to' => ['nullable', 'date', 'after_or_equal:created_from'],
            'min_amount' => ['nullable', 'numeric', 'min:0'],
            'max_amount' => ['nullable', 'numeric', 'min:0'],
            'sort' => ['nullable', Rule::in(array_keys(self::SORTS))],
            'per_page' => ['nullable', 'integer', Rule::in([10, 25, 50, 100])],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        [$column, $direction] = self::SORTS[$filters['sort'] ?? 'newest'];

        $disputes = Dispute::query()
            ->with(['customer', 'store.owner', 'order', 'assignee'])
            ->when($filters['search'] ?? null, fn ($query, $term) => $this->applySearch($query, $term))
            ->when($filters['type'] ?? null, fn ($query, $type) => $query->where('type', $type))
            ->when($filters['reason'] ?? null, fn ($query, $reason) => $query->where('reason', $reason))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['priority'] ?? null, fn ($query, $priority) => $query->where('priority', $priority))
            ->when($filters['outcome'] ?? null, fn ($query, $outcome) => $query->where('outcome', $outcome))
            ->when($filters['store_id'] ?? null, fn ($query, $id) => $query->where('store_id', $id))
            ->when($filters['assigned_to'] ?? null, fn ($query, $id) => $query->where('assigned_to', $id))
            ->when($request->boolean('unassigned'), fn ($query) => $query->whereNull('assigned_to'))
            ->when($request->boolean('attention'), fn ($query) => $this->applyAttention($query))
            ->when($request->boolean('overdue'), fn ($query) => $this->applyOverdue($query))
            ->when($filters['created_from'] ?? null, fn ($query, $from) => $query->whereDate('created_at', '>=', $from))
            ->when($filters['created_to'] ?? null, fn ($query, $to) => $query->whereDate('created_at', '<=', $to))
            ->when($filters['min_amount'] ?? null, fn ($query, $min) => $query->where('amount', '>=', $min))
            ->when($filters['max_amount'] ?? null, fn ($query, $max) => $query->where('amount', '<=', $max))
            ->orderBy($column, $direction)
            ->orderBy('id', 'desc')
            ->paginate($filters['per_page'] ?? 25)
            ->withQueryString();

        return response()->json([
            'disputes' => $disputes->getCollection()->map(fn (Dispute $dispute) => $this->summarise($dispute))->all(),
            'meta' => [
                'page' => $disputes->currentPage(),
                'per_page' => $disputes->perPage(),
                'total' => $disputes->total(),
                'last_page' => $disputes->lastPage(),
                'from' => $disputes->firstItem(),
                'to' => $disputes->lastItem(),
            ],
            'stats' => $this->stats(),
            'types' => Dispute::TYPES,
            'reasons' => Dispute::REASONS,
            'statuses' => Dispute::STATUSES,
            'priorities' => Dispute::PRIORITIES,
            'outcomes' => Dispute::OUTCOMES,
            'stores' => Store::query()
                ->with('owner:id,name')
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'owner_id'])
                ->map(fn (Store $store) => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'slug' => $store->slug,
                    'vendor_id' => $store->owner_id,
                    'vendor_name' => $store->owner?->name,
                ])->all(),
        ]);
    }

    public function show(Dispute $dispute): JsonResponse
    {
        $dispute->load(['customer', 'store.owner', 'order', 'assignee', 'adminEvents.author', 'statusChangedBy']);

        return response()->json([
            'dispute' => $this->detail($dispute),
        ]);
    }

    public function updateStatus(Request $request, Dispute $dispute): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(Dispute::STATUSES)],
            'reason' => [
                Rule::requiredIf(fn () => in_array($request->input('status'), Dispute::STATUSES_NEEDING_REASON, true)),
                'nullable', 'string', 'max:2000',
            ],
        ]);

        $from = $dispute->status;

        if ($from === $validated['status']) {
            throw ValidationException::withMessages([
                'status' => __('app.disputes.already_in_status'),
            ]);
        }

        DB::transaction(function () use ($dispute, $validated, $from, $request): void {
            $dispute->forceFill([
                'status' => $validated['status'],
                'status_reason' => $validated['reason'] ?? null,
                'status_changed_at' => now(),
                'status_changed_by' => $request->user()->id,
            ])->save();

            $dispute->adminEvents()->create([
                'author_id' => $request->user()->id,
                'type' => DisputeAdminEvent::TYPE_STATUS,
                'body' => $validated['reason'] ?? null,
                'from_status' => $from,
                'to_status' => $validated['status'],
            ]);
        });

        return $this->show($dispute->fresh());
    }

    public function storeNote(Request $request, Dispute $dispute): JsonResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $dispute->adminEvents()->create([
            'author_id' => $request->user()->id,
            'type' => DisputeAdminEvent::TYPE_NOTE,
            'body' => $validated['body'],
        ]);

        return $this->show($dispute);
    }

    public function events(Request $request): JsonResponse
    {
        $events = DisputeAdminEvent::query()
            ->with([
                'dispute:id,type,subject,store_id,customer_id',
                'dispute.store:id,name,owner_id',
                'dispute.store.owner:id,name',
                'dispute.customer:id,name',
                'author:id,name',
            ])
            ->latest()
            ->limit((int) $request->integer('limit', 10))
            ->get();

        return response()->json([
            'events' => $events->map(fn (DisputeAdminEvent $event) => [
                'id' => $event->id,
                'type' => $event->type,
                'body' => $event->body,
                'from_status' => $event->from_status,
                'to_status' => $event->to_status,
                'dispute' => $event->dispute?->code(),
                'dispute_id' => $event->dispute_id,
                'subject' => $event->dispute?->subject,
                'customer' => $event->dispute?->customer?->name,
                'vendor' => $event->dispute?->store?->owner?->name,
                'author' => $event->author?->name,
                'created_at' => $event->created_at?->toIso8601String(),
            ])->all(),
        ]);
    }

    private function applySearch($query, string $term)
    {
        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';

        return $query->where(function ($query) use ($like, $term): void {
            $query->where('subject', 'like', $like)
                ->orWhereHas('customer', fn ($customers) => $customers
                    ->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like))
                ->orWhereHas('store', fn ($stores) => $stores
                    ->where('name', 'like', $like)
                    ->orWhereHas('owner', fn ($owners) => $owners
                        ->where('name', 'like', $like)
                        ->orWhere('email', 'like', $like)))
                ->orWhereHas('order', fn ($orders) => $orders->where('item_name', 'like', $like));

            if (preg_match('/^DSP-?(\d+)$/i', trim($term), $matches)) {
                $query->orWhere('id', (int) $matches[1]);
            } elseif (preg_match('/^(ASB|BKG)-?(\d+)$/i', trim($term), $matches)) {
                $query->orWhere('order_id', (int) $matches[2]);
            } elseif (ctype_digit($term)) {
                $query->orWhere('id', (int) $term);
            }
        });
    }

    private function applyAttention($query)
    {
        return $query->whereIn('status', Dispute::OPEN_STATUSES)
            ->where(function ($query): void {
                $query->where('status', Dispute::STATUS_ESCALATED)
                    ->orWhereIn('priority', [Dispute::PRIORITY_URGENT, Dispute::PRIORITY_CRITICAL])
                    ->orWhere(fn ($query) => $this->applyOverdue($query));
            });
    }

    private function applyOverdue($query)
    {
        return $query->whereIn('status', Dispute::OPEN_STATUSES)
            ->whereNotNull('due_at')
            ->where('due_at', '<', now());
    }

    /**
     * @return array<string, int>
     */
    private function stats(): array
    {
        $open = Dispute::OPEN_STATUSES;

        $counts = Dispute::query()
            ->selectRaw('count(*) as total')
            ->selectRaw('sum(case when created_at >= ? then 1 else 0 end) as new_this_month', [now()->startOfMonth()])
            ->selectRaw('sum(case when status in (?, ?) and coalesce(status_changed_at, updated_at) >= ? then 1 else 0 end) as resolved_this_month', [
                Dispute::STATUS_RESOLVED,
                Dispute::STATUS_CLOSED,
                now()->startOfMonth(),
            ])
            ->first();

        $overdue = Dispute::query()->where(fn ($query) => $this->applyOverdue($query))->count();
        $attention = Dispute::query()->where(fn ($query) => $this->applyAttention($query))->count();

        $byStatus = Dispute::query()
            ->groupBy('status')
            ->selectRaw('status, count(*) as total')
            ->pluck('total', 'status');

        $stats = [
            'total' => (int) $counts->total,
            'new_this_month' => (int) $counts->new_this_month,
            'resolved_this_month' => (int) $counts->resolved_this_month,
            'overdue' => $overdue,
            'attention' => $attention,
            'chargebacks' => Dispute::query()->where('type', Dispute::TYPE_CHARGEBACK)->count(),
            'open_total' => Dispute::query()->whereIn('status', $open)->count(),
        ];

        foreach (Dispute::STATUSES as $status) {
            $stats[$status] = (int) ($byStatus[$status] ?? 0);
        }

        return $stats;
    }

    /**
     * @return array<string, mixed>
     */
    private function summarise(Dispute $dispute): array
    {
        $customer = $dispute->customer;
        $store = $dispute->store;
        $order = $dispute->order;

        return [
            'id' => $dispute->id,
            'code' => $dispute->code(),
            'type' => $dispute->type,
            'reason' => $dispute->reason,
            'status' => $dispute->status,
            'priority' => $dispute->priority,
            'outcome' => $dispute->outcome,
            'subject' => $dispute->subject,
            'amount' => $dispute->amount !== null ? (float) $dispute->amount : null,
            'currency' => $dispute->currency,
            'due_at' => $dispute->due_at?->toIso8601String(),
            'is_overdue' => $dispute->isOverdue(),
            'needs_attention' => $dispute->needsAttention(),
            'created_at' => $dispute->created_at?->toIso8601String(),
            'updated_at' => $dispute->updated_at?->toIso8601String(),
            'customer' => $customer ? [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
            ] : null,
            'store' => $store ? [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'logo_url' => $store->logoUrl(),
                'vendor_id' => $store->owner_id,
                'vendor_name' => $store->owner?->name,
            ] : null,
            'order' => $order ? [
                'id' => $order->id,
                'code' => $order->code(),
                'type' => $order->type,
                'item_name' => $order->item_name,
            ] : null,
            'assignee' => $dispute->assignee ? [
                'id' => $dispute->assignee->id,
                'name' => $dispute->assignee->name,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detail(Dispute $dispute): array
    {
        return array_merge($this->summarise($dispute), [
            'status_reason' => $dispute->status_reason,
            'status_changed_at' => $dispute->status_changed_at?->toIso8601String(),
            'status_changed_by' => $dispute->statusChangedBy?->name,
            'events' => $dispute->adminEvents->map(fn (DisputeAdminEvent $event) => [
                'id' => $event->id,
                'type' => $event->type,
                'body' => $event->body,
                'from_status' => $event->from_status,
                'to_status' => $event->to_status,
                'author' => $event->author?->name,
                'created_at' => $event->created_at?->toIso8601String(),
            ])->all(),
        ]);
    }
}
