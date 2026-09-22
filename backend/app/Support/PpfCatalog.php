<?php

namespace App\Support;

use App\Models\PpfFaq;
use App\Models\PpfMarket;
use App\Models\PpfPlan;
use App\Models\PpfSetting;
use App\Models\PpfTier;

/**
 * Shared payloads for the public fee page and the administrator directory.
 */
class PpfCatalog
{
    /**
     * @return array<string, mixed>
     */
    public static function public(): array
    {
        $settings = PpfSetting::current();

        if (! $settings->exists || ! $settings->is_published) {
            return [
                'published' => false,
                'settings' => null,
                'tiers' => [],
                'markets' => [],
                'faqs' => [],
                'stats' => ['markets' => 0, 'common_tiers' => 0],
            ];
        }

        $tiers = PpfTier::query()->where('is_active', true)->orderBy('position')->orderBy('id')->get();
        $markets = PpfMarket::query()
            ->where('is_active', true)
            ->with(['children' => fn ($query) => $query->where('is_active', true)->with([
                'plans' => fn ($plans) => $plans->where('is_active', true)->with('tier'),
            ])])
            ->with(['plans' => fn ($plans) => $plans->where('is_active', true)->with('tier')])
            ->whereNull('parent_id')
            ->orderBy('position')
            ->orderBy('id')
            ->get();
        $faqs = PpfFaq::query()->where('is_active', true)->orderBy('position')->orderBy('id')->get();

        return [
            'published' => true,
            'settings' => self::settingsPayload($settings, false),
            'tiers' => $tiers->map(fn (PpfTier $tier) => self::tierPayload($tier))->all(),
            'markets' => $markets->map(fn (PpfMarket $market) => self::marketPayload($market, true))->all(),
            'faqs' => $faqs->map(fn (PpfFaq $faq) => self::faqPayload($faq))->all(),
            'stats' => [
                'markets' => $markets->count(),
                'common_tiers' => $tiers->count(),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function admin(): array
    {
        $settings = PpfSetting::current();
        $tiers = PpfTier::query()->withCount('plans')->orderBy('position')->orderBy('id')->get();
        $markets = PpfMarket::query()
            ->with(['parent', 'children'])
            ->withCount(['plans', 'children'])
            ->orderBy('position')
            ->orderBy('id')
            ->get();
        $plans = PpfPlan::query()->with(['market', 'tier'])->orderBy('position')->orderBy('id')->get();
        $faqs = PpfFaq::query()->orderBy('position')->orderBy('id')->get();

        return [
            'settings' => self::settingsPayload($settings, true),
            'tiers' => $tiers->map(fn (PpfTier $tier) => self::tierPayload($tier, true))->all(),
            'markets' => $markets->map(fn (PpfMarket $market) => self::marketPayload($market, false, true))->all(),
            'plans' => $plans->map(fn (PpfPlan $plan) => self::planPayload($plan, true))->all(),
            'faqs' => $faqs->map(fn (PpfFaq $faq) => self::faqPayload($faq))->all(),
            'stats' => [
                'published' => (bool) $settings->is_published,
                'tiers' => $tiers->count(),
                'markets' => $markets->whereNull('parent_id')->count(),
                'schedules' => $markets->whereNotNull('parent_id')->count(),
                'plans' => $plans->count(),
                'faqs' => $faqs->count(),
                'inactive' => $tiers->where('is_active', false)->count()
                    + $markets->where('is_active', false)->count()
                    + $plans->where('is_active', false)->count()
                    + $faqs->where('is_active', false)->count(),
            ],
            'emphases' => PpfTier::EMPHASES,
            'styles' => PpfPlan::STYLES,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function settingsPayload(PpfSetting $settings, bool $admin = false): array
    {
        $copy = array_merge(array_fill_keys(PpfSetting::COPY_KEYS, ''), $settings->copy ?? []);
        $statement = $settings->statement ?? PpfSetting::defaults()['statement'];

        if (! $admin) {
            unset($copy['rewards_company_label']);
            $statement['lines'] = array_values(array_filter(
                $statement['lines'] ?? [],
                fn (mixed $line): bool => ! self::isCompanyRevenueLine($line),
            ));
        }

        $payload = [
            'is_published' => (bool) $settings->is_published,
            'copy' => $copy,
            'anatomy_items' => array_values($settings->anatomy_items ?? []),
            'statement' => $statement,
            'movement' => $settings->movement ?? PpfSetting::defaults()['movement'],
            'cta_links' => array_values($settings->cta_links ?? []),
            'processing_percent' => $settings->processing_percent !== null ? (float) $settings->processing_percent : null,
            'processing_fixed' => $settings->processing_fixed !== null ? (float) $settings->processing_fixed : null,
            'compensation_percent' => $settings->compensation_percent !== null ? (float) $settings->compensation_percent : null,
            'rp_per_dollar' => $settings->rp_per_dollar !== null ? (float) $settings->rp_per_dollar : null,
            'example_ppf_amount' => $settings->example_ppf_amount !== null ? (float) $settings->example_ppf_amount : null,
            'updated_at' => $settings->updated_at?->toIso8601String(),
        ];

        if ($admin) {
            $payload['company_percent'] = $settings->company_percent !== null ? (float) $settings->company_percent : null;
        }

        return $payload;
    }

    /**
     * @return array<string, mixed>
     */
    public static function tierPayload(PpfTier $tier, bool $admin = false): array
    {
        $payload = [
            'id' => $tier->id,
            'slug' => $tier->slug,
            'badge' => $tier->badge,
            'name' => $tier->name,
            'summary' => $tier->summary,
            'emphasis' => $tier->emphasis,
            'position' => $tier->position,
            'is_active' => (bool) $tier->is_active,
        ];

        if ($admin) {
            $payload['plan_count'] = $tier->plans_count ?? $tier->plans()->count();
            $payload['updated_at'] = $tier->updated_at?->toIso8601String();
        }

        return $payload;
    }

    /**
     * @return array<string, mixed>
     */
    public static function marketPayload(PpfMarket $market, bool $withChildren = false, bool $admin = false): array
    {
        $payload = [
            'id' => $market->id,
            'parent_id' => $market->parent_id,
            'slug' => $market->slug,
            'label' => $market->label,
            'subtitle' => $market->subtitle,
            'description' => $market->description,
            'has_cards' => (bool) $market->has_cards,
            'columns' => array_values($market->columns ?? []),
            'example_note' => $market->example_note,
            'upgrade_note' => $market->upgrade_note,
            'compliance_note' => $market->compliance_note,
            'footnote' => $market->footnote,
            'position' => $market->position,
            'is_active' => (bool) $market->is_active,
            'plans' => $market->relationLoaded('plans')
                ? $market->plans->map(fn (PpfPlan $plan) => self::planPayload($plan, $admin))->all()
                : [],
        ];

        if ($withChildren) {
            $payload['children'] = $market->children
                ->map(fn (PpfMarket $child) => self::marketPayload($child, false, $admin))
                ->all();
        }

        if ($admin) {
            $payload['parent'] = $market->parent ? [
                'id' => $market->parent->id,
                'slug' => $market->parent->slug,
                'label' => $market->parent->label,
            ] : null;
            $payload['plan_count'] = $market->plans_count ?? $market->plans()->count();
            $payload['child_count'] = $market->children_count ?? $market->children()->count();
            $payload['updated_at'] = $market->updated_at?->toIso8601String();
        }

        return $payload;
    }

    /**
     * @return array<string, mixed>
     */
    public static function planPayload(PpfPlan $plan, bool $admin = false): array
    {
        $payload = [
            'id' => $plan->id,
            'ppf_market_id' => $plan->ppf_market_id,
            'ppf_tier_id' => $plan->ppf_tier_id,
            'name' => $plan->name,
            'qualification' => $plan->qualification,
            'rate_label' => $plan->rate_label,
            'rate_suffix' => $plan->rate_suffix,
            'is_featured' => (bool) $plan->is_featured,
            'style' => $plan->style,
            'cells' => $plan->cells ?? [],
            'features' => array_values($plan->features ?? []),
            'volume_min' => self::number($plan->volume_min),
            'volume_max' => self::number($plan->volume_max),
            'subscription_amount' => self::number($plan->subscription_amount),
            'percent_rate' => self::number($plan->percent_rate),
            'percent_rate_max' => self::number($plan->percent_rate_max),
            'fixed_amount' => self::number($plan->fixed_amount),
            'min_fee' => self::number($plan->min_fee),
            'cap_fee' => self::number($plan->cap_fee),
            'listing_amount' => self::number($plan->listing_amount),
            'lead_amount' => self::number($plan->lead_amount),
            'position' => $plan->position,
            'is_active' => (bool) $plan->is_active,
        ];

        if ($admin) {
            $payload['market'] = $plan->market ? [
                'id' => $plan->market->id,
                'slug' => $plan->market->slug,
                'label' => $plan->market->label,
            ] : null;
            $payload['tier'] = $plan->tier ? [
                'id' => $plan->tier->id,
                'slug' => $plan->tier->slug,
                'name' => $plan->tier->name,
            ] : null;
            $payload['updated_at'] = $plan->updated_at?->toIso8601String();
        }

        return $payload;
    }

    /**
     * @return array<string, mixed>
     */
    public static function faqPayload(PpfFaq $faq): array
    {
        return [
            'id' => $faq->id,
            'question' => $faq->question,
            'answer' => $faq->answer,
            'position' => $faq->position,
            'is_active' => (bool) $faq->is_active,
            'updated_at' => $faq->updated_at?->toIso8601String(),
        ];
    }

    private static function number(mixed $value): ?float
    {
        return $value === null ? null : (float) $value;
    }

    private static function isCompanyRevenueLine(mixed $line): bool
    {
        if (! is_array($line)) {
            return false;
        }

        $label = strtolower((string) ($line['label'] ?? ''));

        return str_contains($label, 'company revenue')
            || str_contains($label, 'ingresos de la empresa');
    }
}
