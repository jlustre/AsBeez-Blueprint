import type { MessageKey } from '../../../i18n';
import { useTranslation } from '../../../i18n';
import type { ApplicationStatus } from '../../../lib/partner';
import { SELL_TOTAL_STEPS, statusLabel } from '../sellForm';

export function SellBreadcrumb() {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('sell.crumbLabel')} className="mb-5 text-sm text-slate-500">
      <a href="#marketplace" className="hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500">{t('sell.crumbHome')}</a>
      <span className="mx-2">/</span>
      <a href="#sell-on-asbeez" className="hover:text-amber-700">{t('sell.crumbSell')}</a>
      <span className="mx-2">/</span>
      <span className="text-slate-700">{t('sell.crumbApply')}</span>
    </nav>
  );
}

export function SellPageHeader({
  reference,
  status,
  onSaveExit,
}: {
  reference: string | null;
  status: ApplicationStatus | null;
  onSaveExit: () => void;
}) {
  const { t } = useTranslation();

  return (
    <header className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{t('sell.title')}</h1>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-300">{t(status ? statusLabel[status] : 'sell.statusDraft')}</span>
        </div>
        <p className="max-w-3xl text-slate-600">{t('sell.lead')}</p>
        {reference ? <p className="mt-2 text-sm font-medium text-slate-500">{t('sell.reference', { ref: reference })}</p> : <p className="mt-2 text-sm font-medium text-slate-500">{t('sell.referencePending')}</p>}
      </div>
      <div className="flex flex-wrap gap-3">
        <a href="#sell-on-asbeez/support" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:border-amber-400 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500">{t('sell.help')}</a>
        <button type="button" onClick={onSaveExit} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500">{t('sell.saveExit')}</button>
      </div>
    </header>
  );
}

export function SellNotice() {
  const { t } = useTranslation();

  return (
    <aside className="mb-6 rounded-xl border-l-4 border-honey bg-softyellow/70 p-5">
      <p className="mb-2 text-sm font-bold">{t('sell.noticeTitle')}</p>
      <p className="text-sm leading-relaxed text-charcoal/80">{t('sell.notice')}</p>
    </aside>
  );
}

export function SellWelcome({
  name,
  currentStep,
  typeLabel,
  completed,
  remaining,
}: {
  name: string;
  currentStep: number;
  typeLabel: string;
  completed: number;
  remaining: number;
}) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="welcome-title" className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-r from-white to-amber-50 p-5 shadow-sm sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 id="welcome-title" className="text-xl font-bold text-slate-950">{t('sell.welcomeTitle', { name })}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t('sell.welcomeCopy', { minutes: t('sell.welcomeMinutes'), days: t('sell.welcomeDays') })}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-7 gap-y-2 text-sm">
          <Meta label="sell.metaType" value={typeLabel} />
          <Meta label="sell.metaStep" value={t('sell.metaStepValue', { current: currentStep, total: SELL_TOTAL_STEPS })} />
          <Meta label="sell.metaDone" value={t('sell.metaDoneValue', { count: completed })} valueClass="font-semibold text-emerald-700" />
          <Meta label="sell.metaRequired" value={t('sell.metaRequiredValue', { count: remaining })} valueClass="font-semibold text-orange-700" />
        </dl>
      </div>
    </section>
  );
}

function Meta({ label, value, valueClass = 'font-semibold' }: { label: MessageKey; value: string; valueClass?: string }) {
  const { t } = useTranslation();

  return (
    <div>
      <dt className="text-slate-500">{t(label)}</dt>
      <dd className={valueClass}>{value}</dd>
    </div>
  );
}

export function SellProgress({
  percent,
  completed,
  savedLabel,
  savedNote,
}: {
  percent: number;
  completed: number;
  savedLabel: string;
  savedNote: string;
}) {
  const { t } = useTranslation();

  return (
    <section aria-label={t('sell.progressBar')} className="mb-6 rounded-2xl bg-slate-900 p-5 text-white shadow-sm sm:p-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm text-slate-300">{t('sell.progressLabel')}</p>
          <p className="text-2xl font-bold">{t('sell.progressValue', { percent })}</p>
        </div>
        <p className="text-sm text-slate-300">{t('sell.progressHint', { done: completed, total: SELL_TOTAL_STEPS })}</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-700" role="progressbar" aria-label={t('sell.progressBar')} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-amber-400" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-300">
        <span>{savedLabel}</span>
        <span className="text-emerald-300">{savedNote}</span>
      </div>
    </section>
  );
}

export function SellMobileBar({
  currentStep,
  onSaveDraft,
  onContinue,
}: {
  currentStep: number;
  onSaveDraft: () => void;
  onContinue: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-6px_20px_rgba(15,23,42,.08)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <span className="mr-auto text-xs font-bold text-slate-600">{t('sell.stepEyebrow', { current: currentStep, total: SELL_TOTAL_STEPS })}</span>
        <button type="button" onClick={onSaveDraft} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">{t('sell.saveDraft')}</button>
        <button type="button" onClick={onContinue} className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-bold text-slate-950 hover:bg-amber-400">{currentStep === SELL_TOTAL_STEPS ? t('sell.submitApplication') : t('sell.continueShort')}</button>
      </div>
    </div>
  );
}
