import type { ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';

export function AdminAlertBanner({
  title,
  intro,
  action,
  onAction,
  tone = 'rose',
}: {
  title: string;
  intro: string;
  action?: string;
  onAction?: () => void;
  tone?: 'rose' | 'orange';
}) {
  const box = tone === 'orange'
    ? 'rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm'
    : 'rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm';
  const titleClass = tone === 'orange' ? 'font-bold text-orange-950' : 'font-bold text-rose-950';
  const introClass = tone === 'orange' ? 'mt-1 text-sm text-orange-900' : 'mt-1 text-sm text-rose-800';
  const iconClass = tone === 'orange' ? 'h-5 w-5 text-orange-700' : 'h-5 w-5 text-rose-600';
  const actionClass = tone === 'orange'
    ? 'text-sm font-bold text-orange-800 hover:text-orange-950'
    : 'text-sm font-bold text-rose-700 hover:text-rose-900';

  return (
    <section className={box}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CircleAlert className={iconClass} />
            <h2 className={titleClass}>{title}</h2>
          </div>
          <p className={introClass}>{intro}</p>
        </div>
        {action ? <button type="button" onClick={onAction} className={actionClass}>{action}</button> : null}
      </div>
    </section>
  );
}
