<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\MemberAdminEvent;
use App\Models\Store;
use App\Models\StoreVerification;
use App\Models\User;
use App\Support\StoreCompleteness;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Vendor administration.
 *
 * Scoped to accounts whose role is `vendor`. A vendor is the person; their
 * stores are listed underneath. Orders, GMV, commissions, ratings and risk
 * scores are omitted: those domains do not exist yet.
 */
class VendorController extends Controller
{
    private const SORTS = [
        'newest' => ['created_at', 'desc'],
        'oldest' => ['created_at', 'asc'],
        'name-asc' => ['name', 'asc'],
        'name-desc' => ['name', 'desc'],
        'recently-active' => ['last_active_at', 'desc'],
    ];

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', Rule::in(User::STATUSES)],
            'store_status' => ['nullable', Rule::in([
                Store::STATUS_DRAFT, Store::STATUS_ACTIVE, Store::STATUS_PAUSED, Store::STATUS_SUSPENDED,
            ])],
            'verification' => ['nullable', Rule::in(['verified', 'pending', 'unverified'])],
            'registered_from' => ['nullable', 'date'],
            'registered_to' => ['nullable', 'date', 'after_or_equal:registered_from'],
            'sort' => ['nullable', Rule::in(array_keys(self::SORTS))],
            'per_page' => ['nullable', 'integer', Rule::in([10, 25, 50, 100])],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        [$column, $direction] = self::SORTS[$filters['sort'] ?? 'newest'];

        $vendors = $this->baseQuery()
            ->with(['profile', 'stores.categories', 'stores.verifications'])
            ->when($filters['search'] ?? null, fn ($query, $term) => $this->applySearch($query, $term))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['store_status'] ?? null, fn ($query, $status) => $query->whereHas(
                'stores',
                fn ($stores) => $stores->where('status', $status),
            ))
            ->when(($filters['verification'] ?? null) === 'verified', fn ($query) => $query->whereHas(
                'stores',
                fn ($stores) => $stores->whereNotNull('verified_at'),
            ))
            ->when(($filters['verification'] ?? null) === 'pending', fn ($query) => $query->whereHas(
                'stores.verifications',
                fn ($verifications) => $verifications->where('status', StoreVerification::STATUS_PENDING),
            ))
            ->when(($filters['verification'] ?? null) === 'unverified', fn ($query) => $query
                ->whereDoesntHave('stores', fn ($stores) => $stores->whereNotNull('verified_at'))
                ->whereDoesntHave('stores.verifications', fn ($verifications) => $verifications->where('status', StoreVerification::STATUS_PENDING)))
            ->when($filters['registered_from'] ?? null, fn ($query, $from) => $query->whereDate('created_at', '>=', $from))
            ->when($filters['registered_to'] ?? null, fn ($query, $to) => $query->whereDate('created_at', '<=', $to))
            ->orderBy($column, $direction)
            ->orderBy('id', 'desc')
            ->paginate($filters['per_page'] ?? 25)
            ->withQueryString();

        return response()->json([
            'vendors' => $vendors->getCollection()->map(fn (User $vendor) => $this->summarise($vendor))->all(),
            'meta' => [
                'page' => $vendors->currentPage(),
                'per_page' => $vendors->perPage(),
                'total' => $vendors->total(),
                'last_page' => $vendors->lastPage(),
                'from' => $vendors->firstItem(),
                'to' => $vendors->lastItem(),
            ],
            'stats' => $this->stats(),
            'statuses' => User::STATUSES,
            'store_statuses' => [Store::STATUS_DRAFT, Store::STATUS_ACTIVE, Store::STATUS_PAUSED, Store::STATUS_SUSPENDED],
        ]);
    }

    public function show(User $vendor): JsonResponse
    {
        $this->ensureVendor($vendor);
        $vendor->load([
            'profile',
            'adminEvents.author',
            'statusChangedBy',
            'stores.categories',
            'stores.verifications',
            'stores.policies',
        ]);

        return response()->json([
            'vendor' => $this->detail($vendor),
        ]);
    }

    public function updateStatus(Request $request, User $vendor): JsonResponse
    {
        $this->ensureVendor($vendor);

        if ($vendor->is($request->user())) {
            throw ValidationException::withMessages([
                'status' => __('app.vendors.cannot_change_own_status'),
            ]);
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(User::STATUSES)],
            'reason' => [
                Rule::requiredIf(fn () => in_array($request->input('status'), User::STATUSES_NEEDING_REASON, true)),
                'nullable', 'string', 'max:2000',
            ],
        ]);

        $from = $vendor->status;

        if ($from === $validated['status']) {
            throw ValidationException::withMessages([
                'status' => __('app.vendors.already_in_status'),
            ]);
        }

        DB::transaction(function () use ($vendor, $validated, $from, $request): void {
            $vendor->forceFill([
                'status' => $validated['status'],
                'status_reason' => $validated['reason'] ?? null,
                'status_changed_at' => now(),
                'status_changed_by' => $request->user()->id,
            ])->save();

            $vendor->adminEvents()->create([
                'author_id' => $request->user()->id,
                'type' => MemberAdminEvent::TYPE_STATUS,
                'body' => $validated['reason'] ?? null,
                'from_status' => $from,
                'to_status' => $validated['status'],
            ]);
        });

        return $this->show($vendor->fresh());
    }

    public function storeNote(Request $request, User $vendor): JsonResponse
    {
        $this->ensureVendor($vendor);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $vendor->adminEvents()->create([
            'author_id' => $request->user()->id,
            'type' => MemberAdminEvent::TYPE_NOTE,
            'body' => $validated['body'],
        ]);

        return $this->show($vendor);
    }

    public function updateStoreStatus(Request $request, User $vendor, Store $store): JsonResponse
    {
        $this->ensureVendor($vendor);
        abort_unless($store->owner_id === $vendor->id, 404);

        $validated = $request->validate([
            'status' => ['required', Rule::in([
                Store::STATUS_DRAFT, Store::STATUS_ACTIVE, Store::STATUS_PAUSED, Store::STATUS_SUSPENDED,
            ])],
        ]);

        $store->forceFill(['status' => $validated['status']])->save();

        return $this->show($vendor->fresh());
    }

    public function events(Request $request): JsonResponse
    {
        $events = MemberAdminEvent::query()
            ->with(['user:id,name', 'author:id,name'])
            ->whereHas('user', fn ($query) => $query->where('role', User::ROLE_VENDOR))
            ->latest()
            ->limit((int) $request->integer('limit', 10))
            ->get();

        return response()->json([
            'events' => $events->map(fn (MemberAdminEvent $event) => [
                'id' => $event->id,
                'type' => $event->type,
                'body' => $event->body,
                'from_status' => $event->from_status,
                'to_status' => $event->to_status,
                'vendor' => $event->user?->name,
                'vendor_id' => $event->user_id,
                'author' => $event->author?->name,
                'created_at' => $event->created_at?->toIso8601String(),
            ])->all(),
        ]);
    }

    /* ------------------------------------------------------------------ */

    private function baseQuery()
    {
        return User::query()->where('role', User::ROLE_VENDOR);
    }

    private function applySearch($query, string $term)
    {
        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';

        return $query->where(function ($query) use ($like, $term): void {
            $query->where('name', 'like', $like)
                ->orWhere('email', 'like', $like)
                ->orWhereHas('profile', fn ($profile) => $profile
                    ->where('username', 'like', $like)
                    ->orWhere('phone', 'like', $like))
                ->orWhereHas('stores', fn ($stores) => $stores
                    ->where('name', 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhere('public_email', 'like', $like)
                    ->orWhere('public_phone', 'like', $like));

            if (ctype_digit($term)) {
                $query->orWhere('id', (int) $term);
            }
        });
    }

    /**
     * @return array<string, int>
     */
    private function stats(): array
    {
        $counts = $this->baseQuery()
            ->selectRaw('count(*) as total')
            ->selectRaw('sum(case when email_verified_at is not null then 1 else 0 end) as verified')
            ->selectRaw('sum(case when created_at >= ? then 1 else 0 end) as new_this_month', [now()->startOfMonth()])
            ->first();

        $byStatus = $this->baseQuery()
            ->groupBy('status')
            ->selectRaw('status, count(*) as total')
            ->pluck('total', 'status');

        $pendingVerification = $this->baseQuery()
            ->whereHas('stores.verifications', fn ($query) => $query->where('status', StoreVerification::STATUS_PENDING))
            ->count();

        $storeVerified = $this->baseQuery()
            ->whereHas('stores', fn ($query) => $query->whereNotNull('verified_at'))
            ->count();

        $storesActive = Store::query()
            ->whereHas('owner', fn ($query) => $query->where('role', User::ROLE_VENDOR))
            ->where('status', Store::STATUS_ACTIVE)
            ->count();

        $stats = [
            'total' => (int) $counts->total,
            'verified' => (int) $counts->verified,
            'unverified' => (int) $counts->total - (int) $counts->verified,
            'new_this_month' => (int) $counts->new_this_month,
            'pending_verification' => $pendingVerification,
            'store_verified' => $storeVerified,
            'stores_active' => $storesActive,
        ];

        foreach (User::STATUSES as $status) {
            $stats[$status] = (int) ($byStatus[$status] ?? 0);
        }

        return $stats;
    }

    /**
     * @return array<string, mixed>
     */
    private function summarise(User $vendor): array
    {
        $profile = $vendor->profile;
        $stores = $vendor->stores;

        return [
            'id' => $vendor->id,
            'name' => $vendor->name,
            'email' => $vendor->email,
            'username' => $profile?->username,
            'phone' => $profile?->phone,
            'avatar_url' => $profile?->avatarUrl(),
            'initials' => $profile?->initials() ?? mb_strtoupper(mb_substr($vendor->name, 0, 1)),
            'status' => $vendor->status,
            'email_verified_at' => $vendor->email_verified_at?->toIso8601String(),
            'joined_at' => $vendor->created_at?->toIso8601String(),
            'last_active_at' => $vendor->last_active_at?->toIso8601String(),
            'status_changed_at' => $vendor->status_changed_at?->toIso8601String(),
            'store_count' => $stores->count(),
            'verification' => $this->verificationState($stores),
            'stores' => $stores->map(fn (Store $store) => $this->summariseStore($store, false))->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detail(User $vendor): array
    {
        return array_merge($this->summarise($vendor), [
            'status_reason' => $vendor->status_reason,
            'status_changed_by' => $vendor->statusChangedBy?->name,
            'stores' => $vendor->stores->map(fn (Store $store) => $this->summariseStore($store, true))->values()->all(),
            'events' => $vendor->adminEvents->map(fn (MemberAdminEvent $event) => [
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

    /**
     * @return array<string, mixed>
     */
    private function summariseStore(Store $store, bool $detailed): array
    {
        $verifications = $store->verifications;
        $summary = [
            'id' => $store->id,
            'name' => $store->name,
            'slug' => $store->slug,
            'status' => $store->status,
            'tagline' => $store->tagline,
            'logo_url' => $store->logoUrl(),
            'city' => $store->city,
            'state' => $store->state,
            'country' => $store->country,
            'service_area' => $store->service_area,
            'public_email' => $store->public_email,
            'public_phone' => $store->public_phone,
            'website' => $store->website,
            'verified_at' => $store->verified_at?->toIso8601String(),
            'categories' => $store->categories->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ])->values()->all(),
            'verification' => [
                'verified' => $verifications->where('status', StoreVerification::STATUS_VERIFIED)->count(),
                'pending' => $verifications->where('status', StoreVerification::STATUS_PENDING)->count(),
                'rejected' => $verifications->where('status', StoreVerification::STATUS_REJECTED)->count(),
            ],
        ];

        if (! $detailed) {
            return $summary;
        }

        return $summary + [
            'completeness' => StoreCompleteness::for($store)->toArray(),
            'verifications' => $verifications->map(fn (StoreVerification $row) => [
                'kind' => $row->kind,
                'status' => $row->status,
                'reference' => $row->reference,
                'verified_at' => $row->verified_at?->toIso8601String(),
            ])->values()->all(),
        ];
    }

    private function verificationState($stores): string
    {
        if ($stores->contains(fn (Store $store) => $store->verified_at !== null)) {
            return 'verified';
        }

        if ($stores->contains(fn (Store $store) => $store->verifications
            ->contains(fn (StoreVerification $row) => $row->status === StoreVerification::STATUS_PENDING))) {
            return 'pending';
        }

        return 'unverified';
    }

    private function ensureVendor(User $vendor): void
    {
        abort_unless($vendor->role === User::ROLE_VENDOR, 404);
    }
}
