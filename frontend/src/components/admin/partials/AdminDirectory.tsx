import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { useTranslation } from '../../../i18n';
import type { AdminListMeta } from './format';

export function AdminLoadingState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-slate-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function AdminEmptyState({ children }: { children: ReactNode }) {
  return <div className="px-5 py-16 text-center text-sm text-slate-500">{children}</div>;
}

export function AdminPaginationBar({
  meta,
  perPage,
  onPerPage,
  onPage,
}: {
  meta: AdminListMeta;
  perPage: number;
  onPerPage: (size: number) => void;
  onPage: (page: number) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>{t('admin.rowsPerPage')}</span>
        <select
          value={perPage}
          onChange={(event) => onPerPage(Number(event.target.value))}
          className="rounded-lg border-slate-300 text-sm focus:border-amber-500 focus:ring-amber-500"
        >
          {[10, 25, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
      </div>
      <nav className="flex items-center gap-1">
        <button type="button" disabled={meta.page <= 1} onClick={() => onPage(Math.max(1, meta.page - 1))} className="rounded-lg border px-3 py-2 text-sm disabled:text-slate-300">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-3 text-sm font-semibold">{meta.page} / {meta.last_page}</span>
        <button type="button" disabled={meta.page >= meta.last_page} onClick={() => onPage(meta.page + 1)} className="rounded-lg border px-3 py-2 text-sm disabled:text-slate-300">
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}

export function AdminSelectedBar({
  countLabel,
  children,
}: {
  countLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-5 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <p className="text-sm font-bold text-amber-900">{countLabel}</p>
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
    </div>
  );
}

export function AdminDirectory({
  title,
  showing,
  selectLabel,
  selected,
  onToggleSelectPage,
  selectedCount = 0,
  selectedBar,
  loading,
  loadingLabel,
  empty,
  pagination,
  tableClassName = 'w-full min-w-[64rem] text-left text-sm',
  children,
}: {
  title: string;
  showing: string;
  selectLabel?: string;
  selected?: boolean;
  onToggleSelectPage?: () => void;
  selectedCount?: number;
  selectedBar?: ReactNode;
  loading: boolean;
  loadingLabel: string;
  empty: ReactNode;
  pagination?: ReactNode;
  tableClassName?: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{showing}</p>
        </div>
        {selectLabel ? (
          <label className="inline-flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={selected} onChange={onToggleSelectPage} className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
            {selectLabel}
          </label>
        ) : null}
      </div>
      {selectedCount > 0 ? selectedBar : null}
      <div className="overflow-x-auto">
        {loading ? (
          <AdminLoadingState label={loadingLabel} />
        ) : empty ? (
          <AdminEmptyState>{empty}</AdminEmptyState>
        ) : (
          <table className={tableClassName}>{children}</table>
        )}
      </div>
      {pagination}
    </section>
  );
}

export function AdminSplitLayout({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_22rem]">{children}</div>;
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">{children}</thead>;
}
