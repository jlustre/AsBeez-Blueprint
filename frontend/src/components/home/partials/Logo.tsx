import { useTranslation } from '../../../i18n';

export function Logo({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();

  return (
    <a href="#marketplace" className="flex shrink-0 items-center gap-2" aria-label={t('nav.homepage')}>
      <span className={compact ? 'text-xl font-extrabold' : 'text-2xl font-extrabold'}>
        <span className={compact ? 'text-amber' : 'text-honey'}>As</span>Beez
      </span>
    </a>
  );
}
