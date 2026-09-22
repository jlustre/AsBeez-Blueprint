import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CalendarCheck2,
  ChartColumnBig,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareText,
  Package,
  ReceiptText,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  TriangleAlert,
  UserPlus,
  Users,
  WalletCards,
  X,
} from 'lucide-react';

import { useAuth } from '../../auth/AuthProvider';
import { SidebarTooltip } from '../ui/SidebarTooltip';
import { useTranslation, type MessageKey } from '../../i18n';
import { handleMenuKeys } from '../../lib/menu';
import { Avatar } from '../ui/Avatar';
import { LanguageMenu } from '../ui/LanguageMenu';
import { MenuCloseButton } from '../ui/MenuCloseButton';
import { PpfBreakdownPage } from '../ppf/PpfBreakdownPage';
import { StoreProfilePage } from './StoreProfilePage';

/*
 * The rows below (orders, bookings, inventory, listings, feeds, notifications)
 * are demo data standing in for endpoints that do not exist yet, so their
 * values carry no message keys: they will be replaced wholesale, not
 * translated. Labels that outlive the fixtures do carry keys.
 */
const STORE_NAME = 'Golden Hive Market';

const kpis: { label: MessageKey; value: string; delta: string; tone: string; icon: typeof LayoutDashboard }[] = [
  { label: 'vendor.kpiRevenue', value: '$24,860', delta: '12.5%', tone: 'bg-softyellow text-amber', icon: DollarSign },
  { label: 'vendor.kpiOrders', value: '386', delta: '8.2%', tone: 'bg-amber/10 text-charcoal', icon: ShoppingBag },
  { label: 'vendor.kpiBookings', value: '94', delta: '15.3%', tone: 'bg-brandInfo/10 text-brandInfo', icon: CalendarCheck2 },
  { label: 'vendor.kpiVisitors', value: '8,429', delta: '6.7%', tone: 'bg-brandSuccess/10 text-brandSuccess', icon: Users },
  { label: 'vendor.kpiConversion', value: '4.8%', delta: '0.6%', tone: 'bg-honey/15 text-charcoal', icon: TrendingUp },
  { label: 'vendor.kpiRating', value: '4.9', delta: '327 reviews', tone: 'bg-gray-100 text-charcoal', icon: Star },
];

const sidebarItems: ReadonlyArray<{
  label: MessageKey;
  icon: typeof LayoutDashboard;
  active?: boolean;
  badge?: string;
  badgeTone?: string;
}> = [
  { label: 'nav.dashboard', icon: LayoutDashboard, active: true },
  { label: 'nav.products', icon: Package },
  { label: 'nav.services', icon: BriefcaseBusiness },
  { label: 'vendor.navOrders', icon: ShoppingBag, badge: '8' },
  { label: 'vendor.navBookings', icon: CalendarCheck2, badge: '3' },
  { label: 'vendor.navCustomers', icon: Users },
  { label: 'vendor.navMessages', icon: MessageSquareText, badge: '5', badgeTone: 'bg-brandInfo' },
  { label: 'nav.reviews', icon: Star },
  { label: 'vendor.navPromotions', icon: Megaphone },
  { label: 'vendor.navAnalytics', icon: ChartColumnBig },
  { label: 'vendor.navFinances', icon: WalletCards },
];

const businessItems: { label: MessageKey; icon: typeof LayoutDashboard; href?: string }[] = [
  { label: 'nav.storeProfile', icon: Store, href: '#store-profile' },
  { label: 'vendor.navTeamMembers', icon: Users },
  { label: 'vendor.navSubscription', icon: CreditCard },
  // Moved out of the shopper's top bar: what a partner pays is a seller
  // concern, and this is the screen a seller already works from.
  { label: 'nav.platformFees', icon: ReceiptText, href: '#platform-fees' },
  { label: 'vendor.navSettings', icon: Settings },
  { label: 'vendor.navHelp', icon: CircleHelp },
];

const orders = [
  { number: 'AB-4831', customer: 'Mia Carter', product: 'Wireless Headphones', date: 'Sep 18', amount: 89.99, payment: 'Paid', status: 'Processing' },
  { number: 'AB-4830', customer: 'Daniel Kim', product: 'Artisan Candle Set', date: 'Sep 18', amount: 42, payment: 'Paid', status: 'Shipped' },
  { number: 'AB-4829', customer: 'Priya Shah', product: 'Organic Skincare Kit', date: 'Sep 17', amount: 68.5, payment: 'Pending', status: 'Processing' },
  { number: 'AB-4828', customer: 'Marcus Lee', product: 'Leather Wallet', date: 'Sep 17', amount: 55, payment: 'Paid', status: 'Delivered' },
  { number: 'AB-4827', customer: 'Sofia Reyes', product: 'Ceramic Dinnerware', date: 'Sep 16', amount: 94, payment: 'Refunded', status: 'Cancelled' },
] as const;

const bookingFeed = [
  { title: 'Home Cleaning', guest: 'Maya Thompson', when: 'Sep 19 · 10:00 AM', location: 'Downtown · 3.2 mi', value: '$120', state: 'Confirmed' },
  { title: 'Website Consultation', guest: 'Ethan Clark', when: 'Sep 19 · 2:30 PM', location: 'Virtual Appointment', value: '$175', state: 'Confirmed' },
  { title: 'Accounting Consultation', guest: 'Olivia Martin', when: 'Sep 20 · 9:00 AM', location: 'Virtual Appointment', value: '$145', state: 'Pending' },
] as const;

const inventory = [
  { name: 'Wireless Headphones', sku: 'AB-WH-012', units: 4, threshold: 10, price: 89.99, status: 'Active' },
  { name: 'Artisan Candle Set', sku: 'AB-AC-044', units: 26, threshold: 8, price: 42, status: 'Active' },
  { name: 'Organic Skincare Kit', sku: 'AB-SK-090', units: 0, threshold: 5, price: 68.5, status: 'Out of stock' },
  { name: 'Leather Wallet', sku: 'AB-LW-015', units: 18, threshold: 6, price: 55, status: 'Active' },
  { name: 'Ceramic Dinnerware', sku: 'AB-CD-208', units: 3, threshold: 7, price: 94, status: 'Low stock' },
] as const;

const listings = [
  { name: 'Wireless Headphones', type: 'Product', views: 3240, sales: 186, conversion: '5.7%', revenue: '$16,738', trend: 'up' },
  { name: 'Home Cleaning', type: 'Service', views: 2180, sales: 94, conversion: '4.3%', revenue: '$11,280', trend: 'up' },
  { name: 'Artisan Candle Set', type: 'Product', views: 1840, sales: 122, conversion: '6.6%', revenue: '$5,124', trend: 'up' },
  { name: 'Web Consultation', type: 'Service', views: 1120, sales: 38, conversion: '3.4%', revenue: '$6,650', trend: 'down' },
] as const;

const customerFeed = [
  { title: 'Mia added headphones to cart', time: '3 min' },
  { title: 'Ethan sent a service inquiry', time: '16 min' },
  { title: 'Marcus purchased a wallet', time: '42 min' },
  { title: 'Sofia left a 5-star review', time: '1 hr' },
  { title: 'Olivia saved a listing', time: '2 hr' },
] as const;

const tasksSeed: MessageKey[] = [
  'vendor.taskShipOrders',
  'vendor.taskConfirmBookings',
  'vendor.taskUpdateInventory',
  'vendor.taskReplyQuestions',
  'vendor.taskReviewStatement',
];

const notifications = [
  { icon: ShoppingBag, tone: 'bg-softyellow text-amber', text: 'New order #AB-4831 received', when: '2 min ago', alert: true },
  { icon: CalendarCheck2, tone: 'bg-brandInfo/10 text-brandInfo', text: 'Website consultation confirmed', when: '18 min ago', alert: true },
  { icon: TriangleAlert, tone: 'bg-red-50 text-danger', text: 'Two products are out of stock', when: '1 hour ago', alert: true },
  { icon: Star, tone: 'bg-honey/15 text-[#8A5900]', text: 'New 5-star customer review', when: '3 hours ago', alert: true },
  { icon: WalletCards, tone: 'bg-green-50 text-success', text: 'Payout of $2,840 completed', when: 'Yesterday', alert: false },
] as const;

type TopMenuItem = {
  label: MessageKey;
  hint: MessageKey;
  icon: typeof LayoutDashboard;
  href?: string;
};

/** "Create New" menu — the same six shortcuts the quick-actions panel offers. */
const createMenu: TopMenuItem[] = [
  { label: 'vendor.addProduct', hint: 'vendor.addProductHint', icon: Package },
  { label: 'vendor.addService', hint: 'vendor.addServiceHint', icon: BriefcaseBusiness },
  { label: 'vendor.createPromotion', hint: 'vendor.createPromotionHint', icon: Megaphone },
  { label: 'vendor.addTeamMember', hint: 'vendor.addTeamMemberHint', icon: UserPlus },
  { label: 'vendor.createDiscount', hint: 'vendor.createDiscountHint', icon: DollarSign },
  { label: 'vendor.communityUpdate', hint: 'vendor.communityUpdateHint', icon: Sparkles },
];

const topMessages = [
  { name: 'Mia Carter', preview: 'Is gift wrapping available for the headphones?', when: '2 min', avatar: 'https://i.pravatar.cc/96?img=13' },
  { name: 'Ethan Clark', preview: 'Can we move the consultation to 3 PM?', when: '16 min', avatar: 'https://i.pravatar.cc/96?img=12' },
  { name: 'Priya Shah', preview: 'The skincare kit arrived — thank you!', when: '1 hr', avatar: 'https://i.pravatar.cc/96?img=5' },
] as const;

const profileMenu: TopMenuItem[] = [
  { label: 'storefront.browseMarketplace', hint: 'vendor.browseMarketplaceHint', icon: ShoppingBag, href: '#marketplace' },
  { label: 'nav.storeProfile', hint: 'vendor.storeProfileHint', icon: Store, href: '#store-profile' },
  { label: 'vendor.navSubscription', hint: 'vendor.subscriptionHint', icon: CreditCard },
  { label: 'admin.accountSettings', hint: 'auth.accountSecurity', icon: Settings, href: '#account-security' },
  { label: 'vendor.navHelp', hint: 'vendor.helpHint', icon: CircleHelp },
];

function formatMoney(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function getBadgeClass(value: string) {
  if (value === 'Paid' || value === 'Delivered' || value === 'Confirmed') return 'bg-green-50 text-success';
  if (value === 'Pending' || value === 'Processing' || value === 'Shipped') return 'bg-amber-50 text-[#8A5900]';
  if (value === 'Refunded' || value === 'Cancelled' || value === 'Out of stock') return 'bg-red-50 text-danger';
  return 'bg-gray-100 text-gray-600';
}

type VendorMenu = 'language' | 'create' | 'messages' | 'notifications' | 'profile';

export function VendorDashboardPage() {
  const { t, locale } = useTranslation();
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState<VendorMenu | null>(null);
  const [notifCount, setNotifCount] = useState<number>(notifications.length);
  const [msgCount, setMsgCount] = useState(5);
  const topActions = useRef<HTMLDivElement>(null);
  const [routeHash, setRouteHash] = useState(() => window.location.hash);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [taskList, setTaskList] = useState<Array<{ id: number; text: string; done: boolean }>>(
    tasksSeed.map((key, index) => ({ id: Date.now() + index, text: t(key), done: false })),
  );
  const [activeFilter, setActiveFilter] = useState<'All' | 'Product' | 'Service'>('All');
  const [messageSearch, setMessageSearch] = useState('');

  const visibleTasks = useMemo(
    () => taskList.filter((task) => showCompleted || !task.done),
    [taskList, showCompleted],
  );

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
        setOpenMenu(null);
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  useEffect(() => {
    const onHashChange = () => setRouteHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const onStoreProfile = routeHash === '#store-profile';
  const onPlatformFees = routeHash === '#platform-fees' || routeHash.startsWith('#platform-fees/');

  // What the top bar names, and which body the shell renders. Kept as one
  // lookup so the breadcrumb, the heading and the sidebar's active state
  // cannot disagree about which section is open.
  const section: MessageKey = onStoreProfile
    ? 'nav.storeProfile'
    : onPlatformFees
      ? 'nav.platformFees'
      : 'vendor.overview';

  // A click anywhere outside the top-bar action cluster closes the open menu.
  useEffect(() => {
    if (!openMenu) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (topActions.current && !topActions.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [openMenu]);

  const toggleMenu = (menu: VendorMenu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const toggleTask = (id: number) => {
    setTaskList((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  };

  const addTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('task') as HTMLInputElement | null;
    const value = input?.value.trim();

    if (!value) return;

    setTaskList((current) => [{ id: Date.now(), text: value, done: false }, ...current]);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-surface text-charcoal antialiased">
      <div className={`fixed inset-0 z-40 bg-black/55 backdrop-blur-sm lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />

      <aside
        className={`fixed inset-y-0 left-0 z-50 overflow-y-auto bg-charcoal text-white shadow-2xl transition-all duration-200 ${collapsed ? 'w-[84px]' : 'w-[270px]'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${collapsed ? 'lg:w-[84px]' : 'lg:w-[270px]'}`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 bg-charcoal px-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-honey text-charcoal">
            <Sparkles className="h-7 w-7" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xl font-extrabold tracking-tight">As<span className="text-honey">Beez</span></div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">{t('vendor.center')}</div>
            </div>
          )}
          <button className="ml-auto rounded-lg p-2 text-gray-300 hover:bg-white/10 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label={t('nav.closeNavigation')}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className={`rounded-2xl border border-white/10 bg-white/[.06] p-4 ${collapsed ? 'hidden' : 'block'}`}>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=120&q=80" alt={t('vendor.storeLogoAlt', { name: STORE_NAME })} className="h-12 w-12 rounded-xl object-cover" />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="truncate text-sm font-extrabold">{STORE_NAME}</p>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-honey" />
                </div>
                <p className="text-xs text-gray-400">{t('vendor.productsAndServices')}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {t('vendor.storeActive')}
              </span>
              <button className="text-xs font-bold text-honey hover:underline">{t('vendor.viewStore')}</button>
            </div>
          </div>

          {!collapsed && <p className="mt-6 px-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gray-500">{t('vendor.workspace')}</p>}

          <nav className="mt-2 space-y-1">
            {sidebarItems.map(({ label, icon: Icon, active, badge, badgeTone }) => {
              const IconComp = Icon;
              return (
                // Collapsed, the button shows an icon and nothing else, so it
                // carries its own accessible name; the tooltip is decoration.
                <SidebarTooltip key={label} label={t(label)} enabled={collapsed}>
                  <button
                    aria-label={collapsed ? t(label) : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? 'bg-honey text-charcoal font-bold' : 'text-gray-300 hover:bg-white/10 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}
                  >
                    <IconComp className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="flex-1 text-left">{t(label)}</span>}
                    {!collapsed && badge && <span className={`rounded-full px-2 py-0.5 text-[11px] ${badgeTone ?? 'bg-honey text-charcoal'}`}>{badge}</span>}
                  </button>
                </SidebarTooltip>
              );
            })}
          </nav>

          {!collapsed && (
            <button className="mt-6 flex w-full items-center px-3 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-gray-500" aria-expanded="true">
              <span>{t('vendor.business')}</span>
              <ChevronDown className="ml-auto h-4 w-4" />
            </button>
          )}

          <nav className="mt-2 space-y-1">
                {businessItems.map(({ label, icon: Icon, href }) => {
                  const active = (href === '#store-profile' && onStoreProfile) || (href === '#platform-fees' && onPlatformFees);
                  const tone = active
                    ? 'bg-honey text-charcoal'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white';

                  if (href) {
                    return (
                      <SidebarTooltip key={label} label={t(label)} enabled={collapsed}>
                        <a
                          href={href}
                          onClick={() => setSidebarOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          aria-label={collapsed ? t(label) : undefined}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${tone} ${collapsed ? 'justify-center' : ''}`}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {!collapsed && <span className="flex-1 text-left">{t(label)}</span>}
                        </a>
                      </SidebarTooltip>
                    );
                  }

                  return (
                    <SidebarTooltip key={label} label={t(label)} enabled={collapsed}>
                      <button
                        aria-label={collapsed ? t(label) : undefined}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${tone} ${collapsed ? 'justify-center' : ''}`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span className="flex-1 text-left">{t(label)}</span>}
                      </button>
                    </SidebarTooltip>
                  );
                })}
          </nav>

          {!collapsed && (
            <>

              <div className="mt-6 rounded-2xl bg-gradient-to-br from-honey to-amber p-4 text-charcoal">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{t('vendor.growthPlan')}</span>
                  <span className="text-xs font-extrabold">72%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/60">
                  <div className="h-full w-[72%] rounded-full bg-charcoal" />
                </div>
                <button className="mt-3 w-full rounded-lg bg-charcoal py-2 text-xs font-extrabold text-white hover:bg-black">{t('vendor.upgradePlan')}</button>
              </div>

              <button className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white">
                <LogOut className="h-5 w-5" />
                <span>{t('vendor.logOut')}</span>
              </button>
            </>
          )}
        </div>
      </aside>

      <div className={`min-h-screen transition-all ${collapsed ? 'lg:pl-[84px]' : 'lg:pl-[270px]'}`}>
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center gap-3 px-4 sm:px-6">
            <button className="rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label={t('nav.openNavigation')}>
              <Menu className="h-5 w-5" />
            </button>
            <button className="hidden rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50 lg:block" onClick={() => setCollapsed((current) => !current)} aria-label={t('vendor.collapseSidebar')}>
              <LayoutDashboard className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="hidden text-xs font-semibold text-gray-500 sm:block">
                {t('vendor.breadcrumb', { section: t(section) })}
              </p>
              <h1 className="truncate text-lg font-extrabold sm:text-xl">
                {onStoreProfile || onPlatformFees ? t(section) : t('vendor.dashboard')}
              </h1>
            </div>

            <div className="relative ml-auto hidden w-full max-w-sm xl:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input type="search" placeholder={t('vendor.searchPlaceholder')} className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-honey focus:bg-white focus:outline-none" />
            </div>

            <div ref={topActions} className="flex items-center gap-3">

              {/* Create New menu */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('create')}
                  aria-haspopup="menu"
                  aria-expanded={openMenu === 'create'}
                  className="hidden items-center gap-2 rounded-xl bg-honey px-4 py-2.5 text-sm font-extrabold hover:bg-amber sm:flex"
                >
                  <Plus className="h-4 w-4" />
                  {t('vendor.createNew')}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === 'create' ? 'rotate-180' : ''}`} />
                </button>

                {openMenu === 'create' && (
                  <div role="menu" onKeyDown={handleMenuKeys} className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-gray-300 bg-white py-2 shadow-2xl ring-1 ring-charcoal/10">
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 pb-2 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{t('vendor.create')}</span>
                      <MenuCloseButton onClose={() => setOpenMenu(null)} />
                    </div>
                    {createMenu.map(({ label, hint, icon: Icon }) => (
                      <button
                        key={label}
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-softyellow/60"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-honey/15 text-charcoal">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-charcoal">{t(label)}</span>
                          <span className="block text-xs text-gray-500">{t(hint)}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <LanguageMenu
                open={openMenu === 'language'}
                onToggle={() => toggleMenu('language')}
                onClose={() => setOpenMenu(null)}
                buttonClassName="flex items-center gap-1 rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50"
              />

              {/* Messages menu */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => toggleMenu('messages')}
                  aria-haspopup="menu"
                  aria-expanded={openMenu === 'messages'}
                  className="relative rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50"
                  aria-label={t('vendor.navMessages')}
                >
                  <MessageSquareText className="h-5 w-5" />
                  {msgCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brandInfo px-1 text-[10px] font-bold text-white">
                      {msgCount}
                    </span>
                  )}
                </button>

                {openMenu === 'messages' && (
                  <div role="menu" onKeyDown={handleMenuKeys} className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-gray-300 bg-white py-2 shadow-2xl ring-1 ring-charcoal/10 sm:w-96">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
                      <h3 className="text-sm font-extrabold text-charcoal">{t('vendor.navMessages')}</h3>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setMsgCount(0)} className="text-xs font-bold text-[#8A5900] hover:underline">{t('vendor.markAsRead')}</button>
                        <MenuCloseButton onClose={() => setOpenMenu(null)} />
                      </div>
                    </div>
                    <div className="max-h-80 divide-y divide-gray-50 overflow-y-auto">
                      {topMessages.map((message) => (
                        <button
                          key={message.name}
                          role="menuitem"
                          onClick={() => setOpenMenu(null)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
                        >
                          <img src={message.avatar} alt={message.name} className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                          <span className="min-w-0 flex-1">
                            <span className="flex justify-between gap-2">
                              <strong className="text-sm text-charcoal">{message.name}</strong>
                              <span className="text-[11px] text-gray-500">{message.when}</span>
                            </span>
                            <span className="block truncate text-xs text-gray-500">{message.preview}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 px-4 py-2 text-center">
                      <a href="#" className="text-xs font-bold text-charcoal hover:text-amber">{t('vendor.openInbox')}</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications menu */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('notifications')}
                  aria-haspopup="menu"
                  aria-expanded={openMenu === 'notifications'}
                  className="relative rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50"
                  aria-label={t('admin.notifications')}
                >
                  <Bell className="h-5 w-5" />
                  {notifCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {notifCount}
                    </span>
                  )}
                </button>

                {openMenu === 'notifications' && (
                  <div role="menu" onKeyDown={handleMenuKeys} className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-gray-300 bg-white py-2 shadow-2xl ring-1 ring-charcoal/10 sm:w-96">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
                      <h3 className="text-sm font-extrabold text-charcoal">{t('admin.notifications')}</h3>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setNotifCount(0)} className="text-xs font-bold text-[#8A5900] hover:underline">{t('admin.markAllRead')}</button>
                        <MenuCloseButton onClose={() => setOpenMenu(null)} />
                      </div>
                    </div>
                    <div className="max-h-80 divide-y divide-gray-50 overflow-y-auto">
                      {notifications.map(({ icon: Icon, tone, text, when }) => (
                        <button
                          key={text}
                          role="menuitem"
                          onClick={() => setOpenMenu(null)}
                          className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-gray-50"
                        >
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-semibold text-charcoal">{text}</span>
                            <span className="text-[11px] text-gray-500">{when}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 px-4 py-2 text-center">
                      <a href="#" className="text-xs font-bold text-charcoal hover:text-amber">{t('vendor.viewAllActivity')}</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile menu */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu('profile')}
                  aria-haspopup="menu"
                  aria-expanded={openMenu === 'profile'}
                  aria-label={t('admin.accountMenu')}
                  className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-50"
                >
                  <Avatar user={user} className="h-9 w-9 shrink-0 rounded-xl" fallbackTone="bg-honey text-charcoal" />
                  <span className="hidden text-left lg:block">
                    <span className="block text-sm font-extrabold">{(user?.name ?? t('vendor.vendor')).split(' ')[0]}</span>
                    <span className="block text-[11px] text-gray-500">{t('vendor.owner')}</span>
                  </span>
                  <ChevronDown className={`hidden h-4 w-4 transition-transform lg:block ${openMenu === 'profile' ? 'rotate-180' : ''}`} />
                </button>

                {openMenu === 'profile' && (
                  <div role="menu" onKeyDown={handleMenuKeys} className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-gray-300 bg-white py-2 shadow-2xl ring-1 ring-charcoal/10">
                    <div className="flex items-start justify-between gap-2 border-b border-gray-100 px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-charcoal">{user?.name ?? t('vendor.vendor')}</p>
                        <p className="truncate text-[11px] text-gray-500">{user?.email ?? ''}</p>
                        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-softyellow px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#8A5900]">
                          <BadgeCheck className="h-3 w-3" />
                          {(user?.role ?? 'vendor').replace('-', ' ')}
                        </span>
                      </div>
                      <MenuCloseButton onClose={() => setOpenMenu(null)} />
                    </div>
                    <div className="py-1">
                      {profileMenu.map(({ label, hint, icon: Icon, href }) => (
                        <a
                          key={label}
                          role="menuitem"
                          href={href ?? '#'}
                          onClick={() => setOpenMenu(null)}
                          className="flex items-center gap-3 px-4 py-2 transition hover:bg-softyellow/60"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-gray-500" />
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-charcoal">{t(label)}</span>
                            <span className="block text-[11px] text-gray-500">{t(hint)}</span>
                          </span>
                        </a>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        role="menuitem"
                        onClick={() => { setOpenMenu(null); void logout(); }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t('auth.signOut')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {onStoreProfile ? <StoreProfilePage /> : onPlatformFees ? <PpfBreakdownPage embedded /> : (
        <main className="p-4 sm:p-6">
          <section className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
            <article className="relative overflow-hidden rounded-3xl bg-charcoal p-6 text-white shadow-soft sm:p-8">
              <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-honey/10" />
              <div className="relative">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-honey/30 bg-honey/10 px-3 py-1.5 text-xs font-bold text-honey">
                  <Sparkles className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h2 className="text-3xl font-extrabold sm:text-4xl">{t('vendor.greeting', { name: (user?.name ?? t('vendor.vendor')).split(' ')[0] })}</h2>
                <p className="mt-2 max-w-xl text-gray-300">{t('vendor.greetingIntro', { store: STORE_NAME })}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold hover:bg-white hover:text-charcoal">{t('vendor.viewStore')}</button>
                  <button className="rounded-xl bg-honey px-4 py-2.5 text-sm font-extrabold text-charcoal hover:bg-amber">{t('vendor.addProductOrService')}</button>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">{t('vendor.storeSetup')}</p>
                  <h2 className="mt-1 text-2xl font-extrabold">{t('vendor.percentComplete', { percent: 82 })}</h2>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softyellow text-amber">
                  <Store className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-gray-100">
                <div className="h-full w-[82%] rounded-full bg-honey" />
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {(['vendor.setupPayment', 'vendor.setupReturnPolicy', 'vendor.setupBanner'] as const).map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-3 w-3 rounded-full bg-amber" />
                    {t(item)}
                  </li>
                ))}
              </ul>
              <button className="mt-5 w-full rounded-xl bg-charcoal py-2.5 text-sm font-extrabold text-white hover:bg-black">{t('vendor.completeSetup')}</button>
            </article>
          </section>

          <section className="mt-6" aria-label={t('vendor.kpiLabel')}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              {kpis.map(({ label, value, delta, tone, icon: Icon }) => (
                <article key={label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-bold text-gray-500">↗</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-gray-500">{t(label)}</p>
                  <strong className="mt-1 block text-2xl font-extrabold">{value}</strong>
                  <p className="mt-2 text-xs font-bold text-success">{delta}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-6 grid gap-5 2xl:grid-cols-[1.65fr_1fr]">
            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-500">{t('vendor.performance')}</p>
                  <h2 className="text-xl font-extrabold">{t('vendor.salesOverview')}</h2>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-3xl font-extrabold">$24,860</span>
                    <span className="mb-1 text-xs font-bold text-success">↗ 12.5%</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold">
                    <option>{t('vendor.last30Days')}</option>
                    <option>{t('vendor.last7Days')}</option>
                    <option>{t('vendor.last90Days')}</option>
                  </select>
                  <button className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold hover:bg-gray-50">
                    <Download className="mr-1 inline h-4 w-4" />{t('vendor.report')}
                  </button>
                </div>
              </div>
              <div className="mt-5 h-72 rounded-2xl bg-gradient-to-br from-amber/5 via-white to-white p-3">
                <div className="flex h-full items-end gap-3 px-2">
                  {[36, 58, 44, 67, 76, 58, 90].map((height, index) => (
                    <div key={height + index} className="flex flex-1 flex-col items-center justify-end gap-2">
                      <div className="w-full rounded-t-2xl bg-gradient-to-t from-amber to-honey" style={{ height: `${height}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div>
                <p className="text-sm font-bold text-gray-500">{t('vendor.sources')}</p>
                <h2 className="text-xl font-extrabold">{t('vendor.revenueBreakdown')}</h2>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-[conic-gradient(#F7B928_0_58%,#242424_58%_85%,#2563EB_85%_94%,#E5E7EB_94%_100%)]">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-xl font-extrabold text-charcoal">58%</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-gray-500">{t('vendor.grossRevenue')}</span><strong className="mt-1 block">$28,920</strong></div>
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-gray-500">{t('vendor.marketplaceFees')}</span><strong className="mt-1 block">−$2,315</strong></div>
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-gray-500">{t('vendor.refunds')}</span><strong className="mt-1 block">−$1,745</strong></div>
                <div className="rounded-xl bg-softyellow p-3"><span className="text-[#735000]">{t('vendor.netEarnings')}</span><strong className="mt-1 block">$24,860</strong></div>
              </div>
            </article>
          </section>

          <section className="mt-6 rounded-3xl border border-gray-200 bg-white shadow-soft" aria-label={t('vendor.recentOrders')}>
            <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-sm font-bold text-gray-500">{t('vendor.commerce')}</p>
                <h2 className="text-xl font-extrabold">{t('vendor.recentOrders')}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="relative flex-1 sm:flex-none">
                  <span className="sr-only">{t('vendor.searchOrders')}</span>
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input type="search" placeholder={t('vendor.searchOrders')} className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm sm:w-48" />
                </label>
                <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm">
                  <option>{t('vendor.allStatuses')}</option>
                  <option>{t('vendor.statusPaid')}</option>
                  <option>{t('vendor.statusPending')}</option>
                  <option>{t('vendor.statusRefunded')}</option>
                </select>
                <button className="rounded-xl bg-charcoal px-3 py-2 text-sm font-bold text-white">{t('vendor.viewAll')}</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4">{t('vendor.colOrder')}</th>
                    <th className="px-4 py-4">{t('vendor.colCustomer')}</th>
                    <th className="px-4 py-4">{t('vendor.colProduct')}</th>
                    <th className="px-4 py-4">{t('vendor.colDate')}</th>
                    <th className="px-4 py-4">{t('vendor.colAmount')}</th>
                    <th className="px-4 py-4">{t('vendor.colPayment')}</th>
                    <th className="px-4 py-4">{t('vendor.colFulfillment')}</th>
                    <th className="px-4 py-4 text-right">{t('vendor.colActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(({ number, customer, product, date, amount, payment, status }) => (
                    <tr key={number} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-extrabold">#{number}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <img src="https://i.pravatar.cc/96?img=12" alt={customer} className="h-10 w-10 rounded-xl object-cover" />
                          <span className="font-semibold">{customer}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{product}</td>
                      <td className="px-4 py-4 text-gray-500">{date}</td>
                      <td className="px-4 py-4 font-bold">{formatMoney(amount, locale)}</td>
                      <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getBadgeClass(payment)}`}>{payment}</span></td>
                      <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getBadgeClass(status)}`}>{status}</span></td>
                      <td className="px-4 py-4 text-right"><button className="rounded-lg p-2 hover:bg-gray-100"><ChevronRight className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-6 grid gap-5 2xl:grid-cols-2">
            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500">{t('vendor.schedule')}</p>
                  <h2 className="text-xl font-extrabold">{t('vendor.upcomingBookings')}</h2>
                </div>
                <div className="flex rounded-xl bg-gray-100 p-1">
                  <button className="rounded-lg bg-white p-2 shadow-sm"><CalendarCheck2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {bookingFeed.map(({ title, guest, when, location, value, state }) => (
                  <div key={title} className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-3 sm:flex-row sm:items-center">
                    <img src="https://i.pravatar.cc/96?img=15" alt={guest} className="h-10 w-10 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong>{title}</strong>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${getBadgeClass(state)}`}>{state}</span>
                      </div>
                      <p className="text-sm text-gray-500">{guest} · {when}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="mr-1">📍</span>{location}
                      </p>
                    </div>
                    <strong>{value}</strong>
                    <div className="flex gap-2">
                      <button className="rounded-lg border px-3 py-2 text-xs font-bold">{t('vendor.details')}</button>
                      <button className="rounded-lg bg-charcoal px-3 py-2 text-xs font-bold text-white">{t('vendor.message')}</button>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-500">{t('vendor.catalog')}</p>
                  <h2 className="text-xl font-extrabold">{t('vendor.inventoryOverview')}</h2>
                </div>
                <button className="rounded-xl bg-honey px-4 py-2 text-sm font-extrabold hover:bg-amber"><Plus className="mr-1 inline h-4 w-4" />{t('vendor.addProduct')}</button>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-xl bg-gray-50 p-2"><strong className="block text-lg">42</strong>{t('vendor.invActive')}</div>
                <div className="rounded-xl bg-red-50 p-2 text-danger"><strong className="block text-lg">2</strong>{t('vendor.invOut')}</div>
                <div className="rounded-xl bg-amber-50 p-2 text-[#8A5900]"><strong className="block text-lg">5</strong>{t('vendor.invLow')}</div>
                <div className="rounded-xl bg-gray-50 p-2"><strong className="block text-lg">7</strong>{t('vendor.invDrafts')}</div>
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-[#735000]">
                <span className="mt-0.5 text-lg">⚠</span>
                <span>{t('vendor.inventoryWarning')}</span>
              </div>
              <div className="mt-3 space-y-3">
                {inventory.map((item) => (
                  <div key={item.sku} className="flex items-center gap-3 py-2">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80" alt={item.name} className="h-11 w-11 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-sm">{item.name}</strong>
                      <span className="text-xs text-gray-500">{item.sku} · {formatMoney(item.price, locale)}</span>
                    </div>
                    <div className="text-right">
                      <strong className={`block text-sm ${item.units === 0 ? 'text-danger' : item.units <= item.threshold ? 'text-[#8A5900]' : ''}`}>{t('vendor.units', { count: item.units })}</strong>
                      <span className="text-[11px] text-gray-500">{t('vendor.threshold', { count: item.threshold })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-6 grid gap-5 2xl:grid-cols-[1.35fr_1fr]">
            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-500">{t('vendor.performance')}</p>
                  <h2 className="text-xl font-extrabold">{t('vendor.topListings')}</h2>
                </div>
                <div className="flex rounded-xl bg-gray-100 p-1">
                  {(['All', 'Product', 'Service'] as const).map((filter) => (
                    <button key={filter} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${activeFilter === filter ? 'bg-charcoal text-white' : ''}`} onClick={() => setActiveFilter(filter)}>
                      {t(`vendor.filter${filter}` as MessageKey)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {listings.filter((listing) => activeFilter === 'All' || listing.type === activeFilter).map((listing, index) => (
                  <div key={listing.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-gray-50 p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-softyellow font-extrabold">{index + 1}</span>
                    <div className="min-w-0">
                      <div className="flex gap-2">
                        <strong className="truncate text-sm">{listing.name}</strong>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-500">{listing.type}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{t('vendor.listingStats', { views: listing.views.toLocaleString(locale), sales: listing.sales, conversion: listing.conversion })}</p>
                    </div>
                    <div className="text-right">
                      <strong className="block text-sm">{listing.revenue}</strong>
                      <span className={`text-xs ${listing.trend === 'up' ? 'text-success' : 'text-danger'}`}>{listing.trend === 'up' ? '↑' : '↓'} {t('vendor.trend')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div>
                <p className="text-sm font-bold text-gray-500">{t('vendor.audience')}</p>
                <h2 className="text-xl font-extrabold">{t('vendor.customerActivity')}</h2>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-xs text-gray-500">{t('vendor.newCustomers')}</span><strong className="mt-1 block text-xl">186</strong></div>
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-xs text-gray-500">{t('vendor.returning')}</span><strong className="mt-1 block text-xl">124</strong></div>
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-xs text-gray-500">{t('vendor.repeatRate')}</span><strong className="mt-1 block text-xl">40%</strong></div>
                <div className="rounded-xl bg-softyellow p-3"><span className="text-xs text-[#735000]">{t('vendor.avgValue')}</span><strong className="mt-1 block text-xl">$80.19</strong></div>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[60%] bg-honey" />
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500"><span>{t('vendor.percentNew', { percent: 60 })}</span><span>{t('vendor.percentReturning', { percent: 40 })}</span></div>
              <div className="mt-5 space-y-3">
                {customerFeed.map(({ title, time }) => (
                  <div key={title} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-amber">
                      <ShoppingBag className="h-4 w-4" />
                    </span>
                    <p className="min-w-0 flex-1 truncate text-sm">{title}</p>
                    <span className="text-xs text-gray-500">{time}</span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-6 grid gap-5 2xl:grid-cols-[1.35fr_1fr]">
            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-bold text-gray-500">{t('vendor.reputation')}</p>
                  <h2 className="text-xl font-extrabold">{t('vendor.reviewsRatings')}</h2>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-4xl font-extrabold">4.9</span>
                    <div>
                      <div className="flex text-honey">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{t('vendor.reviewCount', { count: 327 })}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3"><span className="text-gray-500">{t('vendor.responseRate')}</span><strong className="block text-lg">96%</strong></div>
                  <div className="rounded-xl bg-gray-50 p-3"><span className="text-gray-500">{t('vendor.avgResponse')}</span><strong className="block text-lg">42 min</strong></div>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500">{t('vendor.inbox')}</p>
                  <h2 className="text-xl font-extrabold">{t('vendor.navMessages')}</h2>
                </div>
                <button className="text-sm font-extrabold text-[#8A5900] hover:underline">{t('vendor.viewAll')}</button>
              </div>
              <label className="relative mt-4 block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input value={messageSearch} onChange={(event) => setMessageSearch(event.target.value)} type="search" placeholder={t('vendor.searchConversations')} className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm" />
              </label>
              <div className="mt-3 divide-y">
                {['Mia Carter', 'Ethan Clark', 'Priya Shah', 'Marcus Lee'].filter((person) => person.toLowerCase().includes(messageSearch.toLowerCase())).map((person) => (
                  <button key={person} className="flex w-full items-center gap-3 py-3 text-left hover:bg-gray-50">
                    <div className="relative">
                      <img src="https://i.pravatar.cc/96?img=13" alt={person} className="h-10 w-10 rounded-xl object-cover" />
                      <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-success" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <strong className="text-sm">{person}</strong>
                        <span className="text-[11px] text-gray-500">2 min</span>
                      </div>
                      <span className="block truncate text-xs text-gray-500">Is gift wrapping available?</span>
                    </div>
                  </button>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-6 grid gap-5 2xl:grid-cols-2">
            <article className="rounded-3xl border border-gray-200 bg-charcoal p-5 text-white shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-400">{t('vendor.financialSummary')}</p>
                  <h2 className="text-xl font-extrabold">{t('vendor.availableBalance')}</h2>
                  <p className="mt-2 text-4xl font-extrabold text-honey">$8,462.38</p>
                </div>
                <button className="rounded-xl bg-honey px-4 py-2.5 text-sm font-extrabold text-charcoal hover:bg-amber">{t('vendor.withdrawFunds')}</button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-white/[.07] p-3"><span className="text-xs text-gray-400">{t('vendor.statusPending')}</span><strong className="mt-1 block">$1,280.00</strong></div>
                <div className="rounded-xl bg-white/[.07] p-3"><span className="text-xs text-gray-400">{t('vendor.nextPayout')}</span><strong className="mt-1 block">$2,840.15</strong></div>
                <div className="rounded-xl bg-white/[.07] p-3"><span className="text-xs text-gray-400">{t('vendor.payoutDate')}</span><strong className="mt-1 block">Sep 22</strong></div>
                <div className="rounded-xl bg-white/[.07] p-3"><span className="text-xs text-gray-400">{t('vendor.lifetime')}</span><strong className="mt-1 block">$142,806</strong></div>
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-500">{t('vendor.marketing')}</p>
                  <h2 className="text-xl font-extrabold">{t('vendor.promotionsAdvertising')}</h2>
                </div>
                <button className="rounded-xl bg-honey px-4 py-2 text-sm font-extrabold hover:bg-amber">{t('vendor.createPromotion')}</button>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  ['Weekend Product Sale', 'Sep 18–22', 'Active'],
                  ['New Customer Discount', 'Sep 1–30', 'Active'],
                  ['Featured Service Promotion', 'Sep 10–24', 'Paused'],
                ].map(([name, date, state]) => (
                  <div key={name} className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <strong>{name}</strong>
                        <p className="mt-1 text-xs text-gray-500">{date}</p>
                      </div>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${state === 'Active' ? 'bg-green-50 text-success' : 'bg-amber-50 text-[#8A5900]'}`}>{state}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-6 grid gap-5 2xl:grid-cols-[1.35fr_1fr]">
            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div>
                <p className="text-sm font-bold text-gray-500">{t('vendor.personalizedGuidance')}</p>
                <h2 className="text-xl font-extrabold">{t('vendor.insights')}</h2>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {([
                  ['high', 'vendor.insightRestock', 'vendor.insightRestockBody'],
                  ['high', 'vendor.insightReviews', 'vendor.insightReviewsBody'],
                  ['medium', 'vendor.insightPromote', 'vendor.insightPromoteBody'],
                  ['medium', 'vendor.insightAvailability', 'vendor.insightAvailabilityBody'],
                ] as const).map(([priority, title, description]) => (
                  <div key={title} className="rounded-2xl border border-gray-100 p-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-extrabold ${priority === 'high' ? 'bg-red-50 text-danger' : 'bg-amber-50 text-[#8A5900]'}`}>
                      {t('vendor.priorityLabel', { level: priority === 'high' ? t('vendor.priorityHigh') : t('vendor.priorityMedium') })}
                    </span>
                    <h3 className="mt-3 font-extrabold">{t(title)}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t(description)}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500">{t('vendor.stayOnTrack')}</p>
                  <h2 className="text-xl font-extrabold">{t('vendor.tasksReminders')}</h2>
                </div>
                <button className="text-xs font-bold text-[#8A5900] hover:underline" onClick={() => setShowCompleted((current) => !current)}>
                  {showCompleted ? t('vendor.hideCompleted') : t('vendor.showCompleted')}
                </button>
              </div>
              <form onSubmit={addTask} className="mt-4 flex gap-2">
                <input name="task" required maxLength={80} placeholder={t('vendor.addTask')} className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                <button className="rounded-xl bg-charcoal px-4 text-sm font-bold text-white">{t('common.add')}</button>
              </form>
              <div className="mt-4 space-y-2">
                {visibleTasks.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500">{t('vendor.noTasks')}</div>
                ) : (
                  visibleTasks.map((task) => (
                    <div key={task.id} className={`flex items-center gap-3 rounded-xl border border-gray-100 p-3 ${task.done ? 'opacity-55' : ''}`}>
                      <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="h-4 w-4" />
                      <span className={`min-w-0 flex-1 text-sm ${task.done ? 'line-through' : ''}`}>{task.text}</span>
                      <button className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-danger" onClick={() => setTaskList((current) => current.filter((item) => item.id !== task.id))} aria-label={t('vendor.removeTask')}>×</button>
                    </div>
                  ))
                )}
              </div>
            </article>
          </section>
        </main>
        )}

        <footer className="mt-6 border-t border-gray-200 bg-white px-6 py-6 text-xs text-gray-500">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p>{t('vendor.footerCopy', { year: new Date().getFullYear(), version: '2.4.0' })}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="hover:text-charcoal">{t('vendor.privacyPolicy')}</a>
              <a href="#" className="hover:text-charcoal">{t('vendor.vendorTerms')}</a>
              <a href="#" className="hover:text-charcoal">{t('vendor.helpCenter')}</a>
              <span className="inline-flex items-center gap-2 text-success"><span className="h-2 w-2 rounded-full bg-success" />{t('vendor.systemOperational')}</span>
            </div>
            <p className="font-bold text-charcoal">{t('vendor.poweredBy')} As<span className="text-amber">Beez</span></p>
          </div>
        </footer>
      </div>
    </div>
  );
}
