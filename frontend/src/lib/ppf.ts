import { apiRequest } from './api';

export type PpfCopy = {
    eyebrow: string;
    title: string;
    subtitle: string;
    primary_cta_label: string;
    primary_cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
    trust_line: string;
    aside_title: string;
    aside_subtitle: string;
    distinction_title: string;
    distinction_body: string;
    tiers_eyebrow: string;
    tiers_title: string;
    tiers_subtitle: string;
    pricing_eyebrow: string;
    pricing_title: string;
    estimator_eyebrow: string;
    estimator_title: string;
    estimator_subtitle: string;
    estimator_disclaimer: string;
    anatomy_eyebrow: string;
    anatomy_title: string;
    rewards_eyebrow: string;
    rewards_title: string;
    rewards_body: string;
    rewards_company_label?: string;
    rewards_fund_label: string;
    rewards_points_label: string;
    rewards_conversion_note: string;
    faq_eyebrow: string;
    faq_title: string;
    cta_title: string;
    cta_body: string;
    cta_primary_label: string;
    cta_primary_href: string;
    cta_secondary_label: string;
    cta_secondary_href: string;
};

export type PpfAnatomyItem = { title: string; body: string };
export type PpfStatementLine = { label: string; value: string; tone?: string };
export type PpfCtaLink = { label: string; href: string };
export type PpfColumn = { key: string; label: string };

export type PpfStatement = {
    title: string;
    reference: string;
    status: string;
    note: string;
    lines: PpfStatementLine[];
};

export type PpfMovement = {
    eyebrow: string;
    title: string;
    body: string;
    sample_label: string;
    current_label: string;
    progress_label: string;
    remaining_label: string;
    current_tier?: string;
    progress: number;
};

export type PpfSettings = {
    is_published: boolean;
    copy: PpfCopy;
    anatomy_items: PpfAnatomyItem[];
    statement: PpfStatement;
    movement: PpfMovement;
    cta_links: PpfCtaLink[];
    processing_percent: number | null;
    processing_fixed: number | null;
    company_percent?: number | null;
    compensation_percent: number | null;
    rp_per_dollar: number | null;
    example_ppf_amount: number | null;
    updated_at?: string | null;
};

export type PpfTier = {
    id: number;
    slug: string;
    badge: string;
    name: string;
    summary: string | null;
    emphasis: 'default' | 'featured' | 'dark' | 'custom';
    position: number;
    is_active: boolean;
    plan_count?: number;
    updated_at?: string | null;
};

export type PpfPlan = {
    id: number;
    ppf_market_id: number;
    ppf_tier_id: number | null;
    name: string;
    qualification: string | null;
    rate_label: string | null;
    rate_suffix: string | null;
    is_featured: boolean;
    style: 'default' | 'featured' | 'dark';
    cells: Record<string, string>;
    features: string[];
    volume_min: number | null;
    volume_max: number | null;
    subscription_amount: number | null;
    percent_rate: number | null;
    percent_rate_max: number | null;
    fixed_amount: number | null;
    min_fee: number | null;
    cap_fee: number | null;
    listing_amount: number | null;
    lead_amount: number | null;
    position: number;
    is_active: boolean;
    market?: { id: number; slug: string; label: string } | null;
    tier?: { id: number; slug: string; name: string } | null;
    updated_at?: string | null;
};

export type PpfMarket = {
    id: number;
    parent_id: number | null;
    slug: string;
    label: string;
    subtitle: string | null;
    description: string | null;
    has_cards: boolean;
    columns: PpfColumn[];
    example_note: string | null;
    upgrade_note: string | null;
    compliance_note: string | null;
    footnote: string | null;
    position: number;
    is_active: boolean;
    plans: PpfPlan[];
    children?: PpfMarket[];
    parent?: { id: number; slug: string; label: string } | null;
    plan_count?: number;
    child_count?: number;
    updated_at?: string | null;
};

export type PpfFaq = {
    id: number;
    question: string;
    answer: string;
    position: number;
    is_active: boolean;
    updated_at?: string | null;
};

export type PpfPayload = {
    published: boolean;
    settings: PpfSettings | null;
    tiers: PpfTier[];
    markets: PpfMarket[];
    faqs: PpfFaq[];
    stats: { markets: number; common_tiers: number };
};

export const emptyPpf: PpfPayload = {
    published: false,
    settings: null,
    tiers: [],
    markets: [],
    faqs: [],
    stats: { markets: 0, common_tiers: 0 },
};

export const ppfApi = {
    async show() {
        return await apiRequest<PpfPayload>('/ppf');
    },
};

export type PpfAllocation = {
    company: number;
    fund: number;
    points: number;
};

export type PpfEstimate = {
    participation: number;
    subscription: number;
    processing: number;
    total: number;
    proceeds: number;
    effectiveRate: number | null;
    savings: number | null;
    company: number;
    fund: number;
    points: number;
};

export function allocatePpf(
    ppf: number,
    companyPercent: number,
    compensationPercent: number,
    rpPerDollar: number,
): PpfAllocation {
    const amount = Math.max(0, ppf);
    const company = amount * (companyPercent / 100);
    const fund = amount * (compensationPercent / 100);

    return {
        company,
        fund,
        points: fund * rpPerDollar,
    };
}

export function estimatePlan(
    plan: PpfPlan,
    volume: number,
    transactions: number,
    processingPercent: number,
    processingFixed: number,
    compare?: PpfPlan | null,
    companyPercent = 0,
    compensationPercent = 0,
    rpPerDollar = 0,
): PpfEstimate {
    const count = Math.max(0, transactions);
    const sales = Math.max(0, volume);
    const participation = planParticipation(plan, sales, count);
    const subscription = plan.subscription_amount ?? 0;
    const processing = sales * (processingPercent / 100) + count * processingFixed;
    const total = participation + subscription + processing;
    const compareTotal = compare
        ? planParticipation(compare, sales, count) + (compare.subscription_amount ?? 0) + processing
        : null;
    const allocation = allocatePpf(participation, companyPercent, compensationPercent, rpPerDollar);

    return {
        participation,
        subscription,
        processing,
        total,
        proceeds: Math.max(0, sales - participation - processing),
        effectiveRate: sales > 0 ? (participation / sales) * 100 : null,
        savings: compareTotal === null ? null : compareTotal - (participation + subscription),
        ...allocation,
    };
}

function planParticipation(plan: PpfPlan, volume: number, transactions: number): number {
    if (plan.percent_rate !== null || plan.fixed_amount !== null) {
        let amount = volume * ((plan.percent_rate ?? 0) / 100) + transactions * (plan.fixed_amount ?? 0);

        if (plan.min_fee !== null) {
            amount = Math.max(amount, plan.min_fee * Math.max(transactions, 1));
        }

        if (plan.cap_fee !== null && transactions > 0) {
            amount = Math.min(amount, plan.cap_fee * transactions);
        }

        return amount;
    }

    return (plan.listing_amount ?? 0) * transactions + (plan.lead_amount ?? 0) * transactions;
}

export function money(amount: number, locale: string): string {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(amount);
}
