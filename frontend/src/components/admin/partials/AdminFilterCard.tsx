import type { ReactNode } from 'react';
import { Search } from 'lucide-react';

import { useTranslation } from '../../../i18n';
import { inputClass } from './styles';

export function AdminFilterCard({
  title,
  intro,
  onSubmit,
  onClear,
  search,
  chips,
  children,
}: {
  title: string;
  intro?: string;
  onSubmit: () => void;
  onClear: () => void;
  search: { value: string; onChange: (value: string) => void; placeholder: string; id?: string; label?: string };
  chips?: ReactNode;
  children: ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        {intro ? <p className="mt-1 text-sm text-slate-500">{intro}</p> : null}
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          {search.label ? <label htmlFor={search.id} className="sr-only">{search.label}</label> : null}
          <input
            id={search.id}
            type="search"
            value={search.value}
            onChange={(event) => search.onChange(event.target.value)}
            placeholder={search.placeholder}
            className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{children}</div>
        <div className={`flex gap-2 border-t border-slate-100 pt-4 ${chips ? 'flex-col lg:flex-row lg:items-center lg:justify-between' : 'justify-end'}`}>
          {chips ? <div className="flex flex-wrap gap-2">{chips}</div> : null}
          <div className="flex gap-2">
            <button type="button" onClick={onClear} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">{t('admin.clearFilters')}</button>
            <button type="submit" className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-300">{t('admin.applyFilters')}</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function AdminField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-bold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

export function AdminSelect({
  id,
  value,
  onChange,
  children,
}: {
  id?: string;
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <select id={id} className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}>
      {children}
    </select>
  );
}
