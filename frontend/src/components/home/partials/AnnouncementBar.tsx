import { X } from 'lucide-react';

import { useTranslation } from '../../../i18n';

export function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="relative z-50 bg-amber px-4 py-2 text-center text-sm">
      <span>{t('nav.announcement')}</span>
      <button className="ml-3 font-semibold underline" onClick={onDismiss}>{t('nav.learnMore')}</button>
      <button aria-label={t('nav.dismissAnnouncement')} className="absolute right-3 top-1/2 -translate-y-1/2" onClick={onDismiss}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
