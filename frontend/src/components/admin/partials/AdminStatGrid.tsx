import type { ComponentType, ReactNode } from 'react';

export type AdminStatCard = {
  key: string;
  label: string;
  value: ReactNode;
  tone: string;
  onClick?: () => void;
  href?: string;
};

export function AdminStatGrid({
  title,
  hint,
  cards,
  icon: Icon,
  variant = 'kpi',
}: {
  title?: string;
  hint?: string;
  cards: AdminStatCard[];
  icon: ComponentType<{ className?: string }>;
  variant?: 'kpi' | 'overview';
}) {
  const compact = variant === 'kpi';

  return (
    <section>
      {title ? (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          {hint ? <span className="text-xs font-medium text-slate-500">{hint}</span> : null}
        </div>
      ) : null}
      <div className={compact ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8' : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4'}>
        {cards.map((card) => {
          const className = compact
            ? 'rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md'
            : 'rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md';
          const body = compact ? (
            <>
              <span className={`inline-flex rounded-xl p-2 ${card.tone}`}><Icon className="h-5 w-5" /></span>
              <p className="mt-4 text-2xl font-black text-slate-950">{card.value}</p>
              <p className="text-xs text-slate-500">{card.label}</p>
            </>
          ) : (
            <>
              <span className={`inline-flex rounded-xl p-2.5 ${card.tone}`}><Icon className="h-5 w-5" /></span>
              <p className="mt-4 text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{card.value}</p>
            </>
          );

          if (card.href) {
            return <a key={card.key} href={card.href} className={className}>{body}</a>;
          }

          return (
            <button key={card.key} type="button" onClick={card.onClick} className={className}>
              {body}
            </button>
          );
        })}
      </div>
    </section>
  );
}
