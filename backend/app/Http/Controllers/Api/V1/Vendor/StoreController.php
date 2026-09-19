<?php

namespace App\Http\Controllers\Api\V1\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Http\Resources\StoreSummaryResource;
use App\Models\Store;
use App\Support\StoreCompleteness;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreController extends Controller
{
    /** Relations the full profile always needs. */
    private const PROFILE_RELATIONS = [
        'categories', 'hours', 'socials.platform', 'policies.type', 'verifications',
    ];

    /** The vendor's own stores, for the store switcher. */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Store::class);

        $stores = Store::ownedBy($request->user())
            ->orderBy('name')
            ->get();

        return response()->json(['stores' => StoreSummaryResource::collection($stores)]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Store::class);

        $validated = $request->validate($this->rules(null));

        $store = Store::create([
            ...$validated,
            'owner_id' => $request->user()->getKey(),
            'slug' => $validated['slug'] ?? $this->uniqueSlug($validated['name']),
            'status' => Store::STATUS_DRAFT,
        ]);

        return response()->json(
            ['store' => new StoreResource($store->load(self::PROFILE_RELATIONS))],
            201,
        );
    }

    public function show(Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        return response()->json(['store' => new StoreResource($store->load(self::PROFILE_RELATIONS))]);
    }

    public function update(Request $request, Store $store): JsonResponse
    {
        $this->authorize('update', $store);

        $store->update($request->validate($this->rules($store)));

        return response()->json(['store' => new StoreResource($store->load(self::PROFILE_RELATIONS))]);
    }

    public function destroy(Store $store): JsonResponse
    {
        $this->authorize('delete', $store);

        // Soft delete: the row and its content stay recoverable.
        $store->delete();

        return response()->json(['message' => 'Store archived.']);
    }

    /** Broken out so the page can refresh the panel without refetching everything. */
    public function completeness(Store $store): JsonResponse
    {
        $this->authorize('view', $store);

        return response()->json(StoreCompleteness::for($store)->toArray());
    }

    /**
     * @return array<string, mixed>
     */
    private function rules(?Store $store): array
    {
        $creating = $store === null;

        return [
            'name' => [$creating ? 'required' : 'sometimes', 'string', 'max:255'],
            'slug' => [
                'sometimes', 'string', 'max:255', 'lowercase',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('stores', 'slug')->ignore($store?->getKey()),
            ],
            'tagline' => ['sometimes', 'nullable', 'string', 'max:120'],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],

            'public_email' => ['sometimes', 'nullable', 'email:rfc', 'max:255'],
            'public_phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'website' => ['sometimes', 'nullable', 'url', 'max:255'],

            'country' => ['sometimes', 'nullable', 'string', 'size:2'],
            'state' => ['sometimes', 'nullable', 'string', 'max:255'],
            'city' => ['sometimes', 'nullable', 'string', 'max:255'],
            'postal_code' => ['sometimes', 'nullable', 'string', 'max:20'],
            'address_line' => ['sometimes', 'nullable', 'string', 'max:255'],
            'hide_address' => ['sometimes', 'boolean'],
            'service_area' => ['sometimes', 'nullable', 'string', 'max:255'],
            'latitude' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],

            'timezone' => ['sometimes', 'string', 'timezone'],
            'currency' => ['sometimes', 'string', 'size:3'],
            'language' => ['sometimes', 'string', 'max:5'],
            'min_order_amount' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:999999.99'],

            // Vendors may publish or pause; only an admin may suspend, which is
            // why that value is not offered here.
            'status' => ['sometimes', Rule::in([Store::STATUS_DRAFT, Store::STATUS_ACTIVE, Store::STATUS_PAUSED])],
        ];
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'store';
        $slug = $base;
        $suffix = 2;

        while (Store::withTrashed()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
