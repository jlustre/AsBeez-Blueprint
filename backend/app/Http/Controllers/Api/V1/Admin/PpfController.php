<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\PpfFaq;
use App\Models\PpfMarket;
use App\Models\PpfPlan;
use App\Models\PpfSetting;
use App\Models\PpfTier;
use App\Support\PpfCatalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Administrator CRUD for the public Platform Participation Fee page.
 */
class PpfController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(PpfCatalog::admin());
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'is_published' => ['nullable', 'boolean'],
            'copy' => ['nullable', 'array'],
            'copy.*' => ['nullable', 'string'],
            'anatomy_items' => ['nullable', 'array'],
            'anatomy_items.*.title' => ['required_with:anatomy_items', 'string', 'max:160'],
            'anatomy_items.*.body' => ['required_with:anatomy_items', 'string', 'max:500'],
            'statement' => ['nullable', 'array'],
            'statement.title' => ['nullable', 'string', 'max:160'],
            'statement.reference' => ['nullable', 'string', 'max:160'],
            'statement.status' => ['nullable', 'string', 'max:80'],
            'statement.note' => ['nullable', 'string', 'max:500'],
            'statement.lines' => ['nullable', 'array'],
            'statement.lines.*.label' => ['required_with:statement.lines', 'string', 'max:160'],
            'statement.lines.*.value' => ['required_with:statement.lines', 'string', 'max:80'],
            'statement.lines.*.tone' => ['nullable', 'string', 'max:20'],
            'movement' => ['nullable', 'array'],
            'movement.eyebrow' => ['nullable', 'string', 'max:160'],
            'movement.title' => ['nullable', 'string', 'max:160'],
            'movement.body' => ['nullable', 'string', 'max:2000'],
            'movement.sample_label' => ['nullable', 'string', 'max:160'],
            'movement.current_label' => ['nullable', 'string', 'max:160'],
            'movement.progress_label' => ['nullable', 'string', 'max:160'],
            'movement.remaining_label' => ['nullable', 'string', 'max:160'],
            'movement.current_tier' => ['nullable', 'string', 'max:160'],
            'movement.progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'cta_links' => ['nullable', 'array'],
            'cta_links.*.label' => ['required_with:cta_links', 'string', 'max:160'],
            'cta_links.*.href' => ['required_with:cta_links', 'string', 'max:255'],
            'processing_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'processing_fixed' => ['nullable', 'numeric', 'min:0'],
            'company_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'compensation_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'rp_per_dollar' => ['nullable', 'numeric', 'min:0'],
            'example_ppf_amount' => ['nullable', 'numeric', 'min:0'],
        ]);

        $settings = PpfSetting::query()->first() ?? new PpfSetting(PpfSetting::defaults());

        if (isset($validated['copy'])) {
            $validated['copy'] = $this->copy(array_merge($settings->copy ?? [], $validated['copy']));
        }

        $settings->fill($validated)->save();

        return response()->json([
            'message' => __('app.ppf.settings_updated'),
            'settings' => PpfCatalog::settingsPayload($settings->fresh(), true),
        ]);
    }

    public function storeTier(Request $request): JsonResponse
    {
        $validated = $this->validatedTier($request);
        $validated['slug'] = $this->uniqueSlug(PpfTier::class, $validated['slug'] ?? Str::slug($validated['name']));
        $validated['position'] = $validated['position'] ?? $this->nextPosition(PpfTier::query());
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['emphasis'] = $validated['emphasis'] ?? PpfTier::EMPHASIS_DEFAULT;

        $tier = PpfTier::query()->create($validated);

        return response()->json([
            'message' => __('app.ppf.tier_created'),
            'tier' => PpfCatalog::tierPayload($tier->fresh(), true),
        ], 201);
    }

    public function updateTier(Request $request, PpfTier $tier): JsonResponse
    {
        $validated = $this->validatedTier($request, $tier);

        if (isset($validated['slug'])) {
            $validated['slug'] = $this->uniqueSlug(PpfTier::class, $validated['slug'], $tier->id);
        }

        $tier->fill($validated)->save();

        return response()->json([
            'message' => __('app.ppf.tier_updated'),
            'tier' => PpfCatalog::tierPayload($tier->fresh()->loadCount('plans'), true),
        ]);
    }

    public function destroyTier(PpfTier $tier): JsonResponse
    {
        $tier->delete();

        return response()->json([
            'message' => __('app.ppf.tier_deleted'),
        ]);
    }

    public function storeMarket(Request $request): JsonResponse
    {
        $validated = $this->validatedMarket($request);
        $validated['slug'] = $this->uniqueSlug(PpfMarket::class, $validated['slug'] ?? Str::slug($validated['label']));
        $validated['position'] = $validated['position'] ?? $this->nextPosition(
            PpfMarket::query()->where('parent_id', $validated['parent_id'] ?? null),
        );
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['has_cards'] = $validated['has_cards'] ?? false;
        $validated['columns'] = $validated['columns'] ?? [];

        $market = PpfMarket::query()->create($validated);

        return response()->json([
            'message' => __('app.ppf.market_created'),
            'market' => PpfCatalog::marketPayload($market->fresh()->load(['parent', 'children'])->loadCount(['plans', 'children']), false, true),
        ], 201);
    }

    public function updateMarket(Request $request, PpfMarket $market): JsonResponse
    {
        $validated = $this->validatedMarket($request, $market);

        if (array_key_exists('parent_id', $validated)) {
            $this->assertAcyclic($market, $validated['parent_id']);
        }

        if (isset($validated['slug'])) {
            $validated['slug'] = $this->uniqueSlug(PpfMarket::class, $validated['slug'], $market->id);
        }

        $market->fill($validated)->save();

        return response()->json([
            'message' => __('app.ppf.market_updated'),
            'market' => PpfCatalog::marketPayload($market->fresh()->load(['parent', 'children'])->loadCount(['plans', 'children']), false, true),
        ]);
    }

    public function destroyMarket(PpfMarket $market): JsonResponse
    {
        $market->children()->update(['parent_id' => null]);
        $market->delete();

        return response()->json([
            'message' => __('app.ppf.market_deleted'),
        ]);
    }

    public function storePlan(Request $request): JsonResponse
    {
        $validated = $this->validatedPlan($request);
        $validated['position'] = $validated['position'] ?? $this->nextPosition(
            PpfPlan::query()->where('ppf_market_id', $validated['ppf_market_id']),
        );
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['is_featured'] = $validated['is_featured'] ?? false;
        $validated['style'] = $validated['style'] ?? PpfPlan::STYLE_DEFAULT;
        $validated['cells'] = $validated['cells'] ?? [];
        $validated['features'] = $validated['features'] ?? [];

        $plan = PpfPlan::query()->create($validated);

        return response()->json([
            'message' => __('app.ppf.plan_created'),
            'plan' => PpfCatalog::planPayload($plan->fresh()->load(['market', 'tier']), true),
        ], 201);
    }

    public function updatePlan(Request $request, PpfPlan $plan): JsonResponse
    {
        $validated = $this->validatedPlan($request, $plan);

        $plan->fill($validated)->save();

        return response()->json([
            'message' => __('app.ppf.plan_updated'),
            'plan' => PpfCatalog::planPayload($plan->fresh()->load(['market', 'tier']), true),
        ]);
    }

    public function destroyPlan(PpfPlan $plan): JsonResponse
    {
        $plan->delete();

        return response()->json([
            'message' => __('app.ppf.plan_deleted'),
        ]);
    }

    public function storeFaq(Request $request): JsonResponse
    {
        $validated = $this->validatedFaq($request);
        $validated['position'] = $validated['position'] ?? $this->nextPosition(PpfFaq::query());
        $validated['is_active'] = $validated['is_active'] ?? true;

        $faq = PpfFaq::query()->create($validated);

        return response()->json([
            'message' => __('app.ppf.faq_created'),
            'faq' => PpfCatalog::faqPayload($faq->fresh()),
        ], 201);
    }

    public function updateFaq(Request $request, PpfFaq $faq): JsonResponse
    {
        $faq->fill($this->validatedFaq($request, $faq))->save();

        return response()->json([
            'message' => __('app.ppf.faq_updated'),
            'faq' => PpfCatalog::faqPayload($faq->fresh()),
        ]);
    }

    public function destroyFaq(PpfFaq $faq): JsonResponse
    {
        $faq->delete();

        return response()->json([
            'message' => __('app.ppf.faq_deleted'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedTier(Request $request, ?PpfTier $tier = null): array
    {
        $creating = $tier === null;

        return $request->validate([
            'name' => [$creating ? 'required' : 'sometimes', 'string', 'max:120'],
            'slug' => [$creating ? 'nullable' : 'sometimes', 'string', 'max:120', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'badge' => [$creating ? 'required' : 'sometimes', 'string', 'max:40'],
            'summary' => ['nullable', 'string', 'max:500'],
            'emphasis' => ['nullable', Rule::in(PpfTier::EMPHASES)],
            'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedMarket(Request $request, ?PpfMarket $market = null): array
    {
        $creating = $market === null;

        return $request->validate([
            'label' => [$creating ? 'required' : 'sometimes', 'string', 'max:120'],
            'slug' => [$creating ? 'nullable' : 'sometimes', 'string', 'max:120', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'subtitle' => ['nullable', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:2000'],
            'parent_id' => ['nullable', 'integer', 'exists:ppf_markets,id'],
            'has_cards' => ['nullable', 'boolean'],
            'columns' => ['nullable', 'array'],
            'columns.*.key' => ['required_with:columns', 'string', 'max:40', 'regex:/^[a-z0-9_]+$/'],
            'columns.*.label' => ['required_with:columns', 'string', 'max:80'],
            'example_note' => ['nullable', 'string', 'max:1000'],
            'upgrade_note' => ['nullable', 'string', 'max:1000'],
            'compliance_note' => ['nullable', 'string', 'max:1000'],
            'footnote' => ['nullable', 'string', 'max:1000'],
            'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedPlan(Request $request, ?PpfPlan $plan = null): array
    {
        $creating = $plan === null;

        $validated = $request->validate([
            'ppf_market_id' => [$creating ? 'required' : 'sometimes', 'integer', 'exists:ppf_markets,id'],
            'ppf_tier_id' => ['nullable', 'integer', 'exists:ppf_tiers,id'],
            'name' => [$creating ? 'required' : 'sometimes', 'string', 'max:120'],
            'qualification' => ['nullable', 'string', 'max:160'],
            'rate_label' => ['nullable', 'string', 'max:80'],
            'rate_suffix' => ['nullable', 'string', 'max:40'],
            'is_featured' => ['nullable', 'boolean'],
            'style' => ['nullable', Rule::in(PpfPlan::STYLES)],
            'cells' => ['nullable', 'array'],
            'cells.*' => ['nullable', 'string', 'max:240'],
            'features' => ['nullable', 'array'],
            'features.*' => ['nullable', 'string', 'max:160'],
            'volume_min' => ['nullable', 'numeric', 'min:0'],
            'volume_max' => ['nullable', 'numeric', 'min:0'],
            'subscription_amount' => ['nullable', 'numeric', 'min:0'],
            'percent_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'percent_rate_max' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'fixed_amount' => ['nullable', 'numeric', 'min:0'],
            'min_fee' => ['nullable', 'numeric', 'min:0'],
            'cap_fee' => ['nullable', 'numeric', 'min:0'],
            'listing_amount' => ['nullable', 'numeric', 'min:0'],
            'lead_amount' => ['nullable', 'numeric', 'min:0'],
            'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if (isset($validated['features'])) {
            $validated['features'] = array_values(array_filter($validated['features'], fn ($item) => filled($item)));
        }

        return $validated;
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedFaq(Request $request, ?PpfFaq $faq = null): array
    {
        $creating = $faq === null;

        return $request->validate([
            'question' => [$creating ? 'required' : 'sometimes', 'string', 'max:240'],
            'answer' => [$creating ? 'required' : 'sometimes', 'string', 'max:2000'],
            'position' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $copy
     * @return array<string, string>
     */
    private function copy(array $copy): array
    {
        $unknown = array_diff(array_keys($copy), PpfSetting::COPY_KEYS);

        if ($unknown !== []) {
            throw ValidationException::withMessages([
                'copy' => __('app.ppf.unknown_copy_keys', ['keys' => implode(', ', $unknown)]),
            ]);
        }

        return collect(PpfSetting::COPY_KEYS)
            ->mapWithKeys(fn (string $key) => [$key => (string) ($copy[$key] ?? '')])
            ->all();
    }

    private function assertAcyclic(PpfMarket $market, mixed $parentId): void
    {
        if ($parentId === null) {
            return;
        }

        $parentId = (int) $parentId;

        if ($parentId === (int) $market->getKey()) {
            throw ValidationException::withMessages([
                'parent_id' => __('app.ppf.invalid_parent'),
            ]);
        }

        $cursor = PpfMarket::query()->find($parentId);

        while ($cursor) {
            if ((int) $cursor->getKey() === (int) $market->getKey()) {
                throw ValidationException::withMessages([
                    'parent_id' => __('app.ppf.invalid_parent'),
                ]);
            }

            $cursor = $cursor->parent;
        }
    }

    private function uniqueSlug(string $model, string $slug, ?int $ignore = null): string
    {
        $base = Str::slug($slug) ?: 'item';
        $candidate = $base;
        $suffix = 2;

        while ($model::query()->where('slug', $candidate)->when($ignore, fn ($query) => $query->where('id', '!=', $ignore))->exists()) {
            $candidate = $base.'-'.$suffix;
            $suffix++;
        }

        return $candidate;
    }

    private function nextPosition($query): int
    {
        return (int) $query->max('position') + 1;
    }
}
