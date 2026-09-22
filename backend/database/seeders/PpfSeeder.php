<?php

namespace Database\Seeders;

use App\Models\PpfFaq;
use App\Models\PpfMarket;
use App\Models\PpfPlan;
use App\Models\PpfSetting;
use App\Models\PpfTier;
use Illuminate\Database\Seeder;

/**
 * Publishes the illustrative Platform Participation Fee schedule.
 *
 * Rows here are the copy and proposed rates shown on the public page.
 * They are not live transaction commissions.
 */
class PpfSeeder extends Seeder
{
    public function run(): void
    {
        $this->settings();
        $tiers = $this->tiers();
        $this->markets($tiers);
        $this->faqs();
    }

    private function settings(): void
    {
        PpfSetting::query()->updateOrCreate(['id' => 1], [
            'is_published' => true,
            'copy' => [
                'eyebrow' => 'Transparent partner pricing',
                'title' => 'Platform Participation Fees',
                'subtitle' => 'Simple, market-specific pricing for the tools, customer reach, transaction support, and partner services that help your business grow on AsBeez.',
                'primary_cta_label' => 'Find Your Tier',
                'primary_cta_href' => '#platform-fees/estimator',
                'secondary_cta_label' => 'Apply as a Partner',
                'secondary_cta_href' => '#sell-on-asbeez',
                'trust_line' => 'No surprise deductions. Review your estimated fees before accepting a transaction.',
                'aside_title' => 'Proposed fee schedule',
                'aside_subtitle' => 'Illustrative rates for planning',
                'distinction_title' => 'Know what the PPF covers',
                'distinction_body' => 'The PPF pays for AsBeez platform participation and services. Payment processing, taxes, government or supplier charges, and optional promotions may be separate. Regulated markets may use subscriptions, listings, or qualified-lead fees instead of a transaction percentage.',
                'tiers_eyebrow' => 'One framework, market-specific fees',
                'tiers_title' => 'Four tiers that grow with you',
                'tiers_subtitle' => 'Qualification thresholds and charges change by market. Your exact rate is confirmed before enrollment or transaction acceptance.',
                'pricing_eyebrow' => 'Proposed pricing',
                'pricing_title' => 'Compare participation fees',
                'estimator_eyebrow' => 'Illustrative calculator',
                'estimator_title' => 'Estimate Your Fees',
                'estimator_subtitle' => 'Adjust the inputs to compare a representative monthly cost.',
                'estimator_disclaimer' => 'This estimate is illustrative and is not a quote or contract. Final fees depend on your market, category, jurisdiction, agreement, and transaction details.',
                'anatomy_eyebrow' => 'Clear by design',
                'anatomy_title' => 'Understand every line of your fee',
                'rewards_eyebrow' => 'From fee to rewards',
                'rewards_title' => 'How the PPF becomes Reward Points',
                'rewards_body' => 'Reward Points are based on the Platform Participation Fee, not the sticker price the member paid. After a qualified transaction, a share of that PPF funds the Compensation Fund. The Compensation Fund is what creates member Reward Points.',
                'rewards_company_label' => 'Company revenue',
                'rewards_fund_label' => 'Compensation Fund',
                'rewards_points_label' => 'Member Reward Points',
                'rewards_conversion_note' => 'Current conversion: 10 RP = 10 AHC = $1.00 of Compensation Fund. Subscriptions, processing, taxes, and listing or lead charges are not converted into Reward Points.',
                'faq_eyebrow' => 'Fee help',
                'faq_title' => 'Frequently asked questions',
                'cta_title' => 'Choose the fee structure that grows with your business',
                'cta_body' => 'Start with the market and tier that fit today. As your business grows, AsBeez gives you a clear path to lower rates and stronger partner tools.',
                'cta_primary_label' => 'Apply as a Partner',
                'cta_primary_href' => '#sell-on-asbeez',
                'cta_secondary_label' => 'Talk to Partner Support',
                'cta_secondary_href' => '#how-it-works',
            ],
            'anatomy_items' => [
                ['title' => 'Participation fee', 'body' => 'Market-specific platform charge.'],
                ['title' => 'Subscription', 'body' => 'Monthly plan access when applicable.'],
                ['title' => 'Processing', 'body' => 'Shown separately from AsBeez PPF.'],
                ['title' => 'Listing or lead', 'body' => 'Used by regulated and high-value markets.'],
                ['title' => 'Taxes and charges', 'body' => 'Government and supplier amounts are itemized.'],
                ['title' => 'Optional promotion', 'body' => 'Never bundled without a clear label.'],
                ['title' => 'Reward Points', 'body' => 'Created from the Compensation Fund share of the PPF, never from the item price.'],
            ],
            'statement' => [
                'title' => 'Example statement',
                'reference' => 'Order ABZ-10482',
                'status' => 'Completed',
                'note' => 'Illustrative only. Tax and shipping handling depends on transaction structure and jurisdiction.',
                'lines' => [
                    ['label' => 'Merchandise subtotal', 'value' => '$100.00'],
                    ['label' => 'Tax collected', 'value' => '$8.25'],
                    ['label' => 'Shipping', 'value' => '$10.00'],
                    ['label' => 'PPF base', 'value' => '$100.00', 'tone' => 'divider'],
                    ['label' => 'Hive Growth PPF (8%)', 'value' => '−$8.00', 'tone' => 'debit'],
                    ['label' => 'Processing', 'value' => '−$3.73', 'tone' => 'debit'],
                    ['label' => 'Estimated partner payout', 'value' => '$106.52', 'tone' => 'total'],
                    ['label' => 'Compensation Fund (60% of PPF)', 'value' => '$4.80', 'tone' => 'divider'],
                    ['label' => 'Member Reward Points', 'value' => '48 RP', 'tone' => 'total'],
                ],
            ],
            'movement' => [
                'eyebrow' => 'Prospective qualification',
                'title' => 'Know when your tier changes',
                'body' => 'Qualification generally uses your previous three completed months and applies to the next period. Seasonal businesses may be reviewed using trailing annual volume. Enterprise terms require approval and a signed agreement.',
                'sample_label' => 'Sample Shop partner',
                'current_label' => '$21,400 of $25,000',
                'progress_label' => '86% to Hive Pro',
                'remaining_label' => '$3,600 remaining',
                'current_tier' => 'Current: Hive Growth',
                'progress' => 86,
            ],
            'cta_links' => [
                ['label' => 'Partner Agreement', 'href' => '#how-it-works'],
                ['label' => 'Fee Policy', 'href' => '#platform-fees'],
                ['label' => 'Refund and Dispute Policy', 'href' => '#how-it-works'],
                ['label' => 'Payment Processing Disclosure', 'href' => '#platform-fees'],
                ['label' => 'Compliance Notices', 'href' => '#how-it-works'],
            ],
            'processing_percent' => 2.9,
            'processing_fixed' => 0.30,
            'company_percent' => 40,
            'compensation_percent' => 60,
            'rp_per_dollar' => 10,
            'example_ppf_amount' => 8,
        ]);
    }

    /**
     * @return array<string, PpfTier>
     */
    private function tiers(): array
    {
        $rows = [
            ['slug' => 'hive-start', 'badge' => 'ENTRY', 'name' => 'Hive Start', 'summary' => 'Affordable entry with no or minimal commitment.', 'emphasis' => PpfTier::EMPHASIS_DEFAULT, 'position' => 1],
            ['slug' => 'hive-growth', 'badge' => 'GROWING', 'name' => 'Hive Growth', 'summary' => 'Lower fees, analytics, and expanded selling tools.', 'emphasis' => PpfTier::EMPHASIS_FEATURED, 'position' => 2],
            ['slug' => 'hive-pro', 'badge' => 'ADVANCED', 'name' => 'Hive Pro', 'summary' => 'Advanced tools, priority support, and lower rates.', 'emphasis' => PpfTier::EMPHASIS_DARK, 'position' => 3],
            ['slug' => 'enterprise', 'badge' => 'CUSTOM', 'name' => 'Enterprise', 'summary' => 'Negotiated pricing, integrations, SLAs, and account management.', 'emphasis' => PpfTier::EMPHASIS_CUSTOM, 'position' => 4],
        ];

        $tiers = [];

        foreach ($rows as $row) {
            $tiers[$row['slug']] = PpfTier::query()->updateOrCreate(
                ['slug' => $row['slug']],
                $row + ['is_active' => true],
            );
        }

        return $tiers;
    }

    /**
     * @param  array<string, PpfTier>  $tiers
     */
    private function markets(array $tiers): void
    {
        $this->shop($tiers);
        $this->digital($tiers);
        $this->services($tiers);
        $this->realEstate($tiers);
        $this->automotive($tiers);
        $this->insurance($tiers);
        $this->travel($tiers);
    }

    /**
     * @param  array<string, PpfTier>  $tiers
     */
    private function shop(array $tiers): void
    {
        $market = $this->market('shop', [
            'label' => 'Shop',
            'subtitle' => 'Physical Products',
            'description' => 'For merchants, manufacturers, wholesalers, artisans, and local sellers. PPF applies to item price after seller-funded discounts; stated tax and shipping are excluded.',
            'has_cards' => true,
            'columns' => $this->columns(['tier' => 'Tier', 'qualification' => 'Qualification', 'subscription' => 'Subscription', 'ppf' => 'PPF', 'minimum' => 'Minimum', 'cap' => 'Cap']),
            'example_note' => 'Example: A $100 item on Hive Growth produces an $8.00 PPF.',
            'upgrade_note' => 'Upgrade guidance: Growth begins to offset its subscription at roughly $1,950 monthly GMV compared with Start.',
            'position' => 1,
        ]);

        $this->syncPlans($market, [
            $this->gmvPlan($tiers['hive-start'], 'Hive Start', 'Under $5,000 monthly GMV', '10%', [
                'qualification' => 'Under $5k GMV', 'subscription' => '$0', 'ppf' => '10%', 'minimum' => '$0.30', 'cap' => '$100',
            ], ['payout' => 'T+7'], 0, 5000, 0, 10, 0.30, 100, 1),
            $this->gmvPlan($tiers['hive-growth'], 'Hive Growth', '$5,000–$25,000 monthly GMV', '8%', [
                'qualification' => '$5k–$25k', 'subscription' => '$39/mo', 'ppf' => '8%', 'minimum' => '$0.30', 'cap' => '$100',
            ], ['payout' => 'T+5'], 5000, 25000, 39, 8, 0.30, 100, 2, featured: true),
            $this->gmvPlan($tiers['hive-pro'], 'Hive Pro', '$25,000–$100,000 monthly GMV', '6%', [
                'qualification' => '$25k–$100k', 'subscription' => '$149/mo', 'ppf' => '6%', 'minimum' => '$0.25', 'cap' => '$75',
            ], ['payout' => 'T+3'], 25000, 100000, 149, 6, 0.25, 75, 3, style: PpfPlan::STYLE_DARK),
            $this->enterprisePlan($tiers['enterprise'], 'Enterprise', 'Over $100,000 monthly GMV', '4%–6%', [
                'qualification' => 'Over $100k', 'subscription' => 'Custom', 'ppf' => '4%–6%', 'minimum' => 'Negotiated', 'cap' => 'Negotiated',
            ], ['Account manager', 'Custom integrations', 'Negotiated payout', 'Volume terms'], 100000, null, 4, 6, 4),
        ]);
    }

    /**
     * @param  array<string, PpfTier>  $tiers
     */
    private function digital(array $tiers): void
    {
        $market = $this->market('digital', [
            'label' => 'Digital',
            'subtitle' => 'Digital Products',
            'description' => 'For creators, publishers, software vendors, educators, and template sellers. Fees apply to the license or access price after creator discounts, excluding tax.',
            'columns' => $this->columns(['tier' => 'Tier', 'qualification' => 'Qualification', 'subscription' => 'Subscription', 'ppf' => 'PPF + fixed', 'cap' => 'Cap', 'included' => 'Included']),
            'example_note' => 'Example: A $50 digital product on Hive Growth produces a $5.20 PPF before payment processing.',
            'position' => 2,
        ]);

        $this->syncPlans($market, [
            $this->gmvPlan($tiers['hive-start'], 'Hive Start', 'Under $2,000 monthly GMV', '12% + $0.25', [
                'qualification' => 'Under $2k GMV', 'subscription' => '$0', 'ppf' => '12% + $0.25', 'cap' => '$75', 'included' => 'Hosting, secure delivery, licenses',
            ], [], 0, 2000, 0, 12, null, 75, 1, fixed: 0.25),
            $this->gmvPlan($tiers['hive-growth'], 'Hive Growth', '$2,000–$10,000 monthly GMV', '10% + $0.20', [
                'qualification' => '$2k–$10k', 'subscription' => '$29/mo', 'ppf' => '10% + $0.20', 'cap' => '$60', 'included' => 'Affiliates, coupons, analytics',
            ], [], 2000, 10000, 29, 10, null, 60, 2, featured: true, fixed: 0.20),
            $this->gmvPlan($tiers['hive-pro'], 'Hive Pro', '$10,000–$50,000 monthly GMV', '8% + $0.15', [
                'qualification' => '$10k–$50k', 'subscription' => '$99/mo', 'ppf' => '8% + $0.15', 'cap' => '$50', 'included' => 'API, bundles, priority review',
            ], [], 10000, 50000, 99, 8, null, 50, 3, fixed: 0.15),
            $this->enterprisePlan($tiers['enterprise'], 'Enterprise', 'Over $50,000 monthly GMV', '5%–8% + custom', [
                'qualification' => 'Over $50k', 'subscription' => 'Custom', 'ppf' => '5%–8% + custom', 'cap' => '$40/custom', 'included' => 'SLA and bulk licensing',
            ], [], 50000, null, 5, 8, 4, cap: 40),
        ]);
    }

    /**
     * @param  array<string, PpfTier>  $tiers
     */
    private function services(array $tiers): void
    {
        $market = $this->market('services', [
            'label' => 'Services',
            'subtitle' => 'Professional Services',
            'description' => 'For freelancers, contractors, professionals, agencies, and local businesses. Fees apply to funded milestones or booking amounts released to the provider.',
            'columns' => $this->columns(['tier' => 'Tier', 'qualification' => 'Qualification', 'subscription' => 'Subscription', 'ppf' => 'PPF', 'minimum' => 'Minimum', 'cap' => 'Cap', 'features' => 'Features']),
            'example_note' => 'Example: A released $1,000 milestone on Hive Pro produces an $80 PPF. Taxes, tips, and approved pass-through expenses are excluded.',
            'position' => 3,
        ]);

        $this->syncPlans($market, [
            $this->gmvPlan($tiers['hive-start'], 'Hive Start', 'Under $5,000 monthly billings', '12%', [
                'qualification' => 'Under $5k billings', 'subscription' => '$0', 'ppf' => '12%', 'minimum' => '$2', 'cap' => '$750/project', 'features' => 'Milestones, messaging',
            ], [], 0, 5000, 0, 12, 2, 750, 1),
            $this->gmvPlan($tiers['hive-growth'], 'Hive Growth', '$5,000–$20,000 monthly billings', '10%', [
                'qualification' => '$5k–$20k', 'subscription' => '$49/mo', 'ppf' => '10%', 'minimum' => '$2', 'cap' => '$600', 'features' => 'Scheduling, proposals',
            ], [], 5000, 20000, 49, 10, 2, 600, 2, featured: true),
            $this->gmvPlan($tiers['hive-pro'], 'Hive Pro', '$20,000–$75,000 monthly billings', '8%', [
                'qualification' => '$20k–$75k', 'subscription' => '$149/mo', 'ppf' => '8%', 'minimum' => '$1', 'cap' => '$500', 'features' => 'Recurring billing, teams',
            ], [], 20000, 75000, 149, 8, 1, 500, 3),
            $this->enterprisePlan($tiers['enterprise'], 'Enterprise', 'Over $75,000 monthly billings', '5%–8%', [
                'qualification' => 'Over $75k', 'subscription' => 'Custom', 'ppf' => '5%–8%', 'minimum' => 'Custom', 'cap' => 'Custom', 'features' => 'API, workforce tools',
            ], [], 75000, null, 5, 8, 4),
        ]);
    }

    /**
     * @param  array<string, PpfTier>  $tiers
     */
    private function realEstate(array $tiers): void
    {
        $market = $this->market('realestate', [
            'label' => 'Real Estate',
            'description' => 'For agents, brokers, developers, property managers, and approved property-service providers.',
            'columns' => $this->columns(['tier' => 'Tier', 'partner' => 'Partner', 'subscription' => 'Subscription', 'listing' => 'Listing', 'lead' => 'Buyer / seller lead', 'capacity' => 'Capacity']),
            'example_note' => 'Example: Hive Growth with five listings and three buyer leads: $149 + $75 + $120 = $344.',
            'compliance_note' => 'Compliance: Pricing covers platform, listing, advertising, and qualified leads. Closing-contingent compensation requires a legally approved licensed arrangement.',
            'position' => 4,
        ]);

        $this->syncPlans($market, [
            $this->listingPlan($tiers['hive-start'], 'Hive Start', 'Individual agent', [
                'partner' => 'Individual agent', 'subscription' => '$49/mo', 'listing' => '$25', 'lead' => '$50 / $75', 'capacity' => '5 listings',
            ], 49, 25, 50, 1),
            $this->listingPlan($tiers['hive-growth'], 'Hive Growth', 'Team/small brokerage', [
                'partner' => 'Team/small brokerage', 'subscription' => '$149/mo', 'listing' => '$15', 'lead' => '$40 / $60', 'capacity' => '25 listings',
            ], 149, 15, 40, 2, featured: true),
            $this->listingPlan($tiers['hive-pro'], 'Hive Pro', 'Brokerage', [
                'partner' => 'Brokerage', 'subscription' => '$499/mo', 'listing' => '$5', 'lead' => '$30 / $45', 'capacity' => '150 listings',
            ], 499, 5, 30, 3),
            $this->enterprisePlan($tiers['enterprise'], 'Enterprise', 'Franchise/MLS', 'Custom', [
                'partner' => 'Franchise/MLS', 'subscription' => 'Custom', 'listing' => 'Custom', 'lead' => 'Custom', 'capacity' => 'Custom feed/API',
            ], [], null, null, null, null, 4),
        ]);
    }

    /**
     * @param  array<string, PpfTier>  $tiers
     */
    private function automotive(array $tiers): void
    {
        $market = $this->market('automotive', [
            'label' => 'Automotive',
            'description' => 'For dealers, private sellers, fleet operators, repair shops, and automotive businesses. There is no uncapped percentage of vehicle value.',
            'columns' => $this->columns(['tier' => 'Tier', 'qualification' => 'Qualification', 'subscription' => 'Subscription', 'listing' => 'Listing', 'lead' => 'Lead', 'cap' => 'Sale cap']),
            'example_note' => 'Example: Hive Growth with 20 new listings and 10 qualified leads: $199 + $300 + $250 = $749.',
            'position' => 5,
        ]);

        $this->syncPlans($market, [
            $this->listingPlan($tiers['hive-start'], 'Hive Start', 'Private/small dealer', [
                'qualification' => 'Private/small dealer', 'subscription' => '$0', 'listing' => '$39/vehicle', 'lead' => '$35', 'cap' => '$199',
            ], 0, 39, 35, 1, cap: 199),
            $this->listingPlan($tiers['hive-growth'], 'Hive Growth', 'Up to 50 vehicles', [
                'qualification' => 'Up to 50 vehicles', 'subscription' => '$199/mo', 'listing' => '$15', 'lead' => '$25', 'cap' => '$149',
            ], 199, 15, 25, 2, featured: true, cap: 149),
            $this->listingPlan($tiers['hive-pro'], 'Hive Pro', 'Up to 250', [
                'qualification' => 'Up to 250', 'subscription' => '$699/mo', 'listing' => '$5', 'lead' => '$15', 'cap' => '$99',
            ], 699, 5, 15, 3, cap: 99),
            $this->enterprisePlan($tiers['enterprise'], 'Enterprise', 'Dealer group/fleet', 'Custom', [
                'qualification' => 'Dealer group/fleet', 'subscription' => 'Custom', 'listing' => 'Custom', 'lead' => 'Custom', 'cap' => '$0–$99',
            ], [], null, null, null, null, 4),
        ]);
    }

    /**
     * @param  array<string, PpfTier>  $tiers
     */
    private function insurance(array $tiers): void
    {
        $market = $this->market('insurance', [
            'label' => 'Insurance',
            'description' => 'Technology and consent-based lead pricing for licensed producers, agencies, carriers, and approved distribution organizations.',
            'columns' => $this->columns(['tier' => 'Tier', 'partner' => 'Partner', 'subscription' => 'Subscription', 'lead' => 'Lead pricing', 'appointment' => 'Appointment', 'included' => 'Included']),
            'example_note' => 'Example: Hive Growth with ten standard $25 leads: $129 + $225 = $354.',
            'compliance_note' => 'Compliance: Premium- or commission-based compensation requires appropriate licensing, appointments, contracts, and jurisdictional approval.',
            'position' => 6,
        ]);

        $this->syncPlans($market, [
            $this->listingPlan($tiers['hive-start'], 'Hive Start', 'Licensed individual', [
                'partner' => 'Licensed individual', 'subscription' => '$39/mo', 'lead' => '$15–$60', 'appointment' => '$40–$100', 'included' => 'Verification, lead tools',
            ], 39, null, 15, 1),
            $this->listingPlan($tiers['hive-growth'], 'Hive Growth', 'Agency team', [
                'partner' => 'Agency team', 'subscription' => '$129/mo', 'lead' => '10% discount', 'appointment' => '$35–$90', 'included' => 'Routing, CRM export',
            ], 129, null, 25, 2, featured: true),
            $this->listingPlan($tiers['hive-pro'], 'Hive Pro', 'Multi-agent agency', [
                'partner' => 'Multi-agent agency', 'subscription' => '$399/mo', 'lead' => '20% discount', 'appointment' => '$30–$80', 'included' => 'API, compliance analytics',
            ], 399, null, 20, 3),
            $this->enterprisePlan($tiers['enterprise'], 'Enterprise', 'Carrier/IMO/FMO', 'Custom', [
                'partner' => 'Carrier/IMO/FMO', 'subscription' => 'Custom', 'lead' => 'Custom', 'appointment' => 'Custom', 'included' => 'Integrations and SLA',
            ], [], null, null, null, null, 4),
        ]);
    }

    /**
     * @param  array<string, PpfTier>  $tiers
     */
    private function travel(array $tiers): void
    {
        $travel = $this->market('travel', [
            'label' => 'Travel',
            'description' => 'Separate economics for accommodations, ticketing, and vehicle rentals.',
            'columns' => [],
            'footnote' => 'Travel fee bases exclude government taxes, airport charges, refundable deposits, damage, fines, fuel, tolls, and separately priced optional products.',
            'position' => 7,
        ]);

        $hotels = $this->market('hotels', [
            'parent_id' => $travel->id,
            'label' => 'Hotels',
            'description' => 'Accommodations and stays.',
            'columns' => $this->columns(['tier' => 'Tier', 'qualification' => 'Booking value', 'subscription' => 'Subscription', 'ppf' => 'Commission', 'minimum' => 'Minimum']),
            'example_note' => 'Example: A $600 eligible stay on Hive Growth produces a $66 booking PPF.',
            'position' => 1,
        ]);

        $this->syncPlans($hotels, [
            $this->gmvPlan($tiers['hive-start'], 'Hive Start', 'Under $10k', '12%', [
                'qualification' => 'Under $10k', 'subscription' => '$0', 'ppf' => '12%', 'minimum' => '$3/stay',
            ], [], 0, 10000, 0, 12, 3, null, 1),
            $this->gmvPlan($tiers['hive-growth'], 'Hive Growth', '$10k–$50k', '11%', [
                'qualification' => '$10k–$50k', 'subscription' => '$99/mo', 'ppf' => '11%', 'minimum' => '$3',
            ], [], 10000, 50000, 99, 11, 3, null, 2, featured: true),
            $this->gmvPlan($tiers['hive-pro'], 'Hive Pro', '$50k–$250k', '10%', [
                'qualification' => '$50k–$250k', 'subscription' => '$299/mo', 'ppf' => '10%', 'minimum' => '$2',
            ], [], 50000, 250000, 299, 10, 2, null, 3),
            $this->enterprisePlan($tiers['enterprise'], 'Enterprise', 'Over $250k', '7%–10%', [
                'qualification' => 'Over $250k', 'subscription' => 'Custom', 'ppf' => '7%–10%', 'minimum' => 'Custom',
            ], [], 250000, null, 7, 10, 4),
        ]);

        $flights = $this->market('flights', [
            'parent_id' => $travel->id,
            'label' => 'Flights',
            'description' => 'Fixed service fees for air ticketing.',
            'columns' => $this->columns(['plan' => 'Plan', 'domestic' => 'Domestic', 'international' => 'International', 'change' => 'Change service', 'features' => 'Features']),
            'example_note' => 'Example: A $1,200 self-service international ticket includes a separate $15 AsBeez service fee.',
            'position' => 2,
        ]);

        $this->syncPlans($flights, [
            [
                'ppf_tier_id' => $tiers['hive-start']->id,
                'name' => 'Self-Service',
                'qualification' => 'Self-service booking',
                'rate_label' => '$5 / $15',
                'cells' => ['domestic' => '$5', 'international' => '$15', 'change' => '$25 + airline', 'features' => 'Search, booking, email support'],
                'features' => [],
                'listing_amount' => 5,
                'lead_amount' => 15,
                'position' => 1,
            ],
            [
                'ppf_tier_id' => $tiers['hive-growth']->id,
                'name' => 'Assisted',
                'qualification' => 'Agent assistance',
                'rate_label' => '$15 / $30',
                'is_featured' => true,
                'cells' => ['domestic' => '$15', 'international' => '$30', 'change' => '$40 + airline', 'features' => 'Agent assistance'],
                'features' => [],
                'listing_amount' => 15,
                'lead_amount' => 30,
                'position' => 2,
            ],
            [
                'ppf_tier_id' => $tiers['hive-pro']->id,
                'name' => 'Business',
                'qualification' => 'Business travel',
                'rate_label' => '$19/user/mo',
                'cells' => ['domestic' => '$19/user/mo; $0–$5 ticket', 'international' => '$19/user/mo; $0–$5 ticket', 'change' => '$15 + airline', 'features' => 'Profiles and policy tools'],
                'features' => [],
                'subscription_amount' => 19,
                'position' => 3,
            ],
            $this->enterprisePlan($tiers['enterprise'], 'Enterprise', 'Account support', 'Custom', [
                'domestic' => 'Custom', 'international' => 'Custom', 'change' => 'Custom', 'features' => 'Account support',
            ], [], null, null, null, null, 4),
        ]);

        $cars = $this->market('cars', [
            'parent_id' => $travel->id,
            'label' => 'Car rentals',
            'description' => 'Vehicle rental bookings.',
            'columns' => $this->columns(['tier' => 'Tier', 'qualification' => 'Rental value', 'subscription' => 'Subscription', 'ppf' => 'Commission', 'cap' => 'Minimum / cap']),
            'example_note' => 'Example: A $500 eligible rental on Hive Pro produces a $40 booking PPF.',
            'position' => 3,
        ]);

        $this->syncPlans($cars, [
            $this->gmvPlan($tiers['hive-start'], 'Hive Start', 'Under $10k', '10%', [
                'qualification' => 'Under $10k', 'subscription' => '$0', 'ppf' => '10%', 'cap' => '$3 / $150',
            ], [], 0, 10000, 0, 10, 3, 150, 1),
            $this->gmvPlan($tiers['hive-growth'], 'Hive Growth', '$10k–$50k', '9%', [
                'qualification' => '$10k–$50k', 'subscription' => '$79/mo', 'ppf' => '9%', 'cap' => '$3 / $125',
            ], [], 10000, 50000, 79, 9, 3, 125, 2, featured: true),
            $this->gmvPlan($tiers['hive-pro'], 'Hive Pro', '$50k–$200k', '8%', [
                'qualification' => '$50k–$200k', 'subscription' => '$249/mo', 'ppf' => '8%', 'cap' => '$2 / $100',
            ], [], 50000, 200000, 249, 8, 2, 100, 3),
            $this->enterprisePlan($tiers['enterprise'], 'Enterprise', 'Over $200k', '5%–8%', [
                'qualification' => 'Over $200k', 'subscription' => 'Custom', 'ppf' => '5%–8%', 'cap' => 'Custom',
            ], [], 200000, null, 5, 8, 4),
        ]);
    }

    private function faqs(): void
    {
        $rows = [
            ['What is a Platform Participation Fee?', 'The PPF is the market-specific amount AsBeez charges for platform access and services such as discovery, transaction tools, and partner support.'],
            ['Is payment processing included in the PPF?', 'Not unless your agreement explicitly says so. Processing is normally shown as a separate line item.'],
            ['Are taxes included when the PPF is calculated?', 'Separately stated government taxes are generally excluded from the PPF base. Market and jurisdiction rules may vary.'],
            ['How does AsBeez determine my tier?', 'Your previous three completed months generally determine the tier that applies prospectively to the next period.'],
            ['Can I change tiers voluntarily?', 'Eligible partners may elect a paid tier before a billing period begins. Downgrades take effect under the applicable plan terms.'],
            ['What happens when an order or booking is refunded?', 'Variable fees are generally credited proportionately on eligible refunds. Fixed, processing, listing, or lead costs may follow different rules.'],
            ['Are fees different by category?', 'They may be. Category margin, risk, support requirements, and regulation can affect the approved fee schedule.'],
            ['Why do Real Estate and Insurance use listing or lead fees?', 'These markets have licensing and compensation restrictions, so AsBeez uses transparent technology, advertising, listing, and consent-based lead charges.'],
            ['Why do flights use fixed service fees?', 'Airfare margins and supplier compensation vary, making a disclosed fixed service fee clearer and more predictable.'],
            ['Can enterprise partners negotiate pricing?', 'Yes. Custom terms require volume, risk, finance, compliance, and contract approval.'],
            ['Will existing transactions change after a pricing update?', 'No. Accepted transactions retain the fee schedule version that applied when they were created, subject to the governing agreement.'],
            ['Where can I dispute a fee?', 'Open the transaction in Partner Center and select Dispute fee, or contact Partner Support with the transaction reference.'],
            ['How do members earn Reward Points from a PPF?', 'Reward Points are created from the Compensation Fund share of the Platform Participation Fee, not from the item price. A published example is 60% of the PPF funding the Compensation Fund, and 10 RP for each $1.00 in that fund.'],
            ['Are subscriptions or processing converted into Reward Points?', 'No. Only the qualified Platform Participation Fee enters the allocation that creates Reward Points. Subscriptions, payment processing, taxes, shipping, and listing or lead charges stay separate.'],
        ];

        foreach ($rows as $index => [$question, $answer]) {
            PpfFaq::query()->updateOrCreate(
                ['question' => $question],
                ['answer' => $answer, 'position' => $index + 1, 'is_active' => true],
            );
        }
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function market(string $slug, array $attributes): PpfMarket
    {
        return PpfMarket::query()->updateOrCreate(
            ['slug' => $slug],
            $attributes + [
                'slug' => $slug,
                'has_cards' => $attributes['has_cards'] ?? false,
                'is_active' => true,
            ],
        );
    }

    /**
     * @param  array<string, string>  $columns
     * @return list<array{key: string, label: string}>
     */
    private function columns(array $columns): array
    {
        return collect($columns)
            ->map(fn (string $label, string $key) => ['key' => $key, 'label' => $label])
            ->values()
            ->all();
    }

    /**
     * @param  list<array<string, mixed>>  $plans
     */
    private function syncPlans(PpfMarket $market, array $plans): void
    {
        $kept = [];

        foreach ($plans as $plan) {
            $record = PpfPlan::query()->updateOrCreate(
                [
                    'ppf_market_id' => $market->id,
                    'name' => $plan['name'],
                ],
                $plan + [
                    'ppf_market_id' => $market->id,
                    'is_active' => true,
                    'is_featured' => $plan['is_featured'] ?? false,
                    'style' => $plan['style'] ?? PpfPlan::STYLE_DEFAULT,
                    'cells' => $plan['cells'] ?? [],
                    'features' => $plan['features'] ?? [],
                ],
            );

            $kept[] = $record->id;
        }

        PpfPlan::query()
            ->where('ppf_market_id', $market->id)
            ->whereNotIn('id', $kept)
            ->delete();
    }

    /**
     * @param  array<string, string>  $cells
     * @param  array<string, string>  $cardCells
     * @return array<string, mixed>
     */
    private function gmvPlan(
        PpfTier $tier,
        string $name,
        string $qualification,
        string $rateLabel,
        array $cells,
        array $cardCells,
        ?float $volumeMin,
        ?float $volumeMax,
        ?float $subscription,
        ?float $percent,
        ?float $minFee,
        ?float $capFee,
        int $position,
        bool $featured = false,
        string $style = PpfPlan::STYLE_DEFAULT,
        ?float $fixed = null,
    ): array {
        return [
            'ppf_tier_id' => $tier->id,
            'name' => $name,
            'qualification' => $qualification,
            'rate_label' => $rateLabel,
            'rate_suffix' => 'PPF',
            'is_featured' => $featured,
            'style' => $featured ? PpfPlan::STYLE_FEATURED : $style,
            'cells' => $cells + $cardCells,
            'features' => [],
            'volume_min' => $volumeMin,
            'volume_max' => $volumeMax,
            'subscription_amount' => $subscription,
            'percent_rate' => $percent,
            'min_fee' => $minFee,
            'cap_fee' => $capFee,
            'fixed_amount' => $fixed,
            'position' => $position,
        ];
    }

    /**
     * @param  array<string, string>  $cells
     * @param  list<string>  $features
     * @return array<string, mixed>
     */
    private function enterprisePlan(
        PpfTier $tier,
        string $name,
        string $qualification,
        string $rateLabel,
        array $cells,
        array $features,
        ?float $volumeMin,
        ?float $volumeMax,
        ?float $percentMin,
        ?float $percentMax,
        int $position,
        ?float $cap = null,
    ): array {
        return [
            'ppf_tier_id' => $tier->id,
            'name' => $name,
            'qualification' => $qualification,
            'rate_label' => $rateLabel,
            'rate_suffix' => null,
            'style' => PpfPlan::STYLE_DEFAULT,
            'cells' => $cells,
            'features' => $features,
            'volume_min' => $volumeMin,
            'volume_max' => $volumeMax,
            'percent_rate' => $percentMin,
            'percent_rate_max' => $percentMax,
            'cap_fee' => $cap,
            'position' => $position,
        ];
    }

    /**
     * @param  array<string, string>  $cells
     * @return array<string, mixed>
     */
    private function listingPlan(
        PpfTier $tier,
        string $name,
        string $qualification,
        array $cells,
        ?float $subscription,
        ?float $listing,
        ?float $lead,
        int $position,
        bool $featured = false,
        ?float $cap = null,
    ): array {
        return [
            'ppf_tier_id' => $tier->id,
            'name' => $name,
            'qualification' => $qualification,
            'rate_label' => $cells['subscription'] ?? $cells['lead'] ?? null,
            'is_featured' => $featured,
            'style' => $featured ? PpfPlan::STYLE_FEATURED : PpfPlan::STYLE_DEFAULT,
            'cells' => $cells,
            'features' => [],
            'subscription_amount' => $subscription,
            'listing_amount' => $listing,
            'lead_amount' => $lead,
            'cap_fee' => $cap,
            'position' => $position,
        ];
    }
}
