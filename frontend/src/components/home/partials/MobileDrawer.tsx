import { X } from 'lucide-react';

import { useTranslation, type MessageKey } from '../../../i18n';
import type { HomeCategory } from '../../../lib/home';
import { Logo } from './Logo';

// Shown only when /home sent no categories — otherwise the drawer lists the
// seven markets straight from the taxonomy, so these mirror them by hand.
const fallbackItems: MessageKey[] = [
  'nav.shop', 'nav.digital', 'nav.services', 'nav.realEstate',
  'nav.automotive', 'nav.insurance', 'nav.travel',
  'nav.sellOnAsBeez', 'nav.howItWorks', 'nav.help',
];

export function MobileDrawer({
  open,
  onClose,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  categories: HomeCategory[];
}) {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={onClose}>
      <aside className="h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 text-charcoal" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <Logo compact />
          <button aria-label={t('nav.closeNavigation')} onClick={onClose}><X /></button>
        </div>
        <nav className="mt-5 space-y-1">
          {categories.length > 0
            ? categories.map((category) => (
              <a key={category.id} href="#marketplace" onClick={onClose} className="block rounded-lg px-3 py-3 hover:bg-softyellow">{category.name}</a>
            ))
            : fallbackItems.map((item) => (
              <a
                key={item}
                href={item === 'nav.howItWorks' || item === 'nav.help' ? '#how-it-works' : item === 'nav.sellOnAsBeez' ? '#sell-on-asbeez' : '#marketplace'}
                onClick={onClose}
                className="block rounded-lg px-3 py-3 hover:bg-softyellow"
              >
                {t(item)}
              </a>
            ))}
        </nav>
      </aside>
    </div>
  );
}
