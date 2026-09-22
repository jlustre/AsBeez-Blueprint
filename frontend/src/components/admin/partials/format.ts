export function formatDate(iso: string | null | undefined, locale: string): string {
  return iso ? new Date(iso).toLocaleDateString(locale, { dateStyle: 'medium' }) : '—';
}

export function formatDateTime(iso: string | null | undefined, locale: string): string {
  return iso ? new Date(iso).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' }) : '—';
}

export function formatMoney(amount: number | null | undefined, currency: string, locale: string): string {
  if (amount === null || amount === undefined) {
    return '—';
  }

  return new Intl.NumberFormat(locale, { style: 'currency', currency: currency || 'USD' }).format(amount);
}

export function initials(name: string | null | undefined): string {
  return (name ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?';
}

export type AdminListMeta = {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
};
