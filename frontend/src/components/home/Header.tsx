import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, ShoppingCart } from 'lucide-react';

import { useAuth } from '../../auth/AuthProvider';
import { useTranslation, type MessageKey } from '../../i18n';
import type { HomeCategory } from '../../lib/home';
import { MARKETS } from '../../lib/markets';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { AccountMenu, AnnouncementBar, Logo, MarketMenu, MegaMenu, MobileDrawer, SearchBar } from './partials';

/**
 * Everything after the markets. Not a market, so kept out of that list.
 *
 * Platform fees are not here: they matter to someone deciding whether to sell,
 * not to a shopper, so the link lives in the vendor dashboard and in the
 * footer's Sell group rather than in the shopper's top bar.
 */
const utilityItems: { label: MessageKey; href: string }[] = [
  { label: 'nav.sellOnAsBeez', href: '#sell-on-asbeez' },
  { label: 'nav.howItWorks', href: '#how-it-works' },
  { label: 'nav.help', href: '#how-it-works' },
];

export function Header({ categories }: { categories: HomeCategory[] }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAccountOpen(false);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [accountOpen]);

  return (
    <>
      {announcementVisible ? <AnnouncementBar onDismiss={() => setAnnouncementVisible(false)} /> : null}
      <header className="sticky top-0 z-40 bg-charcoal text-white shadow-lg">
        <div className="amazon-container py-2">
          <div className="flex items-center gap-3 lg:gap-4">
            <button className="p-2 lg:hidden" aria-label={t('nav.openNavigation')} onClick={() => setDrawerOpen(true)}><Menu /></button>
            <Logo />
            <button type="button" disabled title={t('admin.notYetAvailable')} className="hidden items-center gap-1 px-2 py-1 text-sm disabled:opacity-70 lg:flex">
              <span className="text-honey">⌖</span>
              <span className="text-left leading-tight">
                <small className="block text-gray-400">{t('nav.deliveringTo')}</small>
                <b>{t('nav.yourLocation')}</b>
              </span>
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="hidden max-w-3xl flex-1 md:flex"><SearchBar /></div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher className="hidden text-white lg:inline-flex" compact />
              <div ref={accountRef} className="relative hidden sm:block">
                <button className="text-left text-sm" aria-haspopup="dialog" aria-expanded={accountOpen} onClick={() => setAccountOpen((open) => !open)}>
                  <small className="block text-gray-400">{user ? t('auth.helloName', { name: user.name }) : t('auth.helloSignIn')}</small>
                  <b>{t('auth.accountLists')}</b>
                </button>
                {accountOpen ? <AccountMenu onClose={() => setAccountOpen(false)} /> : null}
              </div>
              <button type="button" disabled title={t('admin.notYetAvailable')} className="hidden text-left text-sm disabled:opacity-70 lg:block">
                <small className="block text-gray-400">{t('nav.returns')}</small>
                <b>{t('nav.andOrders')}</b>
              </button>
              <button type="button" disabled title={t('admin.notYetAvailable')} className="relative p-2 disabled:opacity-70" aria-label={t('nav.cart', { count: 0 })}>
                <ShoppingCart />
              </button>
            </div>
          </div>
          <div className="mt-2 md:hidden"><SearchBar compact /></div>
        </div>
        <nav aria-label={t('nav.mainNavigation')} className="hidden border-t border-white/10 lg:block">
          <div className="amazon-container flex items-center gap-1 overflow-x-auto py-1 text-sm scrollbar-hide">
            <MegaMenu />
            {MARKETS.map((market) => (
              <MarketMenu key={market.slug} slug={market.slug} label={market.short} />
            ))}
            <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-white/20" />
            {utilityItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`whitespace-nowrap rounded px-3 py-2.5 hover:bg-white/10 ${item.label === 'nav.sellOnAsBeez' ? 'font-semibold text-honey' : ''}`}
              >
                {t(item.label)}
              </a>
            ))}
          </div>
        </nav>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} categories={categories} />
    </>
  );
}
