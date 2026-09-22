import { useMemo, useState } from 'react';
import {
  ArrowRight, Check, ChevronDown, Clock3, Copy, Download, Gift, Hourglass,
  Share2, Sparkles, Star, Ticket, TrendingUp,
} from 'lucide-react';

import { useTranslation, type MessageKey } from '../../i18n';
import { BusyLabel } from '../ui/Spinner';

/**
 * Member reward points.
 *
 * The figures are fixtures, not an API: there is no points engine yet, and
 * the surrounding screens follow the same convention of showing the shape of
 * a feature before its backend exists. Everything a server would own — the
 * balance, the ledger rows, the tier thresholds — is gathered at the top so
 * swapping in a payload later is a change of source, not of layout.
 */

const BALANCE = {
  available: 4850,
  pending: 620,
  redeemedThisYear: 2150,
  expiringSoon: 350,
  /** Cents of reward value per point, for the "up to $X" estimate. */
  centsPerPoint: 1,
};

const TIER = {
  current: 'Hive Member',
  next: 'Golden Hive',
  qualifying: 4200,
  threshold: 5000,
  reviewDate: 'December 31, 2026',
};

const REFERRAL = { code: 'ABZ-MEMBER-4821', invited: 8, qualified: 3, pending: 1, pendingPoints: 500 };

type Market = { id: string; label: MessageKey; rules: { label: MessageKey; value: MessageKey }[]; note?: MessageKey };

const MARKETS: Market[] = [
  {
    id: 'shop',
    label: 'nav.shop',
    rules: [
      { label: 'rewards.earnShop1', value: 'rewards.earnShop1v' },
      { label: 'rewards.earnShop2', value: 'rewards.earnShop2v' },
      { label: 'rewards.earnShop3', value: 'rewards.earnShop3v' },
    ],
  },
  {
    id: 'digital',
    label: 'nav.digital',
    rules: [
      { label: 'rewards.earnDigital1', value: 'rewards.earnShop1v' },
      { label: 'rewards.earnDigital2', value: 'rewards.earnDigital2v' },
      { label: 'rewards.earnDigital3', value: 'rewards.earnDigital3v' },
    ],
  },
  {
    id: 'services',
    label: 'nav.services',
    rules: [
      { label: 'rewards.earnServices1', value: 'rewards.earnShop1v' },
      { label: 'rewards.earnServices2', value: 'rewards.earnShop3v' },
      { label: 'rewards.earnServices3', value: 'rewards.earnServices3v' },
    ],
  },
  {
    id: 'real-estate',
    label: 'nav.realEstate',
    rules: [
      { label: 'rewards.earnProperty1', value: 'rewards.earnProperty1v' },
      { label: 'rewards.earnProperty2', value: 'rewards.earnProperty2v' },
      { label: 'rewards.earnProperty3', value: 'rewards.earnProperty3v' },
    ],
    note: 'rewards.earnPropertyNote',
  },
  {
    id: 'automotive',
    label: 'nav.automotive',
    rules: [
      { label: 'rewards.earnAuto1', value: 'rewards.earnAuto1v' },
      { label: 'rewards.earnAuto2', value: 'rewards.earnAuto2v' },
      { label: 'rewards.earnAuto3', value: 'rewards.earnAuto3v' },
    ],
  },
  {
    id: 'insurance',
    label: 'nav.insurance',
    rules: [
      { label: 'rewards.earnIns1', value: 'rewards.earnIns1v' },
      { label: 'rewards.earnIns2', value: 'rewards.earnIns2v' },
      { label: 'rewards.earnIns3', value: 'rewards.earnIns3v' },
    ],
    note: 'rewards.earnInsNote',
  },
  {
    id: 'travel',
    label: 'nav.travel',
    rules: [
      { label: 'rewards.earnTravel1', value: 'rewards.earnTravel1v' },
      { label: 'rewards.earnTravel2', value: 'rewards.earnTravel2v' },
      { label: 'rewards.earnTravel3', value: 'rewards.earnTravel3v' },
      { label: 'rewards.earnTravel4', value: 'rewards.earnTravel4v' },
    ],
  },
];

type Reward = {
  id: string;
  title: MessageKey;
  desc: MessageKey;
  valid: MessageKey;
  tag: MessageKey;
  cost: number;
  groups: string[];
};

const REWARDS: Reward[] = [
  { id: 'd5', title: 'rewards.reward5', desc: 'rewards.reward5d', valid: 'rewards.valid30', tag: 'rewards.tagPopular', cost: 500, groups: ['discounts'] },
  { id: 'd10', title: 'rewards.reward10', desc: 'rewards.reward10d', valid: 'rewards.valid30', tag: 'rewards.tagPopular', cost: 1000, groups: ['discounts'] },
  { id: 'ship', title: 'rewards.rewardShipping', desc: 'rewards.rewardShippingd', valid: 'rewards.valid45', tag: 'rewards.tagExclusive', cost: 750, groups: ['shipping'] },
  { id: 'partner', title: 'rewards.rewardPartner', desc: 'rewards.rewardPartnerd', valid: 'rewards.validVaries', tag: 'rewards.tagLimited', cost: 1250, groups: ['offers'] },
  { id: 'travel', title: 'rewards.rewardTravel', desc: 'rewards.rewardTraveld', valid: 'rewards.valid60', tag: 'rewards.tagExclusive', cost: 2500, groups: ['travel'] },
  { id: 'donate', title: 'rewards.rewardDonation', desc: 'rewards.rewardDonationd', valid: 'rewards.validFinal', tag: 'rewards.tagGiveBack', cost: 1000, groups: ['donations'] },
];

const FILTERS: { id: string; label: MessageKey }[] = [
  { id: 'all', label: 'rewards.filterAll' },
  { id: 'discounts', label: 'rewards.filterDiscounts' },
  { id: 'shipping', label: 'rewards.filterShipping' },
  { id: 'travel', label: 'rewards.filterTravel' },
  { id: 'offers', label: 'rewards.filterOffers' },
  { id: 'donations', label: 'rewards.filterDonations' },
  { id: 'available', label: 'rewards.filterAvailable' },
];

type Status = 'confirmed' | 'pending' | 'redeemed' | 'reversed' | 'expired';

const STATUS_TONE: Record<Status, string> = {
  confirmed: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-sky-100 text-sky-800',
  redeemed: 'bg-violet-100 text-violet-800',
  reversed: 'bg-rose-100 text-rose-800',
  expired: 'bg-slate-200 text-slate-700',
};

const STATUS_LABEL: Record<Status, MessageKey> = {
  confirmed: 'rewards.statusConfirmed',
  pending: 'rewards.statusPending',
  redeemed: 'rewards.statusRedeemed',
  reversed: 'rewards.statusReversed',
  expired: 'rewards.statusExpired',
};

type Entry = {
  date: string;
  activity: MessageKey;
  market: MessageKey;
  reference: string;
  status: Status;
  points: number;
  balance: number;
};

const LEDGER: Entry[] = [
  { date: 'Sep 20, 2026', activity: 'rewards.actShopPurchase', market: 'nav.shop', reference: '#ABZ-18402', status: 'confirmed', points: 125, balance: 4850 },
  { date: 'Sep 18, 2026', activity: 'rewards.actServiceBooking', market: 'nav.services', reference: '#SV-4921', status: 'pending', points: 240, balance: 4725 },
  { date: 'Sep 15, 2026', activity: 'rewards.actRedemption', market: 'rewards.marketRewards', reference: '#RW-883', status: 'redeemed', points: -1000, balance: 4485 },
  { date: 'Sep 10, 2026', activity: 'rewards.actReferral', market: 'rewards.marketReferral', reference: '#RF-225', status: 'confirmed', points: 500, balance: 5485 },
  { date: 'Aug 30, 2026', activity: 'rewards.actExpiration', market: 'rewards.marketRewards', reference: '—', status: 'expired', points: -150, balance: 4985 },
  { date: 'Aug 28, 2026', activity: 'rewards.actRefund', market: 'nav.shop', reference: '#ABZ-17910', status: 'reversed', points: -85, balance: 5135 },
];

const EXPIRING = [
  { points: 350, date: 'October 31, 2026', kind: 'rewards.expiryStandard' as MessageKey },
  { points: 1200, date: 'December 31, 2026', kind: 'rewards.expiryPromo' as MessageKey },
];

const POLICY: MessageKey[] = [
  'rewards.policy1', 'rewards.policy2', 'rewards.policy3', 'rewards.policy4',
  'rewards.policy5', 'rewards.policy6', 'rewards.policy7', 'rewards.policy8',
];

const POLICY_LINKS: MessageKey[] = [
  'rewards.linkTerms', 'rewards.linkEarning', 'rewards.linkRedemption',
  'rewards.linkExpiration', 'rewards.linkSupport',
];

const FAQ_COUNT = 13;

export function RewardPointsPage() {
  const { t, locale } = useTranslation();

  const [market, setMarket] = useState(MARKETS[0].id);
  const [filter, setFilter] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [copied, setCopied] = useState(false);
  const [chosen, setChosen] = useState<Reward | null>(null);

  const num = (value: number) => value.toLocaleString(locale);
  const money = (cents: number) =>
    (cents / 100).toLocaleString(locale, { style: 'currency', currency: 'USD' });

  const activeMarket = MARKETS.find((entry) => entry.id === market) ?? MARKETS[0];

  const rewards = useMemo(() => REWARDS.filter((reward) => {
    if (filter === 'all') {
      return true;
    }

    // "Available to me" is derived from the balance rather than tagged on the
    // reward, so it cannot drift out of step with what the member can afford.
    return filter === 'available' ? reward.cost <= BALANCE.available : reward.groups.includes(filter);
  }), [filter]);

  const entries = useMemo(() => LEDGER.filter((entry) => {
    const matchesSearch = search.trim() === ''
      || entry.reference.toLowerCase().includes(search.trim().toLowerCase());

    return matchesSearch && (statusFilter === 'all' || entry.status === statusFilter);
  }), [search, statusFilter]);

  const toTier = Math.max(0, TIER.threshold - TIER.qualifying);
  const tierPercent = Math.min(100, Math.round((TIER.qualifying / TIER.threshold) * 100));

  function copyCode() {
    void navigator.clipboard?.writeText(REFERRAL.code).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-w-0 bg-[#fffdf7] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <nav aria-label={t('sell.crumbLabel')} className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <a href="#member-dashboard" className="hover:text-amber-800">{t('rewards.crumbDashboard')}</a>
        <span aria-hidden="true">/</span>
        <span>{t('rewards.crumbRewards')}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-semibold text-slate-900">{t('rewards.crumbPoints')}</span>
      </nav>

      <section className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[.18em] text-amber-700">{t('rewards.eyebrow')}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{t('rewards.title')}</h1>
          <p className="mt-4 max-w-2xl text-slate-600">{t('rewards.lead')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="#catalog" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">
            {t('rewards.exploreCta')}<ArrowRight className="h-4 w-4" />
          </a>
          <a href="#earn" className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold hover:border-amber-400 hover:bg-amber-50">
            {t('rewards.howCta')}
          </a>
        </div>
      </section>

      <p className="mt-4 text-xs leading-5 text-slate-500">{t('rewards.legalNote')}</p>

      {/* Balance and tier */}
      <section aria-label={t('rewards.availableBalance')} className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <article className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-honey/10" aria-hidden="true" />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-amber-300">{t('rewards.availableBalance')}</p>
                <p className="mt-2 text-5xl font-black">
                  {num(BALANCE.available)} <span className="text-lg font-medium text-slate-400">{t('rewards.points')}</span>
                </p>
                <p className="mt-2 text-sm text-amber-200">
                  {t('rewards.estimatedWorth', { amount: money(BALANCE.available * BALANCE.centsPerPoint) })}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300">
                <TrendingUp className="h-3.5 w-3.5" />{t('rewards.healthy')}
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-400">{t('rewards.estimatedNote')}</p>

            <dl className="mt-6 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
              {([
                ['rewards.pending', BALANCE.pending],
                ['rewards.redeemedThisYear', BALANCE.redeemedThisYear],
                ['rewards.expiringSoon', BALANCE.expiringSoon],
              ] as [MessageKey, number][]).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t(label)}</dt>
                  <dd className="mt-1 text-2xl font-black">{num(value)}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#catalog" className="inline-flex items-center gap-2 rounded-xl bg-honey px-4 py-2.5 text-sm font-black text-charcoal hover:bg-amber">
                <Gift className="h-4 w-4" />{t('rewards.redeemPoints')}
              </a>
              <a href="#activity" className="inline-flex items-center rounded-xl border border-white/25 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10">
                {t('rewards.viewActivity')}
              </a>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-amber-700">{t('rewards.currentTier')}</p>
              <h2 className="mt-1 text-2xl font-black">{TIER.current}</h2>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-800">
              <Star className="h-6 w-6" />
            </span>
          </div>

          <p className="mt-5 text-3xl font-black">
            {num(TIER.qualifying)} <span className="text-sm font-medium text-slate-500">{t('rewards.qualifyingPoints')}</span>
          </p>

          <div
            role="progressbar"
            aria-valuenow={TIER.qualifying}
            aria-valuemin={0}
            aria-valuemax={TIER.threshold}
            aria-label={t('rewards.nextTierAt', { tier: TIER.next, points: num(TIER.threshold) })}
            className="mt-3 h-2.5 overflow-hidden rounded-full bg-amber-100"
          >
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${tierPercent}%` }} />
          </div>

          <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs font-semibold text-slate-600">
            <span>{TIER.current}</span>
            <span>{t('rewards.remainingToTier', { count: num(toTier) })}</span>
            <span>{t('rewards.nextTierAt', { tier: TIER.next, points: num(TIER.threshold) })}</span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">{t('rewards.yourBenefits')}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li>{t('rewards.benefitOffers')}</li>
                <li>{t('rewards.benefitBirthday')}</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">{t('rewards.nextTierAdds')}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li>{t('rewards.benefitBonusPromos')}</li>
                <li>{t('rewards.benefitPriority')}</li>
              </ul>
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">{t('rewards.tierReview', { date: TIER.reviewDate })}</p>
        </article>
      </section>

      {/* Quick actions */}
      <section aria-label={t('rewards.quickActions')} className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <QuickAction href="#catalog" icon={Gift} title="rewards.actionRedeem" body="rewards.actionRedeemBody" />
        <QuickAction href="#referrals" icon={Share2} title="rewards.actionInvite" body="rewards.actionInviteBody" />
        <QuickAction done icon={Check} title="rewards.actionProfile" body="rewards.actionProfileBody" />
        <QuickAction href="#activity" icon={Star} title="rewards.actionReview" body="rewards.actionReviewBody" />
      </section>

      {/* How to earn */}
      <section id="earn" className="mt-14 scroll-mt-24">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-amber-700">{t('rewards.earnEyebrow')}</p>
            <h2 className="mt-2 text-3xl font-black">{t('rewards.earnTitle')}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{t('rewards.earnLead')}</p>
          </div>
          <a href="#policy" className="inline-flex items-center gap-1 text-sm font-bold text-amber-800 hover:underline">
            {t('rewards.earnRules')}<ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-6 overflow-x-auto">
          <div role="tablist" aria-label={t('rewards.earnMarketLabel')} className="flex min-w-max gap-1 rounded-xl border border-slate-200 bg-white p-1">
            {MARKETS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={entry.id === market}
                onClick={() => setMarket(entry.id)}
                className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${entry.id === market ? 'bg-amber-400 text-slate-950' : 'text-slate-600 hover:bg-amber-50'}`}
              >
                {t(entry.label)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activeMarket.rules.map((rule) => (
            <article key={rule.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-900">{t(rule.label)}</p>
              <p className="mt-2 text-sm text-amber-800">{t(rule.value)}</p>
            </article>
          ))}
        </div>

        {activeMarket.note && (
          <p className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-900">
            {t(activeMarket.note)}
          </p>
        )}
      </section>

      {/* Catalog */}
      <section id="catalog" className="mt-14 scroll-mt-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-amber-700">{t('rewards.catalogEyebrow')}</p>
            <h2 className="mt-2 text-3xl font-black">{t('rewards.catalogTitle')}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{t('rewards.catalogLead')}</p>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={filter === entry.id}
              onClick={() => setFilter(entry.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${filter === entry.id ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-amber-400'}`}
            >
              {t(entry.label)}
            </button>
          ))}
        </div>

        {rewards.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">{t('rewards.noRewards')}</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rewards.map((reward) => {
              const affordable = reward.cost <= BALANCE.available;

              return (
                <article key={reward.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">{t(reward.tag)}</span>
                    <Ticket className="h-6 w-6 text-amber-600" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-black">{t(reward.title)}</h3>
                  <p className="mt-2 text-sm text-slate-600">{t(reward.desc)}</p>
                  <p className="mt-1 text-xs text-slate-500">{t(reward.valid)}</p>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <p>
                      <span className="text-2xl font-black">{num(reward.cost)}</span>{' '}
                      <span className="text-sm text-slate-500">{t('rewards.points')}</span>
                    </p>
                    <button
                      type="button"
                      disabled={!affordable}
                      onClick={() => setChosen(reward)}
                      className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {affordable ? t('rewards.redeem') : t('rewards.notEnough')}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Activity */}
      <section id="activity" className="mt-14 scroll-mt-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-amber-700">{t('rewards.activityEyebrow')}</p>
            <h2 className="mt-2 text-3xl font-black">{t('rewards.activityTitle')}</h2>
          </div>
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50">
            <Download className="h-5 w-5" />{t('rewards.downloadCsv')}
          </button>
        </div>

        <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold">
            {t('rewards.searchReference')}
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="#ABZ-18402"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </label>
          <label className="text-sm font-semibold">
            {t('rewards.status')}
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | Status)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="all">{t('rewards.allStatuses')}</option>
              {(Object.keys(STATUS_LABEL) as Status[]).map((key) => (
                <option key={key} value={key}>{t(STATUS_LABEL[key])}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            {t('rewards.activityKind')}
            <select className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30">
              <option>{t('rewards.earnedAndUsed')}</option>
              <option>{t('rewards.earnedOnly')}</option>
              <option>{t('rewards.usedOnly')}</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            {t('rewards.dateRange')}
            <select className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30">
              <option>{t('rewards.last90')}</option>
              <option>{t('rewards.thisYear')}</option>
            </select>
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <caption className="sr-only">{t('rewards.ledgerCaption')}</caption>
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th scope="col" className="p-4">{t('rewards.colDate')}</th>
                  <th scope="col" className="p-4">{t('rewards.colActivity')}</th>
                  <th scope="col" className="p-4">{t('rewards.market')}</th>
                  <th scope="col" className="p-4">{t('rewards.colReference')}</th>
                  <th scope="col" className="p-4">{t('rewards.status')}</th>
                  <th scope="col" className="p-4 text-right">{t('rewards.colPoints')}</th>
                  <th scope="col" className="p-4 text-right">{t('rewards.colBalance')}</th>
                  <th scope="col" className="p-4"><span className="sr-only">{t('rewards.colDetails')}</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {entries.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-slate-500">{t('rewards.noActivity')}</td></tr>
                ) : entries.map((entry) => (
                  <tr key={entry.reference + entry.date}>
                    <td className="p-4">{entry.date}</td>
                    <td className="p-4 font-semibold">{t(entry.activity)}</td>
                    <td className="p-4">{t(entry.market)}</td>
                    <td className="p-4">{entry.reference}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_TONE[entry.status]}`}>
                        {t(STATUS_LABEL[entry.status])}
                      </span>
                    </td>
                    <td className={`p-4 text-right font-black ${entry.points < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {entry.points > 0 ? `+${num(entry.points)}` : `−${num(Math.abs(entry.points))}`}
                    </td>
                    <td className="p-4 text-right">{num(entry.balance)}</td>
                    <td className="p-4">
                      <a href="#activity" className="font-bold text-amber-800 hover:underline">
                        {entry.status === 'expired' ? t('rewards.policy') : t('rewards.view')}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 p-4 text-sm text-slate-500">
            {t('rewards.showingRange', { from: entries.length === 0 ? 0 : 1, to: entries.length, total: LEDGER.length })}
          </div>
        </div>
      </section>

      {/* Expiration and referrals */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-amber-700">{t('rewards.expiryEyebrow')}</p>
              <h2 className="mt-1 text-2xl font-black">{t('rewards.expiryTitle')}</h2>
            </div>
            <Hourglass className="h-6 w-6 shrink-0 text-amber-700" aria-hidden="true" />
          </div>
          <ul className="mt-5 space-y-3">
            {EXPIRING.map((row) => (
              <li key={row.date} className="rounded-xl bg-white p-4">
                <p className="font-bold text-slate-900">{t('rewards.expiryRow', { count: num(row.points), date: row.date })}</p>
                <p className="mt-1 text-xs text-slate-500">{t(row.kind)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#catalog" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800">{t('rewards.usePoints')}</a>
            <a href="#policy" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold hover:bg-slate-50">{t('rewards.expiryRules')}</a>
          </div>
          <p className="mt-4 text-xs leading-5 text-amber-900">{t('rewards.expiryNote')}</p>
        </article>

        <article id="referrals" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-amber-700">{t('rewards.referralEyebrow')}</p>
              <h2 className="mt-1 text-2xl font-black">{t('rewards.referralTitle')}</h2>
            </div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
              {t('rewards.referralPending', { count: num(REFERRAL.pendingPoints) })}
            </span>
          </div>

          <label className="mt-5 block text-xs font-black uppercase tracking-wide text-slate-500" htmlFor="referral-code">
            {t('rewards.referralCode')}
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="referral-code"
              readOnly
              value={REFERRAL.code}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold"
            />
            <button type="button" onClick={copyCode} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
              <Copy className="h-4 w-4" />{t('rewards.copy')}
            </button>
          </div>
          <p role="status" className="mt-2 h-4 text-xs font-semibold text-emerald-700">
            {copied ? t('rewards.copied') : ''}
          </p>

          <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
            {([
              ['rewards.invited', REFERRAL.invited],
              ['rewards.qualified', REFERRAL.qualified],
              ['rewards.pending', REFERRAL.pending],
            ] as [MessageKey, number][]).map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs font-semibold text-slate-500">{t(label)}</dt>
                <dd className="mt-1 text-2xl font-black">{num(value)}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 text-xs leading-5 text-slate-500">{t('rewards.referralNote')}</p>
          <a href="#policy" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-amber-800 hover:underline">
            {t('rewards.referralTerms')}<ArrowRight className="h-4 w-4" />
          </a>
        </article>
      </section>

      {/* Policy and notifications */}
      <section id="policy" className="mt-10 grid scroll-mt-24 gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-black">{t('rewards.policyTitle')}</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700 sm:grid-cols-2">
            {POLICY.map((key) => (
              <li key={key} className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {POLICY_LINKS.map((key) => (
              <a key={key} href="#policy" className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-amber-100 hover:text-amber-900">
                {t(key)}
              </a>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-black">{t('rewards.notifyTitle')}</h2>
          <p className="mt-2 text-sm text-slate-600">{t('rewards.notifyLead')}</p>
          <fieldset className="mt-5">
            <legend className="text-xs font-black uppercase tracking-wide text-slate-500">{t('rewards.channels')}</legend>
            <div className="mt-3 space-y-2">
              {([
                ['rewards.channelApp', true],
                ['rewards.channelEmail', true],
                ['rewards.channelSms', false],
              ] as [MessageKey, boolean][]).map(([label, on]) => (
                <label key={label} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold">
                  <input type="checkbox" defaultChecked={on} className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                  {t(label)}
                </label>
              ))}
            </div>
          </fieldset>
          <p className="mt-4 text-xs leading-5 text-slate-500">{t('rewards.smsNote')}</p>
        </article>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-wider text-amber-700">{t('rewards.faqEyebrow')}</p>
          <h2 className="mt-2 text-3xl font-black">{t('rewards.faqTitle')}</h2>
        </div>
        <div className="mx-auto mt-6 max-w-3xl divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {Array.from({ length: FAQ_COUNT }, (_, index) => index + 1).map((n) => {
            const open = openFaq === n;

            return (
              <div key={n}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : n)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold hover:bg-amber-50"
                  >
                    {t(`rewards.faq${n}q` as MessageKey)}
                    <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                </h3>
                {open && <p className="px-5 pb-5 text-sm leading-6 text-slate-600">{t(`rewards.faq${n}a` as MessageKey)}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mt-12 rounded-3xl bg-slate-950 px-4 py-14 text-center text-white sm:px-6">
        <h2 className="text-3xl font-black">{t('rewards.ctaTitle')}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">{t('rewards.ctaBody')}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href="#catalog" className="rounded-xl bg-honey px-5 py-3 text-sm font-black text-charcoal hover:bg-amber">{t('rewards.exploreCta')}</a>
          <a href="#marketplace" className="rounded-xl border border-white/25 px-5 py-3 text-sm font-bold hover:bg-white/10">{t('rewards.ctaShop')}</a>
          <a href="#policy" className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-300 underline hover:text-white">{t('rewards.ctaTerms')}</a>
        </div>
      </section>

      {chosen && <RedeemDialog reward={chosen} onClose={() => setChosen(null)} />}
    </main>
  );
}

function QuickAction({ href, icon: Icon, title, body, done = false }: {
  href?: string;
  icon: typeof Gift;
  title: MessageKey;
  body: MessageKey;
  done?: boolean;
}) {
  const { t } = useTranslation();

  const inner = (
    <>
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="mt-4 block font-black">{t(title)}</span>
      <span className="mt-1 block text-sm text-slate-600">{t(body)}</span>
    </>
  );

  if (done) {
    return (
      <div className="cursor-default rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left opacity-90">{inner}</div>
    );
  }

  return (
    <a href={href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
      {inner}
    </a>
  );
}

/**
 * Redemption confirmation.
 *
 * Kept deliberately inert: there is no redemption endpoint, so it walks
 * through the states a real one would have and stops at the success message
 * rather than pretending points were spent.
 */
function RedeemDialog({ reward, onClose }: { reward: Reward; onClose: () => void }) {
  const { t, locale } = useTranslation();
  const [acknowledged, setAcknowledged] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const num = (value: number) => value.toLocaleString(locale);

  function confirm() {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setDone(true);
    }, 900);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="redeem-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <p className="text-sm font-black uppercase tracking-wider text-amber-700">{t('rewards.confirmEyebrow')}</p>
        <h2 id="redeem-title" className="mt-1 text-2xl font-black">
          {t('rewards.confirmTitle', { reward: t(reward.title) })}
        </h2>

        {done ? (
          <>
            <p role="status" className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
              {t('rewards.redeemed', { ref: '#RW-910' })}
            </p>
            <button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800">
              {t('common.close')}
            </button>
          </>
        ) : (
          <>
            <dl className="mt-6 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between"><dt>{t('rewards.pointsRequired')}</dt><dd className="font-bold">{num(reward.cost)}</dd></div>
              <div className="flex justify-between"><dt>{t('rewards.currentBalance')}</dt><dd className="font-bold">{num(BALANCE.available)}</dd></div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <dt>{t('rewards.balanceAfter')}</dt>
                <dd className="font-black">{num(BALANCE.available - reward.cost)}</dd>
              </div>
            </dl>

            <p className="mt-4 text-xs leading-5 text-slate-500">{t('rewards.confirmNote')}</p>

            <label className="mt-4 flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              {t('rewards.confirmAck')}
            </label>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold hover:bg-slate-50">
                {t('common.cancel')}
              </button>
              <button
                type="button"
                disabled={!acknowledged || busy}
                onClick={confirm}
                className="ml-auto rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                {busy ? <BusyLabel label={t('rewards.processing')} /> : t('rewards.confirmAction')}
              </button>
            </div>
          </>
        )}

        <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{t('rewards.legalNote')}
        </p>
      </section>
    </div>
  );
}
