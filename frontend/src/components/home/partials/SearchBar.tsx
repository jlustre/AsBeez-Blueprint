import { Search } from 'lucide-react';

import { useTranslation } from '../../../i18n';

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();

  return (
    <div className={`flex w-full overflow-hidden rounded-lg ring-2 ring-honey/60 ${compact ? '' : 'focus-within:ring-honey'}`}>
      {compact ? null : (
        <select aria-label={t('nav.searchCategory')} className="border-r border-gray-300 bg-gray-100 px-2 text-sm text-charcoal">
          <option>{t('nav.all')}</option>
          <option>{t('nav.products')}</option>
          <option>{t('nav.services')}</option>
          <option>{t('nav.jobs')}</option>
        </select>
      )}
      <input className="min-w-0 flex-1 px-3 py-2.5 text-charcoal outline-none" placeholder={compact ? t('nav.searchPlaceholderShort') : t('nav.searchPlaceholder')} />
      <button aria-label={t('common.search')} className="bg-honey px-4 text-charcoal"><Search className="h-5 w-5" /></button>
    </div>
  );
}
