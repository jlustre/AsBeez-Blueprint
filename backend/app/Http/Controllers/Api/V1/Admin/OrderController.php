<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderAdminEvent;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Orders and bookings administration.
 *
 * Checkout, payments, fulfillment, calendars, refunds and disputes are not
 * here. This screen lists commercial commitments that already exist — today
 * that set is empty until those engines write rows.
 */
class OrderController extends Controller
{
    private const SORTS = [
        'newest' => ['created_at', 'desc'],
        'oldest' => ['created_at', 'asc'],
        'amount-high' => ['total', 'desc'],
        'amount-low' => ['total', 'asc'],
        'updated' => ['updated_at', 'desc'],
    ];

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'type' => ['nullable', Rule::in(Order::TYPES)],
            'status' => ['nullable', Rule::in(Order::STATUSES)],
            'payment_status' => ['nullable', Rule::in(Order::PAYMENT_STATUSES)],
            'fulfillment_status' => ['nullable', Rule::in(Order::FULFILLMENT_STATUSES)],
            'appointment_status' => ['nullable', Rule::in(Order::APPOINTMENT_STATUSES)],
            'store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
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

        $orders = Order::query()
            ->with(['customer', 'store.owner', 'product.category'])
            ->when($filters['search'] ?? null, fn ($query, $term) => $this->applySearch($query, $term))
            ->when($filters['type'] ?? null, fn ($query, $type) => $query->where('type', $type))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['payment_status'] ?? null, fn ($query, $status) => $query->where('payment_status', $status))
            ->when($filters['fulfillment_status'] ?? null, fn ($query, $status) => $query->where('fulfillment_status', $status))
            ->when($filters['appointment_status'] ?? null, fn ($query, $status) => $query->where('appointment_status', $status))
            ->when($filters['store_id'] ?? null, fn ($query, $id) => $query->where('store_id', $id))
            ->when($filters['category_id'] ?? null, fn ($query, $id) => $query->whereHas(
                'product',
                fn ($products) => $products->where('category_id', $id),
            ))
            ->when($request->boolean('attention'), fn ($query) => $query->where(function ($query): void {
                $query->where('status', Order::STATUS_ON_HOLD)
                    ->orWhere('payment_status', Order::PAYMENT_FAILED);
            }))
            ->when($filters['created_from'] ?? null, fn ($query, $from) => $query->whereDate('created_at', '>=', $from))
            ->when($filters['created_to'] ?? null, fn ($query, $to) => $query->whereDate('created_at', '<=', $to))
            ->when($filters['min_amount'] ?? null, fn ($query, $min) => $query->where('total', '>=', $min))
            ->when($filters['max_amount'] ?? null, fn ($query, $max) => $query->where('total', '<=', $max))
            ->orderBy($column, $direction)
            ->orderBy('id', 'desc')
            ->paginate($filters['per_page'] ?? 25)
            ->withQueryString();

        return response()->json([
            'orders' => $orders->getCollection()->map(fn (Order $order) => $this->summarise($order))->all(),
            'meta' => [
                'page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'last_page' => $orders->lastPage(),
                'from' => $orders->firstItem(),
                'to' => $orders->lastItem(),
            ],
            'stats' => $this->stats(),
            'types' => Order::TYPES,
            'statuses' => Order::STATUSES,
            'payment_statuses' => Order::PAYMENT_STATUSES,
            'fulfillment_statuses' => Order::FULFILLMENT_STATUSES,
            'appointment_statuses' => Order::APPOINTMENT_STATUSES,
            'categories' => Category::query()->orderBy('name')->get(['id', 'name', 'slug']),
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

    public function show(Order $order): JsonResponse
    {
        $order->load(['customer', 'store.owner', 'product.category', 'adminEvents.author', 'statusChangedBy']);

        return response()->json([
            'order' => $this->detail($order),
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(Order::STATUSES)],
            'reason' => [
                Rule::requiredIf(fn () => in_array($request->input('status'), Order::STATUSES_NEEDING_REASON, true)),
                'nullable', 'string', 'max:2000',
            ],
        ]);

        $from = $order->status;

        if ($from === $validated['status']) {
            throw ValidationException::withMessages([
                'status' => __('app.orders.already_in_status'),
            ]);
        }

        DB::transaction(function () use ($order, $validated, $from, $request): void {
            $order->forceFill([
                'status' => $validated['status'],
                'status_reason' => $validated['reason'] ?? null,
                'status_changed_at' => now(),
                'status_changed_by' => $request->user()->id,
            ])->save();

            $order->adminEvents()->create([
                'author_id' => $request->user()->id,
                'type' => OrderAdminEvent::TYPE_STATUS,
                'body' => $validated['reason'] ?? null,
                'from_status' => $from,
                'to_status' => $validated['status'],
            ]);
        });

        return $this->show($order->fresh());
    }

    public function storeNote(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $order->adminEvents()->create([
            'author_id' => $request->user()->id,
            'type' => OrderAdminEvent::TYPE_NOTE,
            'body' => $validated['body'],
        ]);

        return $this->show($order);
    }

    public function events(Request $request): JsonResponse
    {
        $events = OrderAdminEvent::query()
            ->with([
                'order:id,type,item_name,store_id,customer_id',
                'order.store:id,name,owner_id',
                'order.store.owner:id,name',
                'order.customer:id,name',
                'author:id,name',
            ])
            ->latest()
            ->limit((int) $request->integer('limit', 10))
            ->get();

        return response()->json([
            'events' => $events->map(fn (OrderAdminEvent $event) => [
                'id' => $event->id,
                'type' => $event->type,
                'body' => $event->body,
                'from_status' => $event->from_status,
                'to_status' => $event->to_status,
                'order' => $event->order?->code(),
                'order_id' => $event->order_id,
                'item' => $event->order?->item_name,
                'customer' => $event->order?->customer?->name,
                'vendor' => $event->order?->store?->owner?->name,
                'store' => $event->order?->store?->name,
                'author' => $event->author?->name,
                'created_at' => $event->created_at?->toIso8601String(),
            ])->all(),
        ]);
    }

    private function applySearch($query, string $term)
    {
        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';

        return $query->where(function ($query) use ($like, $term): void {
            $query->where('item_name', 'like', $like)
                ->orWhereHas('customer', fn ($customers) => $customers
                    ->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like))
                ->orWhereHas('store', fn ($stores) => $stores
                    ->where('name', 'like', $like)
                    ->orWhereHas('owner', fn ($owners) => $owners
                        ->where('name', 'like', $like)
                        ->orWhere('email', 'like', $like)));

            if (preg_match('/^(ASB|BKG)-?(\d+)$/i', trim($term), $matches)) {
                $query->orWhere('id', (int) $matches[2]);
            } elseif (ctype_digit($term)) {
                $query->orWhere('id', (int) $term);
            }
        });
    }

    /**
     * @return array<string, int>
     */
    private function stats(): array
    {
        $counts = Order::query()
            ->selectRaw('count(*) as total')
            ->selectRaw('sum(case when type = ? then 1 else 0 end) as product_orders', [Order::TYPE_PRODUCT])
            ->selectRaw('sum(case when type = ? then 1 else 0 end) as service_bookings', [Order::TYPE_BOOKING])
            ->selectRaw('sum(case when created_at >= ? then 1 else 0 end) as new_this_month', [now()->startOfMonth()])
            ->selectRaw('sum(case when status = ? or payment_status = ? then 1 else 0 end) as attention', [
                Order::STATUS_ON_HOLD,
                Order::PAYMENT_FAILED,
            ])
            ->selectRaw('sum(case when payment_status = ? then 1 else 0 end) as payment_failed', [Order::PAYMENT_FAILED])
            ->selectRaw('sum(case when type = ? and scheduled_at is not null and scheduled_at >= ? and status not in (?, ?) then 1 else 0 end) as upcoming', [
                Order::TYPE_BOOKING,
                now(),
                Order::STATUS_CANCELLED,
                Order::STATUS_COMPLETED,
            ])
            ->first();

        $byStatus = Order::query()
            ->groupBy('status')
            ->selectRaw('status, count(*) as total')
            ->pluck('total', 'status');

        $stats = [
            'total' => (int) $counts->total,
            'product_orders' => (int) $counts->product_orders,
            'service_bookings' => (int) $counts->service_bookings,
            'new_this_month' => (int) $counts->new_this_month,
            'attention' => (int) $counts->attention,
            'payment_failed' => (int) $counts->payment_failed,
            'upcoming' => (int) $counts->upcoming,
        ];

        foreach (Order::STATUSES as $status) {
            $stats[$status] = (int) ($byStatus[$status] ?? 0);
        }

        return $stats;
    }

    /**
     * @return array<string, mixed>
     */
    private function summarise(Order $order): array
    {
        $customer = $order->customer;
        $store = $order->store;

        return [
            'id' => $order->id,
            'code' => $order->code(),
            'type' => $order->type,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'fulfillment_status' => $order->fulfillment_status,
            'appointment_status' => $order->appointment_status,
            'item_name' => $order->item_name,
            'item_count' => $order->item_count,
            'total' => $order->total !== null ? (float) $order->total : null,
            'currency' => $order->currency,
            'scheduled_at' => $order->scheduled_at?->toIso8601String(),
            'needs_attention' => $order->needsAttention(),
            'created_at' => $order->created_at?->toIso8601String(),
            'updated_at' => $order->updated_at?->toIso8601String(),
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
            'listing' => $order->product ? [
                'id' => $order->product->id,
                'name' => $order->product->name,
                'type' => $order->product->type,
                'category' => $order->product->category?->name,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detail(Order $order): array
    {
        return array_merge($this->summarise($order), [
            'status_reason' => $order->status_reason,
            'status_changed_at' => $order->status_changed_at?->toIso8601String(),
            'status_changed_by' => $order->statusChangedBy?->name,
            'events' => $order->adminEvents->map(fn (OrderAdminEvent $event) => [
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
