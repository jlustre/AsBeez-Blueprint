<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * Singleton copy for the public Platform Participation Fee page.
 */
#[Fillable([
    'is_published', 'copy', 'anatomy_items', 'statement', 'movement',
    'cta_links', 'processing_percent', 'processing_fixed',
    'company_percent', 'compensation_percent', 'rp_per_dollar', 'example_ppf_amount',
])]
class PpfSetting extends Model
{
    /** @var list<string> */
    public const COPY_KEYS = [
        'eyebrow', 'title', 'subtitle',
        'primary_cta_label', 'primary_cta_href',
        'secondary_cta_label', 'secondary_cta_href',
        'trust_line',
        'aside_title', 'aside_subtitle',
        'distinction_title', 'distinction_body',
        'tiers_eyebrow', 'tiers_title', 'tiers_subtitle',
        'pricing_eyebrow', 'pricing_title',
        'estimator_eyebrow', 'estimator_title', 'estimator_subtitle', 'estimator_disclaimer',
        'anatomy_eyebrow', 'anatomy_title',
        'rewards_eyebrow', 'rewards_title', 'rewards_body',
        'rewards_company_label', 'rewards_fund_label', 'rewards_points_label',
        'rewards_conversion_note',
        'faq_eyebrow', 'faq_title',
        'cta_title', 'cta_body',
        'cta_primary_label', 'cta_primary_href',
        'cta_secondary_label', 'cta_secondary_href',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'copy' => 'array',
            'anatomy_items' => 'array',
            'statement' => 'array',
            'movement' => 'array',
            'cta_links' => 'array',
            'processing_percent' => 'decimal:3',
            'processing_fixed' => 'decimal:2',
            'company_percent' => 'decimal:3',
            'compensation_percent' => 'decimal:3',
            'rp_per_dollar' => 'decimal:3',
            'example_ppf_amount' => 'decimal:2',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function defaults(): array
    {
        return [
            'is_published' => false,
            'copy' => array_fill_keys(self::COPY_KEYS, ''),
            'anatomy_items' => [],
            'statement' => [
                'title' => '',
                'reference' => '',
                'status' => '',
                'note' => '',
                'lines' => [],
            ],
            'movement' => [
                'eyebrow' => '',
                'title' => '',
                'body' => '',
                'sample_label' => '',
                'current_label' => '',
                'progress_label' => '',
                'remaining_label' => '',
                'progress' => 0,
            ],
            'cta_links' => [],
            'processing_percent' => null,
            'processing_fixed' => null,
            'company_percent' => null,
            'compensation_percent' => null,
            'rp_per_dollar' => null,
            'example_ppf_amount' => null,
        ];
    }

    public static function current(): self
    {
        return static::query()->first() ?? static::make(self::defaults());
    }
}
