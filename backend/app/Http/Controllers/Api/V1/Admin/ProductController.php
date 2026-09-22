<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAdminEvent;
use App\Models\Store;
use App\Support\ProductCompleteness;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Catalog administration.
 *
 * A product is a listing on a store. Orders, GMV, commissions, ratings and
 * risk scores are omitted: those domains do not exist yet.
 */
class ProductController extends Controller
{
    /**
     * When set, this screen only sees one listing type (services, for example).
     */
    protected function catalogType(): ?string
    {
        return null;
    }

    protected function collectionKey(): string
    {
        return 'products';
    }

    protected function detailKey(): string
    {
        return 'product';
    }

    protected function ensureListing(Product $product): void
    {
        $type = $this->catalogType();

        abort_unless($type === null || $product->type === $type, 404);
    }

    private const SORTS = [
        'newest' => ['created_at', 'desc'],
        'oldest' => ['created_at', 'asc'],
        'name-asc' => ['name', 'asc'],
        'name-desc' => ['name', 'desc'],
        'price-high' => ['price', 'desc'],
        'price-low' => ['price', 'asc'],
        'stock-low' => ['stock_qty', 'asc'],
        'updated' => ['updated_at', 'desc'],
    ];

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', Rule::in(Product::STATUSES)],
            'type' => ['nullable', Rule::in(Product::TYPES)],
            'inventory' => ['nullable', Rule::in([
                Product::INVENTORY_IN_STOCK,
                Product::INVENTORY_LOW_STOCK,
                Product::INVENTORY_OUT_OF_STOCK,
                Product::INVENTORY_NOT_TRACKED,
            ])],
            'store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'vendor_id' => ['nullable', 'integer', 'exists:users,id'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'delivery_method' => ['nullable', Rule::in(Product::DELIVERY_METHODS)],
            'booking_model' => ['nullable', Rule::in(Product::BOOKING_MODELS)],
            'created_from' => ['nullable', 'date'],
            'created_to' => ['nullable', 'date', 'after_or_equal:created_from'],
            'sort' => ['nullable', Rule::in(array_keys(self::SORTS))],
            'per_page' => ['nullable', 'integer', Rule::in([10, 25, 50, 100])],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        [$column, $direction] = self::SORTS[$filters['sort'] ?? 'newest'];

        $forcedType = $this->catalogType();

        $products = Product::query()
            ->with(['store.owner', 'category'])
            ->when($forcedType, fn ($query, $type) => $query->where('type', $type))
            ->when($filters['search'] ?? null, fn ($query, $term) => $this->applySearch($query, $term))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when(! $forcedType && ($filters['type'] ?? null), fn ($query) => $query->where('type', $filters['type']))
            ->when($filters['store_id'] ?? null, fn ($query, $id) => $query->where('store_id', $id))
            ->when($filters['vendor_id'] ?? null, fn ($query, $id) => $query->whereHas(
                'store',
                fn ($stores) => $stores->where('owner_id', $id),
            ))
            ->when($filters['category_id'] ?? null, fn ($query, $id) => $query->where('category_id', $id))
            ->when($filters['delivery_method'] ?? null, fn ($query, $method) => $query->where('delivery_method', $method))
            ->when($filters['booking_model'] ?? null, fn ($query, $model) => $query->where('booking_model', $model))
            ->when($filters['inventory'] ?? null, fn ($query, $state) => $this->applyInventory($query, $state))
            ->when($filters['created_from'] ?? null, fn ($query, $from) => $query->whereDate('created_at', '>=', $from))
            ->when($filters['created_to'] ?? null, fn ($query, $to) => $query->whereDate('created_at', '<=', $to))
            ->orderBy($column, $direction)
            ->orderBy('id', 'desc')
            ->paginate($filters['per_page'] ?? 25)
            ->withQueryString();

        return response()->json([
            $this->collectionKey() => $products->getCollection()->map(fn (Product $product) => $this->summarise($product))->all(),
            'meta' => [
                'page' => $products->currentPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'last_page' => $products->lastPage(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ],
            'stats' => $this->stats(),
            'statuses' => Product::STATUSES,
            'types' => $forcedType ? [$forcedType] : Product::TYPES,
            'delivery_methods' => Product::DELIVERY_METHODS,
            'booking_models' => Product::BOOKING_MODELS,
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

    public function show(Product $product): JsonResponse
    {
        $this->ensureListing($product);
        $product->load([
            'store.owner',
            'store.verifications',
            'category',
            'adminEvents.author',
            'statusChangedBy',
        ]);

        return response()->json([
            $this->detailKey() => $this->detail($product),
        ]);
    }

    public function updateStatus(Request $request, Product $product): JsonResponse
    {
        $this->ensureListing($product);
        $validated = $request->validate([
            'status' => ['required', Rule::in(Product::STATUSES)],
            'reason' => [
                Rule::requiredIf(fn () => in_array($request->input('status'), Product::STATUSES_NEEDING_REASON, true)),
                'nullable', 'string', 'max:2000',
            ],
        ]);

        $from = $product->status;

        if ($from === $validated['status']) {
            throw ValidationException::withMessages([
                'status' => __('app.products.already_in_status'),
            ]);
        }

        DB::transaction(function () use ($product, $validated, $from, $request): void {
            $next = $validated['status'];

            $product->forceFill([
                'status' => $next,
                'status_reason' => $validated['reason'] ?? null,
                'status_changed_at' => now(),
                'status_changed_by' => $request->user()->id,
                'published_at' => $next === Product::STATUS_PUBLISHED
                    ? ($product->published_at ?? now())
                    : $product->published_at,
            ])->save();

            $product->adminEvents()->create([
                'author_id' => $request->user()->id,
                'type' => ProductAdminEvent::TYPE_STATUS,
                'body' => $validated['reason'] ?? null,
                'from_status' => $from,
                'to_status' => $next,
            ]);
        });

        return $this->show($product->fresh());
    }

    public function storeNote(Request $request, Product $product): JsonResponse
    {
        $this->ensureListing($product);
        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $product->adminEvents()->create([
            'author_id' => $request->user()->id,
            'type' => ProductAdminEvent::TYPE_NOTE,
            'body' => $validated['body'],
        ]);

        return $this->show($product);
    }

    public function events(Request $request): JsonResponse
    {
        $events = ProductAdminEvent::query()
            ->with(['product:id,name,store_id,type', 'product.store:id,name,owner_id', 'product.store.owner:id,name', 'author:id,name'])
            ->when($this->catalogType(), fn ($query, $type) => $query->whereHas(
                'product',
                fn ($products) => $products->where('type', $type),
            ))
            ->latest()
            ->limit((int) $request->integer('limit', 10))
            ->get();

        return response()->json([
            'events' => $events->map(fn (ProductAdminEvent $event) => [
                'id' => $event->id,
                'type' => $event->type,
                'body' => $event->body,
                'from_status' => $event->from_status,
                'to_status' => $event->to_status,
                'product' => $event->product?->name,
                'product_id' => $event->product_id,
                'vendor' => $event->product?->store?->owner?->name,
                'store' => $event->product?->store?->name,
                'author' => $event->author?->name,
                'created_at' => $event->created_at?->toIso8601String(),
            ])->all(),
        ]);
    }

    private function applySearch($query, string $term)
    {
        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';

        return $query->where(function ($query) use ($like, $term): void {
            $query->where('name', 'like', $like)
                ->orWhere('sku', 'like', $like)
                ->orWhere('slug', 'like', $like)
                ->orWhere('brand', 'like', $like)
                ->orWhereHas('store', fn ($stores) => $stores
                    ->where('name', 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhereHas('owner', fn ($owners) => $owners
                        ->where('name', 'like', $like)
                        ->orWhere('email', 'like', $like)))
                ->orWhereHas('category', fn ($categories) => $categories->where('name', 'like', $like));

            if (ctype_digit($term)) {
                $query->orWhere('id', (int) $term);
            }
        });
    }

    private function applyInventory($query, string $state)
    {
        return match ($state) {
            Product::INVENTORY_NOT_TRACKED => $query->where('track_inventory', false),
            Product::INVENTORY_OUT_OF_STOCK => $query
                ->where('track_inventory', true)
                ->where(fn ($query) => $query->whereNull('stock_qty')->orWhere('stock_qty', '<=', 0)),
            Product::INVENTORY_LOW_STOCK => $query
                ->where('track_inventory', true)
                ->where('stock_qty', '>', 0)
                ->whereColumn('stock_qty', '<=', DB::raw('coalesce(low_stock_threshold, 10)')),
            Product::INVENTORY_IN_STOCK => $query
                ->where('track_inventory', true)
                ->where('stock_qty', '>', 0)
                ->whereColumn('stock_qty', '>', DB::raw('coalesce(low_stock_threshold, 10)')),
            default => $query,
        };
    }

    /**
     * @return array<string, int>
     */
    private function stats(): array
    {
        $base = Product::query()->when($this->catalogType(), fn ($query, $type) => $query->where('type', $type));

        $counts = (clone $base)
            ->selectRaw('count(*) as total')
            ->selectRaw('sum(case when created_at >= ? then 1 else 0 end) as new_this_month', [now()->startOfMonth()])
            ->first();

        $byStatus = (clone $base)
            ->groupBy('status')
            ->selectRaw('status, count(*) as total')
            ->pluck('total', 'status');

        $outOfStock = (clone $base)
            ->where('track_inventory', true)
            ->where(fn ($query) => $query->whereNull('stock_qty')->orWhere('stock_qty', '<=', 0))
            ->count();

        $lowStock = (clone $base)
            ->where('track_inventory', true)
            ->where('stock_qty', '>', 0)
            ->whereColumn('stock_qty', '<=', DB::raw('coalesce(low_stock_threshold, 10)'))
            ->count();

        $stats = [
            'total' => (int) $counts->total,
            'new_this_month' => (int) $counts->new_this_month,
            'out_of_stock' => $outOfStock,
            'low_stock' => $lowStock,
        ];

        foreach (Product::STATUSES as $status) {
            $stats[$status] = (int) ($byStatus[$status] ?? 0);
        }

        return $stats;
    }

    /**
     * @return array<string, mixed>
     */
    private function summarise(Product $product): array
    {
        $store = $product->store;

        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'type' => $product->type,
            'status' => $product->status,
            'brand' => $product->brand,
            'tagline' => $product->tagline,
            'price' => $product->price !== null ? (float) $product->price : null,
            'compare_at_price' => $product->compare_at_price !== null ? (float) $product->compare_at_price : null,
            'currency' => $product->currency,
            'track_inventory' => (bool) $product->track_inventory,
            'stock_qty' => $product->stock_qty,
            'inventory' => $product->inventoryState(),
            'country' => $product->country,
            'created_at' => $product->created_at?->toIso8601String(),
            'updated_at' => $product->updated_at?->toIso8601String(),
            'published_at' => $product->published_at?->toIso8601String(),
            'duration_minutes' => $product->duration_minutes,
            'delivery_method' => $product->delivery_method,
            'booking_model' => $product->booking_model,
            'service_area' => $store?->service_area,
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ] : null,
            'store' => $store ? [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'status' => $store->status,
                'logo_url' => $store->logoUrl(),
                'vendor_id' => $store->owner_id,
                'vendor_name' => $store->owner?->name,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detail(Product $product): array
    {
        return array_merge($this->summarise($product), [
            'description' => $product->description,
            'low_stock_threshold' => $product->low_stock_threshold,
            'status_reason' => $product->status_reason,
            'status_changed_at' => $product->status_changed_at?->toIso8601String(),
            'status_changed_by' => $product->statusChangedBy?->name,
            'completeness' => ProductCompleteness::for($product)->toArray(),
            'events' => $product->adminEvents->map(fn (ProductAdminEvent $event) => [
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
