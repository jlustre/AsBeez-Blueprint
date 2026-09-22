import type { ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';

import { useTranslation } from '../../../i18n';
import { formatDateTime } from './format';
import { inputClass, primaryButton } from './styles';

export type AdminNote = {
  id: number;
  note?: string;
  body?: string;
  admin?: { name?: string | null } | null;
  author?: string | null;
  created_at: string | null;
};

export function AdminNotesCard({
  title,
  intro,
  note,
  onChange,
  onSave,
  saving,
  placeholder,
  events,
  locale,
}: {
  title: string;
  intro: string;
  note: string;
  onChange: (value: string) => void;
  onSave: () => void;
  saving: boolean;
  placeholder?: string;
  events: AdminNote[];
  locale: string;
}) {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{intro}</p>
      </div>
      <div className="space-y-5 p-5 sm:p-6">
        {events.map((event) => (
          <article key={event.id} className="rounded-xl bg-slate-50 p-4">
            <div className="flex justify-between gap-4">
              <p className="text-sm font-bold">{event.body ?? event.note}</p>
              <time className="shrink-0 text-xs text-slate-400">{formatDateTime(event.created_at, locale)}</time>
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-500">{event.author ?? event.admin?.name ?? t('admin.unavailable')}</p>
          </article>
        ))}
        <div>
          <label className="block text-sm font-semibold">{t('admin.addNote')}</label>
          <textarea rows={3} value={note} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${inputClass} mt-2`} />
        </div>
        <button type="button" disabled={saving || !note.trim()} onClick={onSave} className={primaryButton}>{t('admin.addNote')}</button>
      </div>
    </section>
  );
}

export function AdminStatusCard({
  title,
  intro,
  children,
  onApply,
  disabled,
  applyLabel,
}: {
  title: string;
  intro: string;
  children: ReactNode;
  onApply: () => void;
  disabled: boolean;
  applyLabel?: string;
}) {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-rose-200 bg-white shadow-sm">
      <div className="border-b border-rose-100 px-5 py-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{intro}</p>
      </div>
      <div className="grid gap-6 p-5 sm:p-6">
        {children}
        <button type="button" disabled={disabled} onClick={onApply} className="rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50">
          {applyLabel ?? t('admin.applyStatus')}
        </button>
      </div>
    </section>
  );
}

export function AdminActivityCard({
  title,
  intro,
  empty,
  headers,
  children,
}: {
  title: string;
  intro: string;
  empty?: ReactNode;
  headers: string[];
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{intro}</p>
      </div>
      <div className="overflow-x-auto">
        <table className={`w-full text-left text-sm ${headers.length > 0 ? 'min-w-[48rem]' : 'min-w-[20rem]'}`}>
          {headers.length > 0 ? (
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>{headers.map((header) => <th key={header} className="px-5 py-3">{header}</th>)}</tr>
            </thead>
          ) : null}
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
      {empty}
    </section>
  );
}

export function AdminLinkGrid({
  title,
  intro,
  links,
  footnote,
}: {
  title: string;
  intro: string;
  links: { key: string; label: string; count?: number; onClick?: () => void; href?: string }[];
  footnote?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{intro}</p>
      </div>
      <nav className="grid gap-2 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        {links.map((link) => {
          const className = 'flex items-center justify-between rounded-lg border p-3 text-left text-sm font-semibold hover:border-amber-400 hover:bg-amber-50';
          const body = (
            <>
              <span>{link.label}</span>
              {link.count !== undefined ? <span className="rounded-full bg-amber-100 px-2 text-xs">{link.count}</span> : null}
            </>
          );
          if (link.href) {
            return <a key={link.key} href={link.href} className={className}>{body}</a>;
          }
          return (
            <button key={link.key} type="button" onClick={link.onClick} className={className}>
              {body}
            </button>
          );
        })}
      </nav>
      {footnote ? (
        <p className="flex items-center gap-2 px-5 pb-5 text-xs text-slate-500 sm:px-6">
          <CircleAlert className="h-3.5 w-3.5" />
          {footnote}
        </p>
      ) : null}
    </section>
  );
}

export function AdminBulkButton({
  children,
  onClick,
  disabled,
  tone = 'default',
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: 'default' | 'rose' | 'emerald' | 'blue';
}) {
  const tones = {
    default: 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50',
    rose: 'rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50',
    emerald: 'rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50',
    blue: 'rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700',
  };

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={tones[tone]}>
      {children}
    </button>
  );
}
