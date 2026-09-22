import type { FormEvent } from 'react';

import { useTranslation } from '../../../i18n';
import type { PartnerApplication } from '../../../lib/partner';
import { SELL_TOTAL_STEPS, stepLead, stepTitle, type SellFormState } from '../sellForm';
import { SellStepFields } from './SellStepFields';
import { BusyLabel } from '../../ui/Spinner';

export function SellStepForm({
  currentStep,
  form,
  application,
  disabled,
  busy,
  onChange,
  onUpload,
  onPrevious,
  onSaveDraft,
  onSaveExit,
  onContinue,
  draftLabel,
}: {
  currentStep: number;
  form: SellFormState;
  application: PartnerApplication | null;
  disabled: boolean;
  /** A save is in flight. Distinct from `disabled`, which also means locked. */
  busy: boolean;
  onChange: (patch: Partial<SellFormState>) => void;
  onUpload: (kind: string, files: FileList | null) => void;
  onPrevious: () => void;
  onSaveDraft: () => void;
  onSaveExit: () => void;
  onContinue: () => void;
  draftLabel: string;
}) {
  const { t } = useTranslation();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onContinue();
  }

  return (
    <form className="rounded-2xl border border-slate-200 bg-white shadow-sm" onSubmit={submit}>
      <div className="border-b border-slate-200 p-5 sm:p-7">
        <p className="text-sm font-bold text-amber-700">{t('sell.stepEyebrow', { current: currentStep, total: SELL_TOTAL_STEPS }).toUpperCase()}</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">{t(stepTitle(currentStep))}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{t(stepLead[currentStep] ?? 'sell.step5Lead')}</p>
      </div>
      <div className="space-y-7 p-5 sm:p-7">
        <SellStepFields currentStep={currentStep} form={form} application={application} disabled={disabled} onChange={onChange} onUpload={onUpload} />
      </div>
      <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>{t('sell.stepFooter', { current: currentStep, total: SELL_TOTAL_STEPS })}</span>
          <span className="text-emerald-700">{draftLabel}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onPrevious} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100">{t('sell.previous')}</button>
          <button type="button" onClick={onSaveDraft} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100">{t('sell.saveDraft')}</button>
          <button type="button" onClick={onSaveExit} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100">{t('sell.saveExit')}</button>
          <button type="submit" disabled={busy} className="ml-auto rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-sm hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
            {busy
              ? <BusyLabel label={t('common.saving')} />
              : currentStep === SELL_TOTAL_STEPS ? t('sell.submitApplication') : t('sell.continue')}
          </button>
        </div>
      </div>
    </form>
  );
}
