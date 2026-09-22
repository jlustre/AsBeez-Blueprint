<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CommissionRule;
use App\Models\CommissionRuleAdminEvent;
use App\Models\CommissionSetting;
use App\Models\FinancialEntry;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Commission administration.
 *
 * Rules and marketplace defaults are stored here. Calculated earnings,
 * payouts, settlements, refunds and GMV are not — those engines do not
 * exist yet. Recorded commission movements come from financial entries
 * of type commission, which stay empty until something writes them.
 */
class CommissionController extends Controller
{
    private const SORTS = [
        'priority' => ['priority', 'asc'],
        'name-asc' => ['name', 'asc'],
        'name-desc' => ['name', 'desc'],
        'newest' => ['created_at', 'desc'],
        'oldest' => ['created_at', 'asc'],
        'updated' => ['updated_at', 'desc'],
        'rate-high' => ['percentage_rate', 'desc'],
        'rate-low' => ['percentage_rate', 'asc'],
    ];

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', Rule::in(CommissionRule::EFFECTIVE_STATUSES)],
            'calculation_type' => ['nullable', Rule::in(CommissionRule::CALCULATION_TYPES)],
            'applies_to' => ['nullable', Rule::in(CommissionRule::APPLIES_TO)],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'attention' => ['nullable', 'boolean'],
            'sort' => ['nullable', Rule::in(array_keys(self::SORTS))],
            'per_page' => ['nullable', 'integer', Rule::in([10, 25, 50, 100])],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        [$column, $direction] = self::SORTS[$filters['sort'] ?? 'priority'];

        $rules = $this->filtered($request)
            ->with(['category', 'store.owner'])
            ->orderBy($column, $direction)
            ->orderBy('id')
            ->paginate($filters['per_page'] ?? 25)
            ->withQueryString();

        $entries = FinancialEntry::query()
            ->with(['customer', 'store.owner', 'order'])
            ->where('type', FinancialEntry::TYPE_COMMISSION)
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'rules' => $rules->getCollection()->map(fn (CommissionRule $rule) => $this->summarise($rule))->all(),
            'meta' => [
                'page' => $rules->currentPage(),
                'per_page' => $rules->perPage(),
                'total' => $rules->total(),
                'last_page' => $rules->lastPage(),
                'from' => $rules->firstItem(),
                'to' => $rules->lastItem(),
            ],
            'stats' => $this->stats(),
            'settings' => $this->settingsPayload(CommissionSetting::current()),
            'entries' => $entries->map(fn (FinancialEntry $entry) => $this->entrySummary($entry))->all(),
            'statuses' => CommissionRule::EFFECTIVE_STATUSES,
            'calculation_types' => CommissionRule::CALCULATION_TYPES,
            'applies_to' => CommissionRule::APPLIES_TO,
            'categories' => Category::query()
                ->orderBy('position')
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'parent_id'])
                ->map(fn (Category $category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'parent_id' => $category->parent_id,
                ])->all(),
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

    public function show(CommissionRule $rule): JsonResponse
    {
        $rule->load(['category', 'store.owner', 'adminEvents.author']);

        return response()->json([
            'rule' => $this->detail($rule),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validated($request);

        $rule = DB::transaction(function () use ($request, $validated): CommissionRule {
            $rule = CommissionRule::query()->create($validated);
            $this->record($request, $rule, CommissionRuleAdminEvent::TYPE_CREATED, __('app.commissions.created'), null, $rule->status);

            return $rule;
        });

        return response()->json([
            'message' => __('app.commissions.created'),
            'rule' => $this->detail($rule->fresh()->load(['category', 'store.owner', 'adminEvents.author'])),
        ], 201);
    }

    public function update(Request $request, CommissionRule $rule): JsonResponse
    {
        $validated = $this->validated($request, $rule);
        $from = $rule->status;

        $rule->fill($validated)->save();

        $this->record(
            $request,
            $rule,
            array_key_exists('status', $validated) && $validated['status'] !== $from
                ? CommissionRuleAdminEvent::TYPE_STATUS
                : CommissionRuleAdminEvent::TYPE_UPDATED,
            __('app.commissions.updated'),
            array_key_exists('status', $validated) ? $from : null,
            array_key_exists('status', $validated) ? $rule->status : null,
        );

        return response()->json([
            'message' => __('app.commissions.updated'),
            'rule' => $this->detail($rule->fresh()->load(['category', 'store.owner', 'adminEvents.author'])),
        ]);
    }

    public function updateStatus(Request $request, CommissionRule $rule): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(CommissionRule::STATUSES)],
        ]);

        if ($rule->status === $validated['status']) {
            throw ValidationException::withMessages([
                'status' => __('app.commissions.already_in_status'),
            ]);
        }

        $from = $rule->status;
        $rule->status = $validated['status'];
        $rule->save();

        $this->record($request, $rule, CommissionRuleAdminEvent::TYPE_STATUS, null, $from, $rule->status);

        return response()->json([
            'message' => __('app.commissions.status_updated'),
            'rule' => $this->detail($rule->fresh()->load(['category', 'store.owner', 'adminEvents.author'])),
        ]);
    }

    public function storeNote(Request $request, CommissionRule $rule): JsonResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $this->record($request, $rule, CommissionRuleAdminEvent::TYPE_NOTE, $validated['body']);

        return response()->json([
            'message' => __('app.commissions.note_added'),
            'rule' => $this->detail($rule->fresh()->load(['category', 'store.owner', 'adminEvents.author'])),
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'global_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'product_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'service_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'fixed_fee' => ['nullable', 'numeric', 'min:0'],
            'min_commission' => ['nullable', 'numeric', 'min:0'],
            'max_commission' => ['nullable', 'numeric', 'min:0'],
            'tax_treatment' => ['nullable', Rule::in(CommissionRule::INCLUDE_TREATMENTS)],
            'discount_treatment' => ['nullable', Rule::in(CommissionRule::DISCOUNT_TREATMENTS)],
            'reserve_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'rounding' => ['nullable', Rule::in(CommissionSetting::ROUNDINGS)],
            'currency' => ['nullable', Rule::in(CommissionSetting::CURRENCIES)],
            'include_shipping' => ['nullable', 'boolean'],
            'include_taxes' => ['nullable', 'boolean'],
            'auto_refund_reversal' => ['nullable', 'boolean'],
            'allow_negative_balances' => ['nullable', 'boolean'],
            'approve_adjustments' => ['nullable', 'boolean'],
        ]);

        $settings = CommissionSetting::query()->first() ?? new CommissionSetting(CommissionSetting::defaults());
        $settings->fill($validated)->save();

        return response()->json([
            'message' => __('app.commissions.settings_updated'),
            'settings' => $this->settingsPayload($settings->fresh()),
        ]);
    }

    public function events(Request $request): JsonResponse
    {
        $limit = $request->validate([
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ])['limit'] ?? 10;

        $events = CommissionRuleAdminEvent::query()
            ->with(['author', 'rule.store.owner'])
            ->latest()
            ->limit($limit ?: 10)
            ->get();

        return response()->json([
            'events' => $events->map(fn (CommissionRuleAdminEvent $event) => [
                'id' => $event->id,
                'type' => $event->type,
                'body' => $event->body,
                'from_status' => $event->from_status,
                'to_status' => $event->to_status,
                'rule' => $event->rule?->code(),
                'rule_id' => $event->commission_rule_id,
                'subject' => $event->rule?->name,
                'vendor' => $event->rule?->store?->owner?->name,
                'author' => $event->author?->name,
                'created_at' => $event->created_at?->toIso8601String(),
            ])->all(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?CommissionRule $rule = null): array
    {
        $creating = $rule === null;
        $calculation = $request->input('calculation_type', $rule?->calculation_type ?? CommissionRule::CALC_PERCENTAGE);
        $appliesTo = $request->input('applies_to', $rule?->applies_to ?? CommissionRule::APPLIES_ALL);

        $validated = $request->validate([
            'name' => [$creating ? 'required' : 'sometimes', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status' => [$creating ? 'nullable' : 'sometimes', Rule::in(CommissionRule::STATUSES)],
            'calculation_type' => [$creating ? 'nullable' : 'sometimes', Rule::in(CommissionRule::CALCULATION_TYPES)],
            'percentage_rate' => [
                Rule::requiredIf(fn () => in_array($calculation, [
                    CommissionRule::CALC_PERCENTAGE,
                    CommissionRule::CALC_PERCENTAGE_PLUS_FIXED,
                ], true) && ($creating || $request->has('calculation_type') || $request->has('percentage_rate'))),
                'nullable', 'numeric', 'min:0', 'max:100',
            ],
            'fixed_amount' => [
                Rule::requiredIf(fn () => in_array($calculation, [
                    CommissionRule::CALC_FIXED,
                    CommissionRule::CALC_PERCENTAGE_PLUS_FIXED,
                ], true) && ($creating || $request->has('calculation_type') || $request->has('fixed_amount'))),
                'nullable', 'numeric', 'min:0',
            ],
            'min_commission' => ['nullable', 'numeric', 'min:0'],
            'max_commission' => ['nullable', 'numeric', 'min:0'],
            'applies_to' => [$creating ? 'nullable' : 'sometimes', Rule::in(CommissionRule::APPLIES_TO)],
            'category_id' => [
                Rule::requiredIf(fn () => $appliesTo === CommissionRule::APPLIES_CATEGORIES && ($creating || $request->has('applies_to') || $request->has('category_id'))),
                'nullable', 'integer', 'exists:categories,id',
            ],
            'store_id' => [
                Rule::requiredIf(fn () => $appliesTo === CommissionRule::APPLIES_VENDOR && ($creating || $request->has('applies_to') || $request->has('store_id'))),
                'nullable', 'integer', 'exists:stores,id',
            ],
            'priority' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'min_order_value' => ['nullable', 'numeric', 'min:0'],
            'max_order_value' => ['nullable', 'numeric', 'min:0'],
            'tax_treatment' => ['nullable', Rule::in(CommissionRule::INCLUDE_TREATMENTS)],
            'shipping_treatment' => ['nullable', Rule::in(CommissionRule::INCLUDE_TREATMENTS)],
            'discount_treatment' => ['nullable', Rule::in(CommissionRule::DISCOUNT_TREATMENTS)],
            'refund_treatment' => ['nullable', Rule::in(CommissionRule::REFUND_TREATMENTS)],
            'notes' => ['nullable', 'string', 'max:4000'],
        ]);

        if ($creating) {
            $validated['status'] = $validated['status'] ?? CommissionRule::STATUS_DRAFT;
            $validated['calculation_type'] = $validated['calculation_type'] ?? CommissionRule::CALC_PERCENTAGE;
            $validated['applies_to'] = $validated['applies_to'] ?? CommissionRule::APPLIES_ALL;
            $validated['priority'] = $validated['priority'] ?? 100;
            $validated['tax_treatment'] = $validated['tax_treatment'] ?? CommissionRule::TREAT_EXCLUDE;
            $validated['shipping_treatment'] = $validated['shipping_treatment'] ?? CommissionRule::TREAT_EXCLUDE;
            $validated['discount_treatment'] = $validated['discount_treatment'] ?? CommissionRule::DISCOUNT_AFTER;
            $validated['refund_treatment'] = $validated['refund_treatment'] ?? CommissionRule::REFUND_PROPORTIONAL;
        }

        if (($validated['applies_to'] ?? $appliesTo) !== CommissionRule::APPLIES_CATEGORIES && array_key_exists('category_id', $validated) === false) {
            $validated['category_id'] = $creating ? null : $rule?->category_id;
        }

        if (($validated['applies_to'] ?? $appliesTo) === CommissionRule::APPLIES_CATEGORIES) {
            $validated['store_id'] = null;
        } elseif (($validated['applies_to'] ?? $appliesTo) === CommissionRule::APPLIES_VENDOR) {
            $validated['category_id'] = null;
        } elseif ($creating || isset($validated['applies_to'])) {
            $validated['category_id'] = null;
            $validated['store_id'] = null;
        }

        return $validated;
    }

    private function filtered(Request $request)
    {
        $filters = $request->only(['search', 'status', 'calculation_type', 'applies_to', 'category_id', 'store_id']);

        $query = CommissionRule::query()
            ->when($filters['search'] ?? null, fn ($query, $term) => $this->applySearch($query, $term))
            ->when($filters['calculation_type'] ?? null, fn ($query, $type) => $query->where('calculation_type', $type))
            ->when($filters['applies_to'] ?? null, fn ($query, $scope) => $query->where('applies_to', $scope))
            ->when($filters['category_id'] ?? null, fn ($query, $id) => $query->where('category_id', $id))
            ->when($filters['store_id'] ?? null, fn ($query, $id) => $query->where('store_id', $id));

        if ($request->boolean('attention')) {
            $this->applyEffectiveStatus($query, CommissionRule::STATUS_EXPIRED);
        } elseif ($filters['status'] ?? null) {
            $this->applyEffectiveStatus($query, $filters['status']);
        }

        return $query;
    }

    private function applySearch($query, string $term)
    {
        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';

        return $query->where(function ($query) use ($like, $term): void {
            $query->where('name', 'like', $like)
                ->orWhere('description', 'like', $like)
                ->orWhereHas('category', fn ($categories) => $categories->where('name', 'like', $like)->orWhere('slug', 'like', $like))
                ->orWhereHas('store', fn ($stores) => $stores
                    ->where('name', 'like', $like)
                    ->orWhereHas('owner', fn ($owners) => $owners->where('name', 'like', $like)));

            if (preg_match('/^RUL-?(\d+)$/i', trim($term), $matches)) {
                $query->orWhere('id', (int) $matches[1]);
            } elseif (ctype_digit($term)) {
                $query->orWhere('id', (int) $term);
            }
        });
    }

    private function applyEffectiveStatus($query, string $status)
    {
        $today = now()->toDateString();

        return match ($status) {
            CommissionRule::STATUS_DRAFT,
            CommissionRule::STATUS_DISABLED => $query->where('status', $status),
            CommissionRule::STATUS_EXPIRED => $query
                ->whereNotIn('status', [CommissionRule::STATUS_DRAFT, CommissionRule::STATUS_DISABLED])
                ->whereNotNull('ends_at')
                ->whereDate('ends_at', '<', $today),
            CommissionRule::STATUS_SCHEDULED => $query
                ->whereNotIn('status', [CommissionRule::STATUS_DRAFT, CommissionRule::STATUS_DISABLED])
                ->where(function ($query) use ($today): void {
                    $query->whereNull('ends_at')->orWhereDate('ends_at', '>=', $today);
                })
                ->where(function ($query) use ($today): void {
                    $query->where('status', CommissionRule::STATUS_SCHEDULED)
                        ->orWhereDate('starts_at', '>', $today);
                }),
            CommissionRule::STATUS_ACTIVE => $query
                ->whereNotIn('status', [CommissionRule::STATUS_DRAFT, CommissionRule::STATUS_DISABLED])
                ->where(function ($query) use ($today): void {
                    $query->whereNull('ends_at')->orWhereDate('ends_at', '>=', $today);
                })
                ->where(function ($query) use ($today): void {
                    $query->where(function ($query) use ($today): void {
                        $query->where('status', CommissionRule::STATUS_ACTIVE)
                            ->where(fn ($inner) => $inner->whereNull('starts_at')->orWhereDate('starts_at', '<=', $today));
                    })->orWhere(function ($query) use ($today): void {
                        $query->where('status', CommissionRule::STATUS_SCHEDULED)
                            ->whereNotNull('starts_at')
                            ->whereDate('starts_at', '<=', $today);
                    });
                }),
            default => $query,
        };
    }

    /**
     * @return array<string, int|float|null>
     */
    private function stats(): array
    {
        $rules = CommissionRule::query()->get();

        $effective = $rules->countBy(fn (CommissionRule $rule) => $rule->effectiveStatus());
        $scopes = $rules->countBy('applies_to');

        $activeRates = $rules
            ->filter(fn (CommissionRule $rule) => $rule->effectiveStatus() === CommissionRule::STATUS_ACTIVE
                && $rule->percentage_rate !== null)
            ->pluck('percentage_rate');

        return [
            'total' => $rules->count(),
            'new_this_month' => $rules->where('created_at', '>=', now()->startOfMonth())->count(),
            'draft' => (int) ($effective[CommissionRule::STATUS_DRAFT] ?? 0),
            'active' => (int) ($effective[CommissionRule::STATUS_ACTIVE] ?? 0),
            'scheduled' => (int) ($effective[CommissionRule::STATUS_SCHEDULED] ?? 0),
            'disabled' => (int) ($effective[CommissionRule::STATUS_DISABLED] ?? 0),
            'expired' => (int) ($effective[CommissionRule::STATUS_EXPIRED] ?? 0),
            'attention' => (int) ($effective[CommissionRule::STATUS_EXPIRED] ?? 0),
            'all_vendors' => (int) ($scopes[CommissionRule::APPLIES_ALL] ?? 0),
            'selected_vendors' => (int) ($scopes[CommissionRule::APPLIES_VENDOR] ?? 0),
            'products' => (int) ($scopes[CommissionRule::APPLIES_PRODUCTS] ?? 0),
            'services' => (int) ($scopes[CommissionRule::APPLIES_SERVICES] ?? 0),
            'categories' => (int) ($scopes[CommissionRule::APPLIES_CATEGORIES] ?? 0),
            'average_rate' => $activeRates->isEmpty() ? null : round((float) $activeRates->avg(), 2),
            'commission_entries' => FinancialEntry::query()->where('type', FinancialEntry::TYPE_COMMISSION)->count(),
            'commission_amount' => (float) FinancialEntry::query()
                ->where('type', FinancialEntry::TYPE_COMMISSION)
                ->sum('amount'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function summarise(CommissionRule $rule): array
    {
        $category = $rule->category;
        $store = $rule->store;

        return [
            'id' => $rule->id,
            'code' => $rule->code(),
            'name' => $rule->name,
            'description' => $rule->description,
            'status' => $rule->status,
            'effective_status' => $rule->effectiveStatus(),
            'calculation_type' => $rule->calculation_type,
            'percentage_rate' => $rule->percentage_rate !== null ? (float) $rule->percentage_rate : null,
            'fixed_amount' => $rule->fixed_amount !== null ? (float) $rule->fixed_amount : null,
            'rate_label' => $rule->rateLabel(),
            'applies_to' => $rule->applies_to,
            'priority' => $rule->priority,
            'starts_at' => $rule->starts_at?->toDateString(),
            'ends_at' => $rule->ends_at?->toDateString(),
            'created_at' => $rule->created_at?->toIso8601String(),
            'updated_at' => $rule->updated_at?->toIso8601String(),
            'category' => $category ? [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ] : null,
            'store' => $store ? [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'vendor_id' => $store->owner_id,
                'vendor_name' => $store->owner?->name,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function detail(CommissionRule $rule): array
    {
        return array_merge($this->summarise($rule), [
            'min_commission' => $rule->min_commission !== null ? (float) $rule->min_commission : null,
            'max_commission' => $rule->max_commission !== null ? (float) $rule->max_commission : null,
            'min_order_value' => $rule->min_order_value !== null ? (float) $rule->min_order_value : null,
            'max_order_value' => $rule->max_order_value !== null ? (float) $rule->max_order_value : null,
            'tax_treatment' => $rule->tax_treatment,
            'shipping_treatment' => $rule->shipping_treatment,
            'discount_treatment' => $rule->discount_treatment,
            'refund_treatment' => $rule->refund_treatment,
            'notes' => $rule->notes,
            'events' => $rule->adminEvents->map(fn (CommissionRuleAdminEvent $event) => [
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
    private function settingsPayload(CommissionSetting $settings): array
    {
        return [
            'global_rate' => $settings->global_rate !== null ? (float) $settings->global_rate : null,
            'product_rate' => $settings->product_rate !== null ? (float) $settings->product_rate : null,
            'service_rate' => $settings->service_rate !== null ? (float) $settings->service_rate : null,
            'fixed_fee' => $settings->fixed_fee !== null ? (float) $settings->fixed_fee : null,
            'min_commission' => $settings->min_commission !== null ? (float) $settings->min_commission : null,
            'max_commission' => $settings->max_commission !== null ? (float) $settings->max_commission : null,
            'tax_treatment' => $settings->tax_treatment,
            'discount_treatment' => $settings->discount_treatment,
            'reserve_days' => $settings->reserve_days,
            'rounding' => $settings->rounding,
            'currency' => $settings->currency,
            'include_shipping' => (bool) $settings->include_shipping,
            'include_taxes' => (bool) $settings->include_taxes,
            'auto_refund_reversal' => (bool) $settings->auto_refund_reversal,
            'allow_negative_balances' => (bool) $settings->allow_negative_balances,
            'approve_adjustments' => (bool) $settings->approve_adjustments,
            'updated_at' => $settings->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function entrySummary(FinancialEntry $entry): array
    {
        $store = $entry->store;
        $order = $entry->order;

        return [
            'id' => $entry->id,
            'code' => $entry->code(),
            'status' => $entry->status,
            'subject' => $entry->subject,
            'amount' => (float) $entry->amount,
            'currency' => $entry->currency,
            'created_at' => $entry->created_at?->toIso8601String(),
            'customer' => $entry->customer ? [
                'id' => $entry->customer->id,
                'name' => $entry->customer->name,
            ] : null,
            'store' => $store ? [
                'id' => $store->id,
                'name' => $store->name,
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

    private function record(
        Request $request,
        CommissionRule $rule,
        string $type,
        ?string $body = null,
        ?string $from = null,
        ?string $to = null,
    ): void {
        $rule->adminEvents()->create([
            'author_id' => $request->user()?->id,
            'type' => $type,
            'body' => $body,
            'from_status' => $from,
            'to_status' => $to,
        ]);
    }
}
