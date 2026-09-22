import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function AdminDetailAside({
  title,
  intro,
  loading,
  loadingLabel,
  empty,
  isEmpty,
  children,
}: {
  title: string;
  intro: string;
  loading: boolean;
  loadingLabel: string;
  empty: string;
  isEmpty: boolean;
  children: ReactNode;
}) {
  return (
    <aside className="self-start rounded-2xl border border-slate-200 bg-white shadow-sm 2xl:sticky 2xl:top-6">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{intro}</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingLabel}
        </div>
      ) : isEmpty ? (
        <p className="px-5 py-10 text-center text-sm text-slate-500">{empty}</p>
      ) : (
        children
      )}
    </aside>
  );
}

export function AdminSection({
  title,
  intro,
  children,
  footer,
  tone = 'default',
  headingSize = 'lg',
}: {
  title: string;
  intro?: string;
  children: ReactNode;
  footer?: ReactNode;
  tone?: 'default' | 'rose';
  headingSize?: 'lg' | 'xl';
}) {
  const border = tone === 'rose' ? 'border-rose-200' : 'border-slate-200';
  const headerBorder = tone === 'rose' ? 'border-rose-100' : 'border-slate-200';

  return (
    <section className={`rounded-2xl border ${border} bg-white shadow-sm`}>
      <div className={`border-b ${headerBorder} px-5 py-4 sm:px-6`}>
        <h2 className={`${headingSize === 'xl' ? 'text-xl' : 'text-lg'} font-bold text-slate-950`}>{title}</h2>
        {intro ? <p className="mt-1 text-xs text-slate-500 sm:text-sm">{intro}</p> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
      {footer}
    </section>
  );
}

export function AdminDefinitionGrid({
  items,
}: {
  items: { label: string; value: ReactNode; span?: boolean }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-slate-200 px-5 py-4 text-sm">
      {items.map((item) => (
        <div key={item.label} className={item.span ? 'col-span-2' : undefined}>
          <dt className="text-xs text-slate-500">{item.label}</dt>
          <dd className="font-semibold">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
