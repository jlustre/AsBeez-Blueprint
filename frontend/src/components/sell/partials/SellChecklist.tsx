import { useState } from 'react';
import { ChevronDown, ChevronUp, Lock } from 'lucide-react';

import { useTranslation } from '../../../i18n';
import { reviewSteps, type ApplicantStep, type StepStatus } from '../sellForm';

const tone: Record<StepStatus, { wrap: string; mark: string; detail: string }> = {
  completed: { wrap: 'hover:bg-emerald-50', mark: 'bg-emerald-600 text-white', detail: 'text-emerald-700' },
  current: { wrap: 'bg-amber-100 ring-1 ring-amber-300', mark: 'bg-amber-500 text-slate-950', detail: 'font-medium text-amber-800' },
  attention: { wrap: 'hover:bg-orange-50', mark: 'bg-orange-100 text-orange-700', detail: 'text-orange-700' },
  todo: { wrap: 'hover:bg-slate-50', mark: 'bg-slate-100 text-slate-700', detail: 'text-slate-500' },
  locked: { wrap: 'cursor-not-allowed opacity-55', mark: 'bg-slate-200 text-slate-600', detail: 'text-slate-500' },
};

export function SellChecklist({ steps, onSelect }: { steps: ApplicantStep[]; onSelect: (id: number) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-5">
          <div>
            <h2 className="font-bold text-slate-950">{t('sell.checklistTitle')}</h2>
            <p className="mt-1 text-xs text-slate-500">{t('sell.checklistHint')}</p>
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-slate-700 hover:bg-slate-50 lg:hidden"
            aria-expanded={open}
            aria-controls="sell-checklist"
            aria-label={open ? t('sell.checklistHide') : t('sell.checklistShow')}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        <ol id="sell-checklist" className={`${open ? 'block' : 'hidden'} max-h-[64vh] space-y-1 overflow-y-auto p-3 lg:block`}>
          {steps.map((step) => (
            <ChecklistItem key={step.id} step={step} onSelect={onSelect} />
          ))}
          <li className="pt-3">
            <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{t('sell.reviewHeading')}</p>
          </li>
          {reviewSteps.map((step) => (
            <ChecklistItem key={step.id} step={step} onSelect={onSelect} />
          ))}
        </ol>
        <div className="border-t border-slate-200 p-5 text-sm">
          <p className="font-semibold">{t('sell.checklistHelp')}</p>
          <div className="mt-2 flex flex-col gap-1">
            <a href="#sell-on-asbeez/support" className="text-amber-700 underline hover:text-amber-900">{t('sell.linkSupport')}</a>
            <a href="#sell-on-asbeez/support" className="text-amber-700 underline hover:text-amber-900">{t('sell.linkRequirements')}</a>
            <a href="#sell-on-asbeez/support" className="text-amber-700 underline hover:text-amber-900">{t('sell.linkFaq')}</a>
          </div>
        </div>
      </section>
    </aside>
  );
}

function ChecklistItem({ step, onSelect }: { step: ApplicantStep; onSelect: (id: number) => void }) {
  const { t } = useTranslation();
  const look = tone[step.status];
  const mark = step.status === 'completed' ? '✓' : step.status === 'locked' ? <Lock className="h-3.5 w-3.5" /> : step.id;
  const className = `flex w-full gap-3 rounded-xl p-3 text-left ${look.wrap}`;

  const body = (
    <>
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${look.mark}`}>{mark}</span>
      <span>
        <strong className="block text-sm">{t(step.title)}</strong>
        <small className={look.detail}>{t(step.detail, step.detailVars)}</small>
      </span>
    </>
  );

  if (step.status === 'locked') {
    return (
      <li>
        <button type="button" disabled aria-disabled="true" className={className}>{body}</button>
      </li>
    );
  }

  return (
    <li>
      <a
        href={step.id === 6 ? '#sell-on-asbeez/changes' : `#sell-on-asbeez/step-${step.id}`}
        aria-current={step.status === 'current' ? 'step' : undefined}
        className={className}
        onClick={(event) => {
          event.preventDefault();
          onSelect(step.id);
        }}
      >
        {body}
      </a>
    </li>
  );
}
