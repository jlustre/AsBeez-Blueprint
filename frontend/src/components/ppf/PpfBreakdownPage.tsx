import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from '../../i18n';
import { emptyHome, homeApi, type HomeCategory } from '../../lib/home';
import {
  allocatePpf,
  emptyPpf,
  estimatePlan,
  money,
  ppfApi,
  type PpfCopy,
  type PpfFaq,
  type PpfMarket,
  type PpfMovement,
  type PpfPayload,
  type PpfPlan,
  type PpfSettings,
  type PpfStatement,
} from '../../lib/ppf';
import { Header } from '../home/Header';
import { Footer } from '../home/partials';
import { PageLoader } from '../ui/Spinner';

function selectedFromHash(): string {
  return window.location.hash.replace(/^#platform-fees\/?/, '');
}

/**
 * The public fee schedule.
 *
 * `embedded` drops the marketplace header and footer and the full-page
 * wrapper, so the vendor shell can render this inside its own sidebar and top
 * bar rather than nesting a second set of chrome. The body is identical
 * either way — the same sections, the same data.
 */
export function PpfBreakdownPage({ embedded = false }: { embedded?: boolean } = {}) {
  const { t, locale } = useTranslation();
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [payload, setPayload] = useState<PpfPayload>(emptyPpf);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marketSlug, setMarketSlug] = useState('');
  const [scheduleSlug, setScheduleSlug] = useState('');
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [volume, setVolume] = useState(10000);
  const [transactions, setTransactions] = useState(100);
  const [estimatorMarket, setEstimatorMarket] = useState('');
  const [estimatorPlan, setEstimatorPlan] = useState('');
  const [section, setSection] = useState(selectedFromHash);

  useEffect(() => {
    const onHashChange = () => setSection(selectedFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (loading || !['estimator', 'apply', 'rewards'].includes(section)) {
      return;
    }

    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [section, loading]);

  useEffect(() => {
    let cancelled = false;

    // The home payload feeds the public header only; embedded, nothing reads
    // it, so the request is skipped rather than fetched and discarded.
    Promise.all([embedded ? Promise.resolve(emptyHome) : homeApi.show(), ppfApi.show()])
      .then(([home, ppf]) => {
        if (cancelled) {
          return;
        }

        setCategories(home.categories);
        setPayload(ppf);
        setMarketSlug((current) => current || ppf.markets[0]?.slug || '');
        setEstimatorMarket((current) => current || ppf.markets[0]?.slug || '');
      })
      .catch(() => {
        if (!cancelled) {
          setCategories(emptyHome.categories);
          setError(t('ppf.loadFailed'));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [t, embedded]);

  const market = payload.markets.find((item) => item.slug === marketSlug) ?? payload.markets[0] ?? null;
  const schedule = useMemo(() => {
    if (!market) {
      return null;
    }

    if (!market.children?.length) {
      return market;
    }

    return market.children.find((item) => item.slug === scheduleSlug) ?? market.children[0] ?? market;
  }, [market, scheduleSlug]);

  const estimatorMarkets = useMemo(() => flattenMarkets(payload.markets), [payload.markets]);
  const activeEstimatorMarket = estimatorMarkets.find((item) => item.slug === estimatorMarket) ?? estimatorMarkets[0] ?? null;
  const activeEstimatorPlan = activeEstimatorMarket?.plans.find((plan) => String(plan.id) === estimatorPlan)
    ?? activeEstimatorMarket?.plans.find((plan) => plan.is_featured)
    ?? activeEstimatorMarket?.plans[0]
    ?? null;
  const comparePlan = activeEstimatorMarket?.plans[0] && activeEstimatorPlan && activeEstimatorMarket.plans[0].id !== activeEstimatorPlan.id
    ? activeEstimatorMarket.plans[0]
    : null;
  const estimate = activeEstimatorPlan
    ? estimatePlan(
      activeEstimatorPlan,
      volume,
      transactions,
      payload.settings?.processing_percent ?? 2.9,
      payload.settings?.processing_fixed ?? 0.3,
      comparePlan,
      payload.settings?.company_percent ?? 0,
      payload.settings?.compensation_percent ?? 0,
      payload.settings?.rp_per_dollar ?? 0,
    )
    : null;

  useEffect(() => {
    if (!activeEstimatorMarket) {
      return;
    }

    const featured = activeEstimatorMarket.plans.find((plan) => plan.is_featured) ?? activeEstimatorMarket.plans[0];

    if (featured && !activeEstimatorMarket.plans.some((plan) => String(plan.id) === estimatorPlan)) {
      setEstimatorPlan(String(featured.id));
    }
  }, [activeEstimatorMarket, estimatorPlan]);

  const copy = payload.settings?.copy;

  return (
    <div className={embedded ? 'bg-[#fffdf7] text-slate-900 antialiased print:bg-white' : 'min-h-screen bg-[#fffdf7] text-slate-900 antialiased print:bg-white'}>
      {!embedded && <Header categories={categories} />}
      {loading ? (
        <main className="mx-auto max-w-7xl px-4 py-20"><PageLoader /></main>
      ) : error || !payload.published || !copy ? (
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-3xl font-black">{t('ppf.unavailableTitle')}</h1>
          <p className="mt-4 text-slate-600">{error || t('ppf.unavailableBody')}</p>
        </main>
      ) : (
        <main>
          <Hero copy={copy} stats={payload.stats} />
          <Distinction title={copy.distinction_title} body={copy.distinction_body} />
          <MarketTabs markets={payload.markets} selected={market?.slug ?? ''} onSelect={(slug) => { setMarketSlug(slug); setScheduleSlug(''); }} />
          <TierOverview
            eyebrow={copy.tiers_eyebrow}
            title={copy.tiers_title}
            subtitle={copy.tiers_subtitle}
            tiers={payload.tiers}
          />
          <PricingSection
            eyebrow={copy.pricing_eyebrow}
            title={copy.pricing_title}
            market={market}
            schedule={schedule}
            view={view}
            onView={setView}
            onSchedule={setScheduleSlug}
            chooseLabel={t('ppf.chooseTier')}
            contactLabel={t('ppf.contactSales')}
            cardsLabel={t('ppf.tierCards')}
            tableLabel={t('ppf.detailedTable')}
            annualLabel={t('ppf.annualSoon')}
          />
          <Estimator
            copy={copy}
            markets={estimatorMarkets}
            marketSlug={activeEstimatorMarket?.slug ?? ''}
            planId={activeEstimatorPlan ? String(activeEstimatorPlan.id) : ''}
            volume={volume}
            transactions={transactions}
            average={transactions > 0 ? volume / transactions : 0}
            estimate={estimate}
            plan={activeEstimatorPlan}
            compareName={comparePlan?.name ?? null}
            processingLabel={`${payload.settings?.processing_percent ?? 2.9}% + $${(payload.settings?.processing_fixed ?? 0.3).toFixed(2)}`}
            locale={locale}
            onMarket={(slug) => setEstimatorMarket(slug)}
            onPlan={setEstimatorPlan}
            onVolume={setVolume}
            onTransactions={setTransactions}
          />
          <FeeAnatomy
            eyebrow={copy.anatomy_eyebrow}
            title={copy.anatomy_title}
            items={payload.settings?.anatomy_items ?? []}
            statement={payload.settings?.statement}
          />
          <RewardBreakdown copy={copy} settings={payload.settings} locale={locale} />
          <TierMovement movement={payload.settings?.movement} />
          <FaqList eyebrow={copy.faq_eyebrow} title={copy.faq_title} faqs={payload.faqs} openId={openFaq} onToggle={setOpenFaq} />
          <ApplyCta copy={copy} links={payload.settings?.cta_links ?? []} />
        </main>
      )}
      {!embedded && <Footer />}
    </div>
  );
}

function flattenMarkets(markets: PpfMarket[]): PpfMarket[] {
  return markets.flatMap((market) => (market.children?.length ? market.children : [market]));
}

function Hero({ copy, stats }: { copy: NonNullable<PpfPayload['settings']>['copy']; stats: PpfPayload['stats'] }) {
  const { t } = useTranslation();

  return (
    <section className="relative isolate overflow-hidden border-b border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <nav aria-label={t('ppf.breadcrumb')} className="mb-8 flex items-center gap-2 text-sm text-slate-600">
          <a href="#marketplace" className="rounded hover:text-amber-800">{t('ppf.home')}</a>
          <Chevron />
          <a href="#sell-on-asbeez" className="rounded hover:text-amber-800">{t('ppf.partnerCenter')}</a>
          <Chevron />
          <span aria-current="page" className="font-medium text-slate-900">{copy.title}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">{copy.eyebrow}</p>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">{copy.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{copy.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={copy.primary_cta_href || '#platform-fees/estimator'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-slate-800">{copy.primary_cta_label}</a>
              <a href={copy.secondary_cta_href || '#sell-on-asbeez'} className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-900 transition hover:border-amber-400 hover:bg-amber-50">{copy.secondary_cta_label}</a>
            </div>
            <p className="mt-5 text-sm font-medium text-slate-600">{copy.trust_line}</p>
          </div>
          <aside className="rounded-2xl border border-amber-200 bg-white/90 p-6 shadow-xl shadow-amber-900/5">
            <p className="font-bold">{copy.aside_title}</p>
            <p className="text-sm text-slate-500">{copy.aside_subtitle}</p>
            <dl className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">{t('ppf.markets')}</dt><dd className="font-bold">{stats.markets}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">{t('ppf.commonTiers')}</dt><dd className="font-bold">{stats.common_tiers}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">{t('ppf.pricingModel')}</dt><dd className="text-right font-bold">{t('ppf.marketSpecific')}</dd></div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Distinction({ title, body }: { title: string; body: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
        <h2 className="font-bold text-sky-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-sky-900">{body}</p>
      </div>
    </section>
  );
}

function MarketTabs({ markets, selected, onSelect }: { markets: PpfMarket[]; selected: string; onSelect: (slug: string) => void }) {
  return (
    <div className="sticky top-0 z-30 mt-8 border-y border-slate-200 bg-white/95 shadow-sm backdrop-blur print:static">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-max gap-1 py-2" role="tablist">
          {markets.map((market) => (
            <button
              key={market.id}
              type="button"
              role="tab"
              aria-selected={selected === market.slug}
              onClick={() => onSelect(market.slug)}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${selected === market.slug ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-amber-50 hover:text-slate-950'}`}
            >
              {market.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TierOverview({ eyebrow, title, subtitle, tiers }: { eyebrow: string; title: string; subtitle: string; tiers: PpfPayload['tiers'] }) {
  const tone: Record<string, string> = {
    default: 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
    featured: 'rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm',
    dark: 'rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white shadow-sm',
    custom: 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm',
  };
  const badge: Record<string, string> = {
    default: 'rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700',
    featured: 'rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-900',
    dark: 'rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300',
    custom: 'rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800',
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-amber-700">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">{title}</h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-slate-600">{subtitle}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => (
          <article key={tier.id} className={tone[tier.emphasis] ?? tone.default}>
            <span className={badge[tier.emphasis] ?? badge.default}>{tier.badge}</span>
            <h3 className="mt-4 text-xl font-black">{tier.name}</h3>
            <p className={`mt-2 text-sm leading-6 ${tier.emphasis === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{tier.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PricingSection({
  eyebrow,
  title,
  market,
  schedule,
  view,
  onView,
  onSchedule,
  chooseLabel,
  contactLabel,
  cardsLabel,
  tableLabel,
  annualLabel,
}: {
  eyebrow: string;
  title: string;
  market: PpfMarket | null;
  schedule: PpfMarket | null;
  view: 'cards' | 'table';
  onView: (view: 'cards' | 'table') => void;
  onSchedule: (slug: string) => void;
  chooseLabel: string;
  contactLabel: string;
  cardsLabel: string;
  tableLabel: string;
  annualLabel: string;
}) {
  const panel = schedule ?? market;

  if (!market || !panel) {
    return null;
  }

  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-amber-700">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">{title}</h2>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1">
            <button type="button" onClick={() => onView('cards')} className={`rounded-lg px-3 py-2 text-sm font-bold ${view === 'cards' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{cardsLabel}</button>
            <button type="button" onClick={() => onView('table')} className={`rounded-lg px-3 py-2 text-sm font-bold ${view === 'table' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{tableLabel}</button>
            <button type="button" disabled className="cursor-not-allowed rounded-lg px-3 py-2 text-sm font-bold text-slate-400">{annualLabel}</button>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-2xl font-black">{market.label}{panel.subtitle || market.subtitle ? <span className="font-medium text-slate-500"> — {panel.subtitle || market.subtitle}</span> : null}</h3>
          <p className="mt-2 text-slate-600">{panel.description || market.description}</p>
        </div>
        {market.children && market.children.length > 0 ? (
          <div className="mb-5 inline-flex rounded-xl border border-slate-200 bg-white p-1">
            {market.children.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => onSchedule(child.slug)}
                className={`rounded-lg px-4 py-2 text-sm font-bold ${panel.slug === child.slug ? 'bg-amber-400 text-slate-950' : 'text-slate-600'}`}
              >
                {child.label}
              </button>
            ))}
          </div>
        ) : null}
        {panel.has_cards && view === 'cards' ? (
          <div className="grid gap-4 lg:grid-cols-4">
            {panel.plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} chooseLabel={chooseLabel} contactLabel={contactLabel} />
            ))}
          </div>
        ) : (
          <PlanTable market={panel} />
        )}
        <div className={`mt-5 grid gap-4 ${panel.compliance_note || panel.upgrade_note ? 'sm:grid-cols-2' : ''}`}>
          {panel.example_note ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">{panel.example_note}</p> : null}
          {panel.upgrade_note ? <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">{panel.upgrade_note}</p> : null}
          {panel.compliance_note ? <p className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-950">{panel.compliance_note}</p> : null}
        </div>
        {market.footnote ? <p className="mt-4 text-sm text-slate-600">{market.footnote}</p> : null}
      </div>
    </section>
  );
}

function PlanCard({ plan, chooseLabel, contactLabel }: { plan: PpfPlan; chooseLabel: string; contactLabel: string }) {
  const { t } = useTranslation();
  const card = plan.style === 'dark'
    ? 'rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white shadow-sm'
    : plan.style === 'featured'
      ? 'relative rounded-2xl border-2 border-amber-400 bg-white p-5 shadow-lg'
      : 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';
  const muted = plan.style === 'dark' ? 'text-slate-400' : 'text-slate-500';
  const details = ['subscription', 'minimum', 'cap', 'payout'].filter((key) => plan.cells[key]);
  const enterprise = plan.features.length > 0;

  return (
    <article className={card}>
      {plan.is_featured ? <span className="absolute right-4 top-4 rounded-full bg-amber-200 px-2.5 py-1 text-xs font-black text-amber-950">{t('ppf.bestFit')}</span> : null}
      <h4 className="text-xl font-black">{plan.name}</h4>
      <p className={`mt-1 text-sm ${muted}`}>{plan.qualification}</p>
      <p className="mt-5 text-3xl font-black">{plan.rate_label}{plan.rate_suffix ? <span className={`text-sm font-medium ${muted}`}> {plan.rate_suffix}</span> : null}</p>
      {enterprise ? (
        <ul className="mt-5 space-y-2 text-sm text-slate-700">
          {plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
        </ul>
      ) : (
        <dl className={`mt-5 space-y-2 text-sm ${plan.style === 'dark' ? 'text-slate-200' : ''}`}>
          {details.map((key) => (
            <div key={key} className="flex justify-between"><dt className="capitalize">{key}</dt><dd className="font-bold">{plan.cells[key]}</dd></div>
          ))}
        </dl>
      )}
      <a
        href="#sell-on-asbeez"
        className={`mt-6 block w-full rounded-xl px-4 py-2.5 text-center font-bold ${
          plan.style === 'featured' ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
            : plan.style === 'dark' ? 'bg-white text-slate-950 hover:bg-amber-50'
              : enterprise ? 'border border-slate-900 hover:bg-slate-900 hover:text-white'
                : 'border border-slate-300 hover:bg-slate-50'
        }`}
      >
        {enterprise ? contactLabel : `${chooseLabel} ${plan.name}`}
      </a>
    </article>
  );
}

function PlanTable({ market }: { market: PpfMarket }) {
  const { t } = useTranslation();
  const columns = market.columns.filter((column) => column.key !== 'tier' && column.key !== 'plan');

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4" scope="col">{market.columns[0]?.label ?? 'Tier'}</th>
              {columns.map((column) => <th key={column.key} className="p-4" scope="col">{column.label}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {market.plans.map((plan) => (
              <tr key={plan.id} className={plan.is_featured ? 'bg-amber-50' : undefined}>
                <th className="p-4 font-bold" scope="row">
                  {plan.name}
                  {plan.is_featured ? <span className="ml-1 rounded bg-amber-200 px-2 py-0.5 text-xs">{t('ppf.bestFit')}</span> : null}
                </th>
                {columns.map((column) => (
                  <td key={column.key} className="p-4">{column.key === 'qualification' ? (plan.cells[column.key] || plan.qualification) : plan.cells[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Estimator({
  copy,
  markets,
  marketSlug,
  planId,
  volume,
  transactions,
  average,
  estimate,
  plan,
  compareName,
  processingLabel,
  locale,
  onMarket,
  onPlan,
  onVolume,
  onTransactions,
}: {
  copy: NonNullable<PpfPayload['settings']>['copy'];
  markets: PpfMarket[];
  marketSlug: string;
  planId: string;
  volume: number;
  transactions: number;
  average: number;
  estimate: ReturnType<typeof estimatePlan> | null;
  plan: PpfPlan | null;
  compareName: string | null;
  processingLabel: string;
  locale: string;
  onMarket: (slug: string) => void;
  onPlan: (id: string) => void;
  onVolume: (value: number) => void;
  onTransactions: (value: number) => void;
}) {
  const { t } = useTranslation();
  const market = markets.find((item) => item.slug === marketSlug);

  return (
    <section id="estimator" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl">
        <div className="grid lg:grid-cols-[1.1fr_.9fr]">
          <form className="p-6 sm:p-9" onSubmit={(event) => event.preventDefault()}>
            <p className="text-sm font-bold uppercase tracking-wider text-amber-300">{copy.estimator_eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black">{copy.estimator_title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{copy.estimator_subtitle}</p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-bold">{t('ppf.estimatorMarket')}
                <select value={marketSlug} onChange={(event) => onMarket(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 font-normal text-white">
                  {markets.map((item) => <option key={item.id} value={item.slug}>{item.parent_id ? `${item.label}` : item.label}</option>)}
                </select>
              </label>
              <label className="block text-sm font-bold">{t('ppf.estimatorTier')}
                <select value={planId} onChange={(event) => onPlan(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 font-normal text-white">
                  {(market?.plans ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <label className="block text-sm font-bold">{t('ppf.monthlyVolume')}
                <input type="number" min={0} value={volume} onChange={(event) => onVolume(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 font-normal text-white" />
              </label>
              <label className="block text-sm font-bold">{t('ppf.transactionCount')}
                <input type="number" min={0} value={transactions} onChange={(event) => onTransactions(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 font-normal text-white" />
              </label>
              <label className="block text-sm font-bold">{t('ppf.averageValue')}
                <input type="number" readOnly value={Number.isFinite(average) ? Math.round(average) : 0} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 font-normal text-white" />
              </label>
              <label className="block text-sm font-bold">{t('ppf.processingRate')}
                <input type="text" readOnly value={processingLabel} className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 font-normal text-white" />
              </label>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">{copy.estimator_disclaimer}</p>
          </form>
          <div className="bg-white p-6 text-slate-900 sm:p-9">
            {plan && estimate ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-slate-500">{t('ppf.monthlyEstimate')}</p>
                    <h3 className="mt-1 text-2xl font-black">{plan.name}</h3>
                  </div>
                  {plan.is_featured ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">{t('ppf.bestFit')}</span> : null}
                </div>
                <dl className="mt-7 divide-y divide-slate-200 rounded-2xl border border-slate-200">
                  <div className="flex justify-between gap-4 p-4"><dt>{t('ppf.participationFee')}</dt><dd className="font-bold">{money(estimate.participation, locale)}</dd></div>
                  <div className="flex justify-between gap-4 p-4"><dt>{t('ppf.monthlySubscription')}</dt><dd className="font-bold">{money(estimate.subscription, locale)}</dd></div>
                  <div className="flex justify-between gap-4 p-4"><dt>{t('ppf.estimatedProcessing')}</dt><dd className="font-bold">{money(estimate.processing, locale)}</dd></div>
                  <div className="flex justify-between gap-4 bg-slate-50 p-4"><dt className="font-bold">{t('ppf.estimatedTotal')}</dt><dd className="text-xl font-black">{money(estimate.total, locale)}</dd></div>
                  <div className="flex justify-between gap-4 p-4"><dt>{copy.rewards_fund_label || t('ppf.compensationFund')}</dt><dd className="font-bold">{money(estimate.fund, locale)}</dd></div>
                  <div className="flex justify-between gap-4 bg-amber-50 p-4"><dt className="font-bold">{copy.rewards_points_label || t('ppf.memberRewardPoints')}</dt><dd className="text-xl font-black">{t('ppf.pointsAmount', { count: Math.round(estimate.points) })}</dd></div>
                </dl>
                <div className="mt-5 rounded-xl bg-amber-50 p-4">
                  <p className="text-sm font-bold text-amber-950">{t('ppf.effectiveRate', { rate: estimate.effectiveRate === null ? '—' : estimate.effectiveRate.toFixed(1) })}</p>
                  <p className="mt-1 text-sm text-amber-900">{t('ppf.estimatedProceeds', { amount: money(estimate.proceeds, locale) })}</p>
                  <p className="mt-1 text-sm text-amber-900">{t('ppf.estimatedMemberPoints', { count: Math.round(estimate.points) })}</p>
                </div>
                {estimate.savings !== null && estimate.savings > 0 && compareName ? (
                  <p className="mt-5 text-sm text-slate-600">{t('ppf.estimatedSavings', { amount: money(estimate.savings, locale), name: compareName })}</p>
                ) : null}
              </>
            ) : (
              <p className="text-slate-500">{t('ppf.estimatorEmpty')}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeeAnatomy({ eyebrow, title, items, statement }: { eyebrow: string; title: string; items: { title: string; body: string }[]; statement?: PpfStatement }) {
  return (
    <section className="bg-amber-50/70 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-amber-700">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black">{title}</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <div key={item.title} className="rounded-xl bg-white p-4 shadow-sm">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          {statement ? (
            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-black">{statement.title}</p>
                  <p className="text-sm text-slate-500">{statement.reference}</p>
                </div>
                {statement.status ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{statement.status}</span> : null}
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                {statement.lines.map((line) => (
                  <div key={line.label} className={`flex justify-between ${line.tone === 'debit' ? 'text-rose-700' : ''} ${line.tone === 'divider' || line.tone === 'total' ? 'border-t pt-3' : ''} ${line.tone === 'total' ? 'text-base font-black' : ''}`}>
                    <dt>{line.label}</dt>
                    <dd>{line.value}</dd>
                  </div>
                ))}
              </dl>
              {statement.note ? <p className="mt-4 text-xs text-slate-500">{statement.note}</p> : null}
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function RewardBreakdown({ copy, settings, locale }: { copy: PpfCopy; settings: PpfSettings | null; locale: string }) {
  const { t } = useTranslation();

  if (!copy.rewards_title || !settings) {
    return null;
  }

  const example = settings.example_ppf_amount ?? 0;
  const allocation = allocatePpf(
    example,
    settings.company_percent ?? 0,
    settings.compensation_percent ?? 0,
    settings.rp_per_dollar ?? 0,
  );

  return (
    <section id="rewards" className="border-y border-amber-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-amber-700">{copy.rewards_eyebrow}</p>
            <h2 className="mt-2 text-3xl font-black">{copy.rewards_title}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">{copy.rewards_body}</p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">{copy.rewards_conversion_note}</p>
          </div>
          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500">{copy.rewards_points_label}</p>
            <p className="mt-2 text-sm text-slate-600">{t('ppf.examplePpfAmount', { amount: money(example, locale) })}</p>
            <dl className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
              <div className="flex justify-between gap-4 p-4">
                <dt>{copy.rewards_fund_label}{settings.compensation_percent !== null ? ` (${settings.compensation_percent}%)` : ''}</dt>
                <dd className="font-bold">{money(allocation.fund, locale)}</dd>
              </div>
              <div className="flex justify-between gap-4 bg-amber-50 p-4">
                <dt className="font-bold">{copy.rewards_points_label}</dt>
                <dd className="text-xl font-black">{t('ppf.pointsAmount', { count: Math.round(allocation.points) })}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}

function TierMovement({ movement }: { movement?: PpfMovement }) {
  if (!movement?.title) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-amber-700">{movement.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black">{movement.title}</h2>
          <p className="mt-4 leading-7 text-slate-600">{movement.body}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">{movement.sample_label}</p>
              <p className="text-xl font-black">{movement.current_label}</p>
            </div>
            <span className="text-sm font-bold text-amber-800">{movement.progress_label}</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.min(100, movement.progress ?? 0)}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>{movement.current_tier}</span>
            <span>{movement.remaining_label}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqList({ eyebrow, title, faqs, openId, onToggle }: { eyebrow: string; title: string; faqs: PpfFaq[]; openId: number | null; onToggle: (id: number | null) => void }) {
  return (
    <section className="border-t border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-amber-700">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black">{title}</h2>
        </div>
        <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200">
          {faqs.map((faq) => {
            const open = openId === faq.id;

            return (
              <div key={faq.id}>
                <h3>
                  <button type="button" aria-expanded={open} onClick={() => onToggle(open ? null : faq.id)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold hover:bg-amber-50">
                    <span>{faq.question}</span>
                    <span className={`text-slate-400 transition ${open ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                </h3>
                {open ? <p className="px-5 pb-5 text-sm leading-6 text-slate-600">{faq.answer}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ApplyCta({ copy, links }: { copy: NonNullable<PpfPayload['settings']>['copy']; links: { label: string; href: string }[] }) {
  return (
    <section id="apply" className="bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black sm:text-4xl">{copy.cta_title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">{copy.cta_body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={copy.cta_primary_href || '#sell-on-asbeez'} className="rounded-xl bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300">{copy.cta_primary_label}</a>
          <a href={copy.cta_secondary_href || '#how-it-works'} className="rounded-xl border border-slate-600 px-6 py-3 font-bold hover:bg-white/10">{copy.cta_secondary_label}</a>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
          {links.map((link) => <a key={link.label} href={link.href} className="hover:text-white">{link.label}</a>)}
        </div>
      </div>
    </section>
  );
}

function Chevron() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08 0Z" clipRule="evenodd" />
    </svg>
  );
}
