import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Award,
  Hexagon,
  Lock,
  Network,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Store,
  Unlock,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { useTranslation, type MessageKey } from '../../../i18n';

export function HexBadge({
  children,
  tone = 'honey',
  size = 'md',
}: {
  children: ReactNode;
  tone?: 'honey' | 'charcoal' | 'open' | 'you';
  size?: 'sm' | 'md';
}) {
  const box = size === 'sm' ? 'h-11 w-10 text-[10px]' : 'h-14 w-12 text-xs';
  const tones = {
    honey: { text: 'text-charcoal', poly: 'fill-honey' },
    charcoal: { text: 'text-white', poly: 'fill-charcoal' },
    open: { text: 'text-mutedgray', poly: 'fill-cream' },
    you: { text: 'text-charcoal', poly: 'fill-amber' },
  }[tone];

  return (
    <span className={`relative inline-flex ${box} items-center justify-center font-extrabold ${tones.text}`}>
      <svg viewBox="0 0 32 36" className="absolute inset-0 h-full w-full drop-shadow-sm" aria-hidden>
        <polygon
          points="16,2 30,10 30,26 16,34 2,26 2,10"
          className={tones.poly}
          stroke="#e89b0c"
          strokeDasharray={tone === 'open' ? '3 2' : undefined}
          strokeWidth={tone === 'open' ? 1.6 : 0.6}
        />
      </svg>
      <span className="relative z-10 px-0.5 text-center leading-tight">{children}</span>
    </span>
  );
}

function FlowArrow() {
  return <ArrowRight className="hidden h-5 w-5 shrink-0 text-honey sm:block" aria-hidden />;
}

function VisualFrame({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-xl bg-white shadow-md">
      <div className="bg-honeycomb border-b border-honey/20 px-5 py-3">
        <p className="text-sm font-bold">{title}</p>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
      <figcaption className="border-t border-gray-100 px-5 py-3 text-sm text-mutedgray">{caption}</figcaption>
    </figure>
  );
}

const lifeSteps: { key: MessageKey; copy: MessageKey; icon: LucideIcon }[] = [
  { key: 'guide.lifeShop', copy: 'guide.lifeShopCopy', icon: ShoppingBag },
  { key: 'guide.lifeRp', copy: 'guide.lifeRpCopy', icon: Sparkles },
  { key: 'guide.lifeAbc', copy: 'guide.lifeAbcCopy', icon: Hexagon },
  { key: 'guide.lifeMatrix', copy: 'guide.lifeMatrixCopy', icon: Network },
  { key: 'guide.lifeAhc', copy: 'guide.lifeAhcCopy', icon: Award },
  { key: 'guide.lifeConvert', copy: 'guide.lifeConvertCopy', icon: Wallet },
];

export function LifecycleGlance() {
  const { t } = useTranslation();

  return (
    <VisualFrame title={t('guide.glanceTitle')} caption={t('guide.glanceCaption')}>
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {lifeSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.key} className="relative rounded-xl bg-cream p-3 text-center">
              <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-honey text-charcoal">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber">{t('guide.lifeStep', { number: index + 1 })}</p>
              <p className="mt-1 text-sm font-bold">{t(step.key)}</p>
              <p className="mt-1 text-xs text-mutedgray">{t(step.copy)}</p>
            </li>
          );
        })}
      </ol>
    </VisualFrame>
  );
}

export function UnitCards() {
  const { t } = useTranslation();
  const units: { title: MessageKey; copy: MessageKey; icon: LucideIcon; mark: string }[] = [
    { title: 'guide.unitRpTitle', copy: 'guide.unitRpCopy', icon: Sparkles, mark: 'RP' },
    { title: 'guide.unitAbcTitle', copy: 'guide.unitAbcCopy', icon: Hexagon, mark: 'ABC' },
    { title: 'guide.unitAhcTitle', copy: 'guide.unitAhcCopy', icon: Award, mark: 'AHC' },
  ];

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {units.map((unit) => {
        const Icon = unit.icon;
        return (
          <li key={unit.title} className="rounded-xl bg-white p-5 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-softyellow text-amber">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="rounded-full bg-charcoal px-2.5 py-1 text-xs font-extrabold tracking-wide text-honey">{unit.mark}</span>
            </div>
            <h3 className="mb-2 font-bold">{t(unit.title)}</h3>
            <p className="text-sm text-mutedgray">{t(unit.copy)}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function BenefitPair() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <article className="rounded-xl bg-white p-5 shadow-md">
        <div className="mb-3 flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-honey text-charcoal">
            <Users className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="font-bold">{t('guide.benefitMemberTitle')}</h3>
        </div>
        <p className="text-sm text-mutedgray">{t('guide.benefitMemberCopy')}</p>
      </article>
      <article className="rounded-xl bg-white p-5 shadow-md">
        <div className="mb-3 flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-honey">
            <Store className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="font-bold">{t('guide.benefitVendorTitle')}</h3>
        </div>
        <p className="text-sm text-mutedgray">{t('guide.benefitVendorCopy')}</p>
      </article>
    </div>
  );
}

export function PlacementGraphic() {
  const { t } = useTranslation();

  return (
    <VisualFrame title={t('guide.placeGraphicTitle')} caption={t('guide.placeGraphicCaption')}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center">
          <HexBadge tone="you">{t('guide.placeYours')}</HexBadge>
          <p className="mt-2 text-xs font-bold text-amber">{t('guide.placeRoof')}</p>
        </div>
        <div className="h-8 w-px bg-honey" />
        <div className="grid w-full max-w-lg grid-cols-3 justify-items-center gap-2">
          <div className="flex flex-col items-center gap-2">
            <HexBadge tone="charcoal">{t('guide.placeOther')}</HexBadge>
            <p className="text-center text-xs text-mutedgray">{t('guide.placeOtherHint')}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <HexBadge tone="honey">{t('guide.placeOwnUnder')}</HexBadge>
            <p className="text-center text-xs font-semibold text-charcoal">{t('guide.placeOwnHint')}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <HexBadge tone="open">+</HexBadge>
            <p className="text-center text-xs text-mutedgray">{t('guide.placeOpenHint')}</p>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

export function ConversionGraphic() {
  const { t } = useTranslation();

  return (
    <VisualFrame title={t('guide.convertGraphicTitle')} caption={t('guide.convertGraphicCaption')}>
      <ol className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        <li className="rounded-xl bg-cream p-4 text-center">
          <Award className="mx-auto mb-2 h-6 w-6 text-amber" aria-hidden />
          <p className="font-bold">{t('guide.convertStay')}</p>
          <p className="mt-1 text-xs text-mutedgray">{t('guide.convertStayCopy')}</p>
        </li>
        <FlowArrow />
        <li className="rounded-xl border-2 border-dashed border-honey bg-softyellow/50 p-4 text-center">
          <Lock className="mx-auto mb-2 h-6 w-6 text-charcoal" aria-hidden />
          <p className="font-bold">{t('guide.convertAsk')}</p>
          <p className="mt-1 text-xs text-mutedgray">{t('guide.convertAskCopy')}</p>
        </li>
        <FlowArrow />
        <li className="rounded-xl bg-charcoal p-4 text-center text-white">
          <Unlock className="mx-auto mb-2 h-6 w-6 text-honey" aria-hidden />
          <p className="font-bold text-honey">{t('guide.convertDollars')}</p>
          <p className="mt-1 text-xs text-gray-300">{t('guide.convertDollarsCopy')}</p>
        </li>
      </ol>
    </VisualFrame>
  );
}

export function FlywheelGraphic() {
  const { t } = useTranslation();
  const loop: { title: MessageKey; copy: MessageKey; icon: LucideIcon }[] = [
    { title: 'guide.flyShop', copy: 'guide.flyShopCopy', icon: ShoppingBag },
    { title: 'guide.flyVendors', copy: 'guide.flyVendorsCopy', icon: Store },
    { title: 'guide.flyCells', copy: 'guide.flyCellsCopy', icon: Hexagon },
    { title: 'guide.flyCredits', copy: 'guide.flyCreditsCopy', icon: RefreshCw },
  ];

  return (
    <VisualFrame title={t('guide.flyTitle')} caption={t('guide.flyCaption')}>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {loop.map((item, index) => {
          const Icon = item.icon;
          return (
            <li key={item.title} className="flex gap-3 rounded-xl bg-cream p-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-honey font-extrabold text-charcoal">{index + 1}</span>
              <div>
                <p className="flex items-center gap-2 font-bold">
                  <Icon className="h-4 w-4 text-amber" aria-hidden />
                  {t(item.title)}
                </p>
                <p className="mt-1 text-sm text-mutedgray">{t(item.copy)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </VisualFrame>
  );
}

export function ReferralMeter() {
  const { t } = useTranslation();
  const rows = [
    { people: t('guide.referralsRow0'), levels: 9, label: t('guide.referralsRow0Levels') },
    { people: t('guide.referralsRow3'), levels: 10, label: t('guide.referralsRow3Levels') },
    { people: t('guide.referralsRow6'), levels: 11, label: t('guide.referralsRow6Levels') },
    { people: t('guide.referralsRow9'), levels: 12, label: t('guide.referralsRow9Levels') },
  ];

  return (
    <VisualFrame title={t('guide.referralMeterTitle')} caption={t('guide.referralMeterCaption')}>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.people} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[7rem_1fr_5rem]">
            <p className="text-sm font-semibold">{row.people}</p>
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: 12 }, (_, index) => (
                <span
                  key={index}
                  className={`h-3 flex-1 rounded-sm ${index < row.levels ? 'bg-honey' : 'bg-gray-200'}`}
                />
              ))}
            </div>
            <p className="text-right text-sm font-bold text-amber">{row.label}</p>
          </li>
        ))}
      </ul>
    </VisualFrame>
  );
}

export function ManyCellsGraphic() {
  const { t } = useTranslation();

  return (
    <VisualFrame title={t('guide.manyGraphicTitle')} caption={t('guide.manyGraphicCaption')}>
      <div className="flex flex-wrap items-end justify-center gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-col items-center gap-2">
            <HexBadge tone={n === 1 ? 'you' : 'honey'}>
              <span className="flex flex-col">
                <UserRound className="mx-auto h-3 w-3" aria-hidden />
                {n}
              </span>
            </HexBadge>
            <p className="text-xs font-bold">{t('guide.manyGraphicCell', { number: n })}</p>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} className="h-2 w-2 rounded-[1px] bg-honey/70" />
              ))}
            </div>
            <p className="text-[10px] text-mutedgray">{t('guide.manyGraphicTree')}</p>
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}
