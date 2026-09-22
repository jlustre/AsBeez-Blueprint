import { useTranslation } from '../../../i18n';
import type { PartnerApplication } from '../../../lib/partner';
import { eventLabel, formatSellStamp } from '../sellForm';

export function SellChanges({
  application,
  onGoToStep,
  onReply,
}: {
  application: PartnerApplication;
  onGoToStep: () => void;
  onReply: () => void;
}) {
  const { t } = useTranslation();

  if (application.status !== 'changes_requested') {
    return null;
  }

  return (
    <section id="changes" className="scroll-mt-44 rounded-2xl border border-orange-300 bg-orange-50 p-5 shadow-sm lg:scroll-mt-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="rounded-full bg-orange-200 px-3 py-1 text-xs font-bold text-orange-900">{t('sell.changesBadge')}</span>
          <h2 className="mt-3 text-lg font-bold text-orange-950">{t('sell.changesTitle')}</h2>
          <p className="mt-1 text-sm text-orange-900">{t('sell.changesStepGeneric', { step: application.changes_step ?? 10 })}</p>
          {application.reviewer_note ? <blockquote className="mt-3 border-l-4 border-orange-400 pl-3 text-sm text-orange-900">“{application.reviewer_note}”</blockquote> : null}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" onClick={onGoToStep} className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-700">{t('sell.goToStep')}</button>
          <button type="button" onClick={onReply} className="rounded-lg border border-orange-400 bg-white px-4 py-2 text-sm font-bold text-orange-900 hover:bg-orange-100">{t('sell.replyReviewer')}</button>
        </div>
      </div>
    </section>
  );
}

export function SellActivity({ application }: { application: PartnerApplication | null }) {
  const { t, locale } = useTranslation();
  const events = application?.events ?? [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">{t('sell.activityTitle')}</h2>
      {events.length === 0 ? <p className="mt-4 text-sm text-slate-500">{t('sell.activityEmpty')}</p> : (
        <ol className="mt-4 space-y-4 border-l-2 border-amber-200 pl-5 text-sm">
          {events.map((item) => (
            <li key={item.id}>
              <strong className="block">{t(eventLabel[item.action] ?? 'sell.eventDraftSaved')}</strong>
              <span className="text-xs text-slate-500">{t('sell.actMeta', {
                date: item.at ? formatSellStamp(locale, new Date(item.at)) : '',
                actor: t(item.actor === 'system' ? 'sell.actorSystem' : 'sell.actorApplicant'),
                step: item.step ?? '',
              })}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function SellSupport({ onAction }: { onAction: () => void }) {
  const { t } = useTranslation();

  return (
    <section id="support" className="scroll-mt-44 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:scroll-mt-28">
      <h2 className="text-lg font-bold">{t('sell.supportTitle')}</h2>
      <p className="mt-1 text-sm text-slate-500">{t('sell.supportLead')}</p>
      <div className="mt-4 grid gap-2 text-sm">
        <button type="button" onClick={onAction} className="rounded-lg bg-slate-50 p-3 text-left font-semibold hover:bg-amber-50">{t('sell.faq')}</button>
        <button type="button" onClick={onAction} className="rounded-lg bg-slate-50 p-3 text-left font-semibold hover:bg-amber-50">{t('sell.eligibility')}</button>
        <button type="button" onClick={onAction} className="rounded-lg bg-slate-50 p-3 text-left font-semibold hover:bg-amber-50">{t('sell.fees')}</button>
        <button type="button" onClick={onAction} className="rounded-lg bg-slate-50 p-3 text-left font-semibold hover:bg-amber-50">{t('sell.restricted')}</button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={onAction} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">{t('sell.startChat')}</button>
        <button type="button" onClick={onAction} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50">{t('sell.scheduleCall')}</button>
      </div>
    </section>
  );
}

export function SellDecision({ application, onAction }: { application: PartnerApplication | null; onAction: () => void }) {
  const { t } = useTranslation();

  if (application?.status !== 'rejected') {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">{t('sell.deniedBadge')}</span>
          <h2 className="mt-3 font-bold">{t('sell.deniedTitleLive')}</h2>
          <p className="mt-1 text-sm text-slate-600">{application.decision_reason || t('sell.deniedCopyLive')}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <a href="#sell-on-asbeez/support" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">{t('sell.contactSupport')}</a>
          <button type="button" onClick={onAction} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">{t('sell.viewDecision')}</button>
        </div>
      </div>
    </section>
  );
}
