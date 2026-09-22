<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\FinancialEntry;
use App\Models\FinancialEntryAdminEvent;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Financial administration.
 *
 * Payments, payouts, processors, taxes, GL posting and reconciliation are
 * not here. This screen lists recorded movements that already exist — today
 * that set is empty until those engines write rows.
 */
class FinancialController extends Controller
{
    private const SORTS = [
        'newest' => ['created_at', 'desc'],
        'oldest' => ['created_at', 'asc'],
        'amount-high' => ['amount', 'desc'],
        'amount-low' => ['amount', 'asc'],
        'updated' => ['updated_at', 'desc'],
    ];

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'type' => ['nullable', Rule::in(FinancialEntry::TYPES)],
            'status' => ['nullable', Rule::in(FinancialEntry::STATUSES)],
            'direction' => ['nullable', Rule::in(FinancialEntry::DIRECTIONS)],
            'store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'attention' => ['nullable', 'boolean'],
            'created_from' => ['nullable', 'date'],
            'created_to' => ['nullable', 'date', 'after_or_equal:created_from'],
            'min_amount' => ['nullable', 'numeric', 'min:0'],
            'max_amount' => ['nullable', 'numeric', 'min:0'],
            'sort' => ['nullable', Rule::in(array_keys(self::SORTS))],
            'per_page' => ['nullable', 'integer', Rule::in([10, 25, 50, 100])],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        [$column, $direction] = self::SORTS[$filters['sort'] ?? 'newest'];

        $entries = FinancialEntry::query()
            ->with(['customer', 'store.owner', 'order'])
            ->when($filters['search'] ?? null, fn ($query, $term) => $this->applySearch($query, $term))
            ->when($filters['type'] ?? null, fn ($query, $type) => $query->where('type', $type))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['direction'] ?? null, fn ($query, $flow) => $query->where('direction', $flow))
            ->when($filters['store_id'] ?? null, fn ($query, $id) => $query->where('store_id', $id))
            ->when($request->boolean('attention'), fn ($query) => $query->whereIn('status', [
                FinancialEntry::STATUS_FAILED,
                FinancialEntry::STATUS_ON_HOLD,
            ]))
            ->when($filters['created_from'] ?? null, fn ($query, $from) => $query->whereDate('created_at', '>=', $from))
            ->when($filters['created_to'] ?? null, fn ($query, $to) => $query->whereDate('created_at', '<=', $to))
            ->when($filters['min_amount'] ?? null, fn ($query, $min) => $query->where('amount', '>=', $min))
            ->when($filters['max_amount'] ?? null, fn ($query, $max) => $query->where('amount', '<=', $max))
            ->orderBy($column, $direction)
            ->orderBy('id', 'desc')
            ->paginate($filters['per_page'] ?? 25)
            ->withQueryString();

        return response()->json([
            'entries' => $entries->getCollection()->map(fn (FinancialEntry $entry) => $this->summarise($entry))->all(),
            'meta' => [
                'page' => $entries->currentPage(),
                'per_page' => $entries->perPage(),
                'total' => $entries->total(),
                'last_page' => $entries->lastPage(),
                'from' => $entries->firstItem(),
                'to' => $entries->lastItem(),
            ],
            'stats' => $this->stats(),
            'types' => FinancialEntry::TYPES,
            'statuses' => FinancialEntry::STATUSES,
            'directions' => FinancialEntry::DIRECTIONS,
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

    public function show(FinancialEntry $entry): JsonResponse
    {
        $entry->load(['customer', 'store.owner', 'order', 'adminEvents.author', 'statusChangedBy']);

        return response()->json([
            'entry' => $this->detail($entry),
        ]);
    }

    public function updateStatus(Request $request, FinancialEntry $entry): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(FinancialEntry::STATUSES)],
            'reason' => [
                Rule::requiredIf(fn () => in_array($request->input('status'), FinancialEntry::STATUSES_NEEDING_REASON, true)),
                'nullable', 'string', 'max:2000',
            ],
        ]);

        $from = $entry->status;

        if ($from === $validated['status']) {
            throw ValidationException::withMessages([
                'status' => __('app.financials.already_in_status'),
            ]);
        }

        DB::transaction(function () use ($entry, $validated, $from, $request): void {
            $entry->forceFill([
                'status' => $validated['status'],
                'status_reason' => $validated['reason'] ?? null,
                'status_changed_at' => now(),
                'status_changed_by' => $request->user()->id,
            ])->save();

            $entry->adminEvents()->create([
                'author_id' => $request->user()->id,
                'type' => FinancialEntryAdminEvent::TYPE_STATUS,
                'body' => $validated['reason'] ?? null,
                'from_status' => $from,
                'to_status' => $validated['status'],
            ]);
        });

        return $this->show($entry->fresh());
    }

    public function storeNote(Request $request, FinancialEntry $entry): JsonResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $entry->adminEvents()->create([
            'author_id' => $request->user()->id,
            'type' => FinancialEntryAdminEvent::TYPE_NOTE,
            'body' => $validated['body'],
        ]);

        return $this->show($entry);
    }

    public function events(Request $request): JsonResponse
    {
        $events = FinancialEntryAdminEvent::query()
            ->with([
                'entry:id,type,subject,store_id,customer_id',
                'entry.store:id,name,owner_id',
                'entry.store.owner:id,name',
                'entry.customer:id,name',
                'author:id,name',
            ])
            ->latest()
            ->limit((int) $request->integer('limit', 10))
            ->get();

        return response()->json([
            'events' => $events->map(fn (FinancialEntryAdminEvent $event) => [
                'id' => $event->id,
                'type' => $event->type,
                'body' => $event->body,
                'from_status' => $event->from_status,
                'to_status' => $event->to_status,
                'entry' => $event->entry?->code(),
                'entry_id' => $event->financial_entry_id,
                'subject' => $event->entry?->subject,
                'vendor' => $event->entry?->store?->owner?->name,
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

            if (preg_match('/^(TXN|PAY|RF|COM|FEE|TAX|CB|ADJ|FIN)-?(\d+)$/i', trim($term), $matches)) {
                $query->orWhere('id', (int) $matches[2]);
            } elseif (preg_match('/^(ASB|BKG)-?(\d+)$/i', trim($term), $matches)) {
                $query->orWhere('order_id', (int) $matches[2]);
            } elseif (ctype_digit($term)) {
                $query->orWhere('id', (int) $term);
            }
        });
    }

    /**
     * @return array<string, int|float>
     */
    private function stats(): array
    {
        $counts = FinancialEntry::query()
            ->selectRaw('count(*) as total')
            ->selectRaw('sum(case when created_at >= ? then 1 else 0 end) as new_this_month', [now()->startOfMonth()])
            ->selectRaw('sum(case when status in (?, ?) then 1 else 0 end) as attention', [
                FinancialEntry::STATUS_FAILED,
                FinancialEntry::STATUS_ON_HOLD,
            ])
            ->first();

        $byType = FinancialEntry::query()
            ->groupBy('type')
            ->selectRaw('type, count(*) as total, coalesce(sum(amount), 0) as amount')
            ->get()
            ->keyBy('type');

        $byStatus = FinancialEntry::query()
            ->groupBy('status')
            ->selectRaw('status, count(*) as total')
            ->pluck('total', 'status');

        $flows = FinancialEntry::query()
            ->where('status', FinancialEntry::STATUS_POSTED)
            ->selectRaw('coalesce(sum(case when direction = ? then amount else 0 end), 0) as inflow', [FinancialEntry::DIRECTION_IN])
            ->selectRaw('coalesce(sum(case when direction = ? then amount else 0 end), 0) as outflow', [FinancialEntry::DIRECTION_OUT])
            ->first();

        $stats = [
            'total' => (int) $counts->total,
            'new_this_month' => (int) $counts->new_this_month,
            'attention' => (int) $counts->attention,
            'inflow_total' => (float) $flows->inflow,
            'outflow_total' => (float) $flows->outflow,
            'net_total' => (float) $flows->inflow - (float) $flows->outflow,
        ];

        foreach (FinancialEntry::TYPES as $type) {
            $row = $byType->get($type);
            $stats[$type] = (int) ($row->total ?? 0);
            $stats[$type.'_amount'] = (float) ($row->amount ?? 0);
        }

        foreach (FinancialEntry::STATUSES as $status) {
            $stats[$status] = (int) ($byStatus[$status] ?? 0);
        }

        return $stats;
    }

    /**
     * @return array<string, mixed>
     */
    private function summarise(FinancialEntry $entry): array
    {
        $customer = $entry->customer;
        $store = $entry->store;
        $order = $entry->order;

        return [
            'id' => $entry->id,
            'code' => $entry->code(),
            'type' => $entry->type,
            'direction' => $entry->direction,
            'status' => $entry->status,
            'subject' => $entry->subject,
            'amount' => (float) $entry->amount,
            'signed_amount' => $entry->signedAmount(),
            'currency' => $entry->currency,
            'needs_attention' => $entry->needsAttention(),
            'created_at' => $entry->created_at?->toIso8601String(),
            'updated_at' => $entry->updated_at?->toIso8601String(),
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
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detail(FinancialEntry $entry): array
    {
        return array_merge($this->summarise($entry), [
            'status_reason' => $entry->status_reason,
            'status_changed_at' => $entry->status_changed_at?->toIso8601String(),
            'status_changed_by' => $entry->statusChangedBy?->name,
            'events' => $entry->adminEvents->map(fn (FinancialEntryAdminEvent $event) => [
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
