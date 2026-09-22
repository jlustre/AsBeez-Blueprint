import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Briefcase,
  Calendar,
  CalendarCheck,
  ChartColumn,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  CirclePlus,
  Clock,
  Compass,
  CreditCard,
  Crown,
  EllipsisVertical,
  Globe,
  Gift,
  Heart,
  Hexagon,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Plus,
  Receipt,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Tag,
  Truck,
  User,
  Video,
  Wallet,
  X,
} from 'lucide-react';

import { useAuth } from '../../auth/AuthProvider';
import { SidebarTooltip } from '../ui/SidebarTooltip';
import { SUPPORTED_LOCALES, useTranslation, type MessageKey } from '../../i18n';
import { handleMenuKeys } from '../../lib/menu';
import { Avatar } from '../ui/Avatar';
import { LanguageMenu } from '../ui/LanguageMenu';
import { MenuCloseButton } from '../ui/MenuCloseButton';

type Icon = ComponentType<{ className?: string }>;

type NavLink = {
  label: MessageKey;
  icon: Icon;
  href?: string;
  /** Derived from the route hash at render time, never hard-coded. */
  active?: boolean;
  accent?: boolean;
  badge?: { text: string; tone: string };
  /** Each entry is a message key plus the count interpolated into it. */
  submenu?: { label: MessageKey; count: number }[];
};

const navGroups: { title: MessageKey; links: NavLink[] }[] = [
  {
    title: 'member.groupMain',
    links: [
      { label: 'nav.dashboard', icon: LayoutDashboard, href: '#member-dashboard' },
      { label: 'member.navDiscover', icon: Compass },
      { label: 'member.navFavorites', icon: Heart },
      { label: 'member.navRecentlyViewed', icon: Clock },
    ],
  },
  {
    title: 'member.groupTransactions',
    links: [
      { label: 'member.navMyOrders', icon: ShoppingBag },
      { label: 'member.navServiceBookings', icon: Calendar },
      { label: 'member.navPurchaseHistory', icon: Receipt },
      { label: 'member.navReturns', icon: RotateCcw },
      { label: 'member.navPaymentMethods', icon: CreditCard },
    ],
  },
  {
    title: 'member.groupMarketplace',
    links: [
      {
        label: 'member.navMyListings',
        icon: Store,
        badge: { text: '5', tone: 'bg-honey/20 text-honey' },
        submenu: [
          { label: 'member.subActiveProducts', count: 3 },
          { label: 'member.subServicesOffered', count: 2 },
          { label: 'member.subDrafts', count: 1 },
        ],
      },
      { label: 'member.navCreateListing', icon: CirclePlus, accent: true },
      { label: 'member.navSellerDashboard', icon: ChartColumn },
      { label: 'member.navProviderProfile', icon: Briefcase },
      { label: 'member.navReviews', icon: Star },
    ],
  },
  {
    title: 'member.groupCommunication',
    links: [
      { label: 'member.navMessages', icon: MessageSquare, badge: { text: '3', tone: 'bg-honey text-charcoal' } },
      { label: 'member.navNotifications', icon: Bell, badge: { text: '7', tone: 'bg-brandInfo text-white' } },
      { label: 'member.navSupportTickets', icon: LifeBuoy },
    ],
  },
  {
    title: 'member.groupAccount',
    links: [
      { label: 'member.navProfile', icon: User, href: '#member-profile' },
      { label: 'member.navRewardPoints', icon: Gift, href: '#member-rewards' },
      { label: 'member.navAddresses', icon: MapPin },
      { label: 'member.navSecurity', icon: ShieldCheck },
      { label: 'member.navPreferences', icon: SlidersHorizontal },
      { label: 'member.navMembership', icon: Crown },
    ],
  },
];

/*
 * The rows below (orders, bookings, recommendations, conversations, activity,
 * saved items, dropdown feeds) are demo data standing in for endpoints that do
 * not exist yet, so their values carry no message keys: they will be replaced
 * wholesale, not translated. Labels that outlive the fixtures do carry keys.
 */
const stats = [
  {
    label: 'member.statActiveOrders',
    value: '4',
    icon: ShoppingBag,
    tone: 'bg-honey/15 text-honey-amber',
    footIcon: Truck,
    foot: 'member.statActiveOrdersFoot',
    footTone: 'text-brandSuccess',
  },
  {
    label: 'member.statUpcomingBookings',
    value: '3',
    icon: Calendar,
    tone: 'bg-blue-50 text-brandInfo',
    footIcon: Clock,
    foot: 'member.statUpcomingBookingsFoot',
    footTone: 'text-brandInfo',
  },
  {
    label: 'member.statSavedItems',
    value: '18',
    icon: Heart,
    tone: 'bg-red-50 text-red-500',
    foot: 'member.statSavedItemsFoot',
    footTone: 'text-brandMuted',
  },
  {
    label: 'member.statUnreadMessages',
    value: '3',
    icon: MessageSquare,
    tone: 'bg-amber-50 text-honey-amber',
    foot: 'member.statUnreadMessagesFoot',
    footTone: 'text-honey-amber',
  },
] as const;

type Order = {
  id: string;
  item: string;
  seller: string;
  date: string;
  total: string;
  status: string;
  statusTone: string;
  dotTone: string;
  action: string;
  actionTone: string;
  /** Present only for the orders the template also lists in its mobile card view. */
  mobileAction?: string;
};

const orders: Order[] = [
  {
    id: '#ASB-9482',
    item: 'Artisanal Wildflower Honey (3-Pack)',
    seller: 'BeeHaven Apiaries',
    date: 'Sep 15, 2026',
    total: '$48.50',
    status: 'Shipped',
    statusTone: 'bg-blue-50 text-brandInfo',
    dotTone: 'bg-brandInfo',
    action: 'Track',
    actionTone: 'bg-gray-100 hover:bg-gray-200 text-charcoal font-medium',
    mobileAction: 'Track Package',
  },
  {
    id: '#ASB-9401',
    item: 'Handcrafted Ceramic Honey Jar',
    seller: 'CraftyHive Studio',
    date: 'Sep 12, 2026',
    total: '$34.00',
    status: 'Delivered',
    statusTone: 'bg-green-50 text-brandSuccess',
    dotTone: 'bg-brandSuccess',
    action: 'Buy Again',
    actionTone: 'bg-honey hover:bg-honey-hover text-charcoal font-semibold',
    mobileAction: 'Buy Again',
  },
  {
    id: '#ASB-9311',
    item: 'Organic Beeswax Candle Set',
    seller: 'GoldenGlow Goods',
    date: 'Sep 10, 2026',
    total: '$29.99',
    status: 'Processing',
    statusTone: 'bg-amber-50 text-honey-amber',
    dotTone: 'bg-honey-amber',
    action: 'View Details',
    actionTone: 'bg-gray-100 hover:bg-gray-200 text-charcoal font-medium',
  },
];

const bookings = [
  {
    status: 'Confirmed',
    statusTone: 'bg-green-50 text-brandSuccess',
    rate: '$85/hr',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=150',
    title: 'Deep Home Cleaning',
    provider: 'CleanBee Co.',
    date: 'Tomorrow, Sep 18',
    time: '10:00 AM - 12:00 PM',
    placeIcon: MapPin,
    place: '123 Hive St, San Pablo',
  },
  {
    status: 'Upcoming',
    statusTone: 'bg-blue-50 text-brandInfo',
    rate: '$120/hr',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    title: 'Web Dev Consultation',
    provider: 'Sarah Jenkins',
    date: 'Mon, Sep 21',
    time: '2:00 PM - 3:00 PM',
    placeIcon: Video,
    place: 'Online (AsBeez Meet)',
  },
  {
    status: 'Pending',
    statusTone: 'bg-amber-50 text-honey-amber',
    rate: '$95/hr',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    title: 'Accounting Audit',
    provider: 'Marcus Vance',
    date: 'Thu, Sep 24',
    time: '11:00 AM - 12:00 PM',
    placeIcon: Video,
    place: 'Online Call',
  },
] as const;

const recommendations = [
  {
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=300',
    kind: 'Product',
    rating: '4.9',
    reviews: '(128 reviews)',
    title: 'Raw Organic Comb Honey',
    by: 'By SweetHive Farm',
    price: '$24.50',
    cta: 'View Details',
  },
  {
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=300',
    kind: 'Service',
    rating: '5.0',
    reviews: '(42 reviews)',
    title: 'Smart Home Installation',
    by: 'By VoltBee Solutions',
    price: '$75/hr',
    cta: 'Book Now',
  },
  {
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=300',
    kind: 'Product',
    rating: '4.8',
    reviews: '(96 reviews)',
    title: 'Natural Beeswax Lip Balm Balm Set',
    by: 'By HoneyGlow Organics',
    price: '$16.00',
    cta: 'View Details',
  },
  {
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300',
    kind: 'Service',
    rating: '4.95',
    reviews: '(31 reviews)',
    title: 'Private Baking & Honey Desserts Workshop',
    by: 'By Chef Antoine',
    price: '$60/person',
    cta: 'Book Now',
  },
] as const;

const conversations = [
  {
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
    name: 'Alex Morgan',
    when: '10:42 AM',
    preview: 'Is the vintage honey dispenser still available for local pickup?',
    re: 'Re: Listing #ASB-8841',
    online: true,
  },
  {
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    name: 'Sarah Jenkins',
    when: 'Yesterday',
    preview: "I'll arrive tomorrow at 10 AM for the web consultation session.",
    re: 'Re: Booking #302',
    online: true,
  },
  {
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    name: 'Marcus Vance',
    when: 'Sep 15',
    preview: "Thanks for submitting the tax documents. I'll review them shortly.",
    re: 'Re: Booking #298',
    online: false,
  },
] as const;

const activity = [
  { icon: Truck, tone: 'bg-blue-100 text-brandInfo', text: <>Order <span className="font-bold">#ASB-9482</span> has shipped via BeeExpress.</>, when: '25 minutes ago' },
  { icon: CalendarCheck, tone: 'bg-green-100 text-brandSuccess', text: <>Booking confirmed with <span className="font-bold">CleanBee Services</span>.</>, when: '2 hours ago' },
  { icon: Tag, tone: 'bg-amber-100 text-honey-amber', text: <>Price dropped 15% on saved item <span className="font-bold">Comb Honey</span>.</>, when: 'Yesterday' },
  { icon: Star, tone: 'bg-purple-100 text-purple-600', text: <>Please leave a review for order <span className="font-bold">#ASB-9401</span>.</>, when: '3 days ago' },
];

const savedItems = [
  { image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=100', title: 'Raw Wildflower Honey', price: '$24.50' },
  { image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=100', title: 'Beeswax Candle Set', price: '$19.00' },
] as const;

const dropdownMessages = [
  {
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100',
    name: 'Alex Morgan',
    when: '10m ago',
    preview: 'Is the vintage honey dispenser still available for pickup?',
    re: 'Item #8841',
  },
  {
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100',
    name: 'Sarah Jenkins',
    when: '1h ago',
    preview: "I'll arrive tomorrow at 10 AM for the web consultation.",
    re: 'Booking #302',
  },
] as const;

const dropdownNotifications = [
  { icon: Truck, tone: 'bg-blue-100 text-brandInfo', text: 'Order #ASB-9482 has been shipped!', when: '25 mins ago' },
  { icon: CheckCircle, tone: 'bg-green-100 text-brandSuccess', text: 'Booking confirmed with CleanBee Home Services.', when: '2 hours ago' },
] as const;

function greetingKey(hour: number): MessageKey {
  if (hour < 12) {
    return 'member.goodMorning';
  }

  return hour < 18 ? 'member.goodAfternoon' : 'member.goodEvening';
}

type MemberMenu = 'language' | 'messages' | 'notifications' | 'profile';

export function MemberDashboardPage({ mainContent }: { mainContent?: ReactNode } = {}) {
  const { t, locale } = useTranslation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [listingsOpen, setListingsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<MemberMenu | null>(null);
  const [alertVisible, setAlertVisible] = useState(true);
  const [messageCount, setMessageCount] = useState(3);
  const [notifCount, setNotifCount] = useState(7);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [readConversations, setReadConversations] = useState<string[]>([]);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [routeHash, setRouteHash] = useState(() => window.location.hash || '#member-dashboard');
  const carousel = useRef<HTMLDivElement>(null);
  const topBar = useRef<HTMLDivElement>(null);

  // The shell is shared by every member route, so the sidebar highlight and
  // the breadcrumb have to follow the hash rather than assume the dashboard.
  useEffect(() => {
    const onHashChange = () => setRouteHash(window.location.hash || '#member-dashboard');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const onMemberProfile = routeHash === '#member-profile';
  const now = new Date();
  const firstName = (user?.name ?? t('member.member')).split(' ')[0];

  // Any click outside the top bar closes whichever dropdown is open.
  useEffect(() => {
    if (!openDropdown) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (topBar.current && !topBar.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [openDropdown]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
        setLogoutOpen(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function toggleDropdown(name: MemberMenu) {
    setOpenDropdown((current) => (current === name ? null : name));
  }

  function toggleFavorite(title: string) {
    setFavorites((current) => (current.includes(title) ? current.filter((item) => item !== title) : [...current, title]));
  }

  function scrollCarousel(amount: number) {
    carousel.current?.scrollBy({ left: amount, behavior: 'smooth' });
  }

  // Sidebar labels collapse away with the rail; hidden rather than unmounted so
  // the icon rail keeps its spacing.
  const text = collapsed ? 'hidden' : '';

  return (
    <div className="min-h-screen bg-shell font-sans text-charcoal antialiased selection:bg-honey selection:text-charcoal">
      <div className="flex min-h-screen flex-col lg:flex-row">

        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* ========== 1. SIDEBAR ========== */}
        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen shrink-0 select-none flex-col justify-between overflow-hidden bg-charcoal text-white transition-all duration-300 ease-in-out lg:sticky lg:translate-x-0 ${collapsed ? 'w-20' : 'w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-charcoal-light px-4 py-4">
            <a href="#member-dashboard" className="flex items-center gap-3 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-honey">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-honey text-charcoal shadow-md shadow-honey/20">
                <Hexagon className="h-6 w-6" />
              </div>
              <div className={`transition-opacity duration-200 ${text}`}>
                <span className="block text-xl font-bold leading-none tracking-tight text-white">As<span className="text-honey">Beez</span></span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-honey">{t('member.portal')}</span>
              </div>
            </a>
            <button
              onClick={() => setCollapsed((value) => !value)}
              aria-label={t('member.toggleSidebar')}
              className="hidden rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-charcoal-light hover:text-white focus:outline-none focus:ring-2 focus:ring-honey lg:flex"
            >
              <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="hide-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4">

            {/* Member profile summary */}
            <div className={`space-y-2.5 rounded-xl border border-white/5 bg-charcoal-light/60 p-3 ${text}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar user={user} className="h-10 w-10 rounded-full ring-2 ring-honey" fallbackTone="bg-honey text-charcoal" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-charcoal bg-brandSuccess" title={t('member.online')} />
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h4 className="truncate text-sm font-semibold text-white">{user?.name ?? t('member.member')}</h4>
                    <BadgeCheck className="h-4 w-4 shrink-0 fill-honey/20 text-honey" />
                  </div>
                  <span className="block text-xs font-medium text-honey">
                    {user?.email_verified_at ? t('publicMember.verifiedMember') : t('member.unverifiedMember')}
                  </span>
                </div>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>{t('member.profileStatus')}</span>
                  <span className="font-semibold text-honey">85%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-charcoal">
                  <div className="h-full rounded-full bg-honey" style={{ width: '85%' }} />
                </div>
              </div>
            </div>

            {/* Navigation groups */}
            <nav className="space-y-6" aria-label={t('nav.mainNavigation')}>
              {navGroups.map((group) => (
                <div key={group.title}>
                  <h5 className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 ${text}`}>{t(group.title)}</h5>
                  <ul className="space-y-1">
                    {group.links.map((link) => {
                      const LinkIcon = link.icon;
                      const active = link.href !== undefined && link.href === routeHash;
                      const base = 'flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-honey';
                      const tone = active
                        ? 'bg-honey text-charcoal font-medium shadow-sm'
                        : 'text-gray-300 hover:bg-charcoal-light hover:text-white';

                      if (link.submenu) {
                        return (
                          <li key={link.label}>
                            <SidebarTooltip label={t(link.label)} enabled={collapsed}>
                            <button
                              onClick={() => setListingsOpen((value) => !value)}
                              aria-expanded={listingsOpen}
                              aria-label={collapsed ? t(link.label) : undefined}
                              className={`${base} ${tone}`}
                            >
                              <div className="flex items-center gap-3">
                                <LinkIcon className="h-5 w-5 shrink-0" />
                                <span className={`text-sm font-medium ${text}`}>{t(link.label)}</span>
                              </div>
                              <div className={`flex items-center gap-2 ${text}`}>
                                {link.badge && (
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${link.badge.tone}`}>{link.badge.text}</span>
                                )}
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${listingsOpen ? 'rotate-180' : ''}`} />
                              </div>
                            </button>
                            </SidebarTooltip>
                            {listingsOpen && (
                              <ul className="space-y-1 py-1 pl-9 pr-2">
                                {link.submenu.map((entry) => (
                                  <li key={entry.label}>
                                    <a href="#" className="block py-1.5 text-xs text-gray-400 transition-colors hover:text-white">{t(entry.label, { count: entry.count })}</a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      }

                      return (
                        <li key={link.label}>
                          <SidebarTooltip label={t(link.label)} enabled={collapsed}>
                          <a
                            href={link.href ?? '#'}
                            aria-current={active ? 'page' : undefined}
                            aria-label={collapsed ? t(link.label) : undefined}
                            onClick={() => setMobileOpen(false)}
                            className={`${base} ${tone}`}
                          >
                            <div className="flex items-center gap-3">
                              <LinkIcon className={`h-5 w-5 shrink-0 ${link.accent ? 'text-honey' : ''}`} />
                              <span className={`text-sm ${link.accent ? 'font-medium text-honey' : ''} ${text}`}>{t(link.label)}</span>
                            </div>
                            {link.badge && (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${link.badge.tone} ${text}`}>{link.badge.text}</span>
                            )}
                          </a>
                          </SidebarTooltip>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            {/* Promo banner */}
            <div className={`space-y-2 rounded-xl border border-honey/30 bg-gradient-to-br from-honey/20 to-honey-amber/30 p-4 text-center ${text}`}>
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-honey font-bold text-charcoal">
                <Sparkles className="h-4 w-4" />
              </div>
              <h5 className="text-xs font-bold uppercase tracking-wide text-white">{t('member.goldMember')}</h5>
              <p className="text-[11px] text-gray-300">{t('member.goldMemberBody')}</p>
              <button className="w-full rounded-lg bg-honey px-3 py-1.5 text-xs font-semibold text-charcoal transition-colors hover:bg-honey-hover focus:outline-none focus:ring-2 focus:ring-white">
                {t('member.upgradeNow')}
              </button>
            </div>
          </div>

          <div className="border-t border-charcoal-light p-3">
            <SidebarTooltip label={t('auth.signOut')} enabled={collapsed}>
            <button
              onClick={() => setLogoutOpen(true)}
              aria-label={collapsed ? t('auth.signOut') : undefined}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className={`text-sm font-medium ${text}`}>{t('auth.signOut')}</span>
            </button>
            </SidebarTooltip>
          </div>
        </aside>

        {/* ========== RIGHT SIDE: TOPNAV + CONTENT ========== */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* ========== 2. TOP NAVIGATION ========== */}
          <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white shadow-sm">
            <div ref={topBar} className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  aria-label={t('member.openDrawer')}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-honey lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <nav aria-label={t('nav.breadcrumb')} className="hidden truncate sm:block">
                  <ol className="flex items-center gap-2 text-xs text-brandMuted">
                    <li><a href="#" className="transition-colors hover:text-charcoal">{t('nav.home')}</a></li>
                    <li><ChevronRight className="h-3.5 w-3.5" /></li>
                    {onMemberProfile ? (
                      <>
                        <li><a href="#member-dashboard" className="transition-colors hover:text-charcoal">{t('member.dashboard')}</a></li>
                        <li><ChevronRight className="h-3.5 w-3.5" /></li>
                        <li className="truncate font-semibold text-charcoal" aria-current="page">{t('nav.memberProfile')}</li>
                      </>
                    ) : (
                      <li className="truncate font-semibold text-charcoal" aria-current="page">{t('member.dashboard')}</li>
                    )}
                  </ol>
                </nav>
              </div>

              <div className="mx-2 hidden max-w-2xl flex-1 md:block">
                <form onSubmit={(event) => event.preventDefault()} className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-100 transition-all focus-within:border-honey focus-within:ring-2 focus-within:ring-honey/30">
                  <select aria-label={t('nav.searchCategory')} className="cursor-pointer border-r border-gray-300 bg-transparent py-2.5 pl-3 pr-8 text-xs font-medium text-charcoal focus:outline-none">
                    <option>{t('nav.allCategories')}</option>
                    <option>{t('nav.products')}</option>
                    <option>{t('nav.services')}</option>
                    <option>{t('member.professionals')}</option>
                  </select>
                  <div className="relative flex flex-1 items-center">
                    <Search className="absolute left-3 h-4 w-4 text-brandMuted" />
                    <input
                      type="text"
                      placeholder={t('member.searchPlaceholder')}
                      className="w-full bg-transparent py-2.5 pl-9 pr-3 text-xs text-charcoal placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                  <button type="submit" aria-label={t('common.search')} className="flex shrink-0 items-center gap-1.5 bg-honey px-4 py-2.5 text-xs font-semibold text-charcoal transition-colors hover:bg-honey-hover">
                    <Search className="h-4 w-4" />
                    <span>{t('common.search')}</span>
                  </button>
                </form>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-honey md:hidden" aria-label={t('member.searchMarketplace')}>
                  <Search className="h-5 w-5" />
                </button>

                <a href="#" className="hidden items-center gap-1.5 rounded-xl bg-honey px-3.5 py-2 text-xs font-bold text-charcoal shadow-sm transition-all hover:bg-honey-hover focus:outline-none focus:ring-2 focus:ring-honey xl:flex">
                  <Plus className="h-4 w-4" />
                  <span>{t('member.createListing')}</span>
                </a>

                <LanguageMenu
                  open={openDropdown === 'language'}
                  onToggle={() => toggleDropdown('language')}
                  onClose={() => setOpenDropdown(null)}
                  buttonClassName="flex items-center gap-1 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-honey"
                />

                {/* Messages dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('messages')}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === 'messages'}
                    aria-label={t('member.navMessages')}
                    className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-honey"
                  >
                    <MessageSquare className="h-5 w-5" />
                    {messageCount > 0 && (
                      <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-honey text-[10px] font-bold text-charcoal ring-2 ring-white">{messageCount}</span>
                    )}
                  </button>

                  {openDropdown === 'messages' && (
                    <div role="menu" onKeyDown={handleMenuKeys} className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-gray-200 bg-white py-2 shadow-2xl ring-1 ring-charcoal/10 sm:w-96">
                      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
                        <h3 className="text-sm font-bold text-charcoal">{t('member.navMessages')}</h3>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setMessageCount(0)} className="text-xs font-medium text-honey-amber hover:underline">{t('vendor.markAsRead')}</button>
                          <MenuCloseButton onClose={() => setOpenDropdown(null)} />
                        </div>
                      </div>
                      <div className="max-h-80 divide-y divide-gray-50 overflow-y-auto">
                        {dropdownMessages.map((message) => (
                          <a
                            key={message.name}
                            role="menuitem"
                            href="#"
                            onClick={() => setOpenDropdown(null)}
                            className={`flex gap-3 p-3 transition-colors hover:bg-honey-cream/40 ${messageCount > 0 ? 'bg-honey-cream/20' : ''}`}
                          >
                            <img src={message.avatar} className="h-10 w-10 shrink-0 rounded-full object-cover" alt={t('member.avatarAlt', { name: message.name })} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-baseline justify-between">
                                <h4 className="truncate text-xs font-bold text-charcoal">{message.name}</h4>
                                <span className="text-[10px] text-brandMuted">{message.when}</span>
                              </div>
                              <p className="mt-0.5 truncate text-xs text-gray-600">{message.preview}</p>
                              <span className="text-[10px] font-medium text-honey-amber">{message.re}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 px-4 py-2 text-center">
                        <a href="#" className="text-xs font-semibold text-charcoal hover:text-honey-amber">{t('member.viewAllMessages')}</a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notifications dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('notifications')}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === 'notifications'}
                    aria-label={t('member.navNotifications')}
                    className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-honey"
                  >
                    <Bell className="h-5 w-5" />
                    {notifCount > 0 && (
                      <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brandInfo text-[10px] font-bold text-white ring-2 ring-white">{notifCount}</span>
                    )}
                  </button>

                  {openDropdown === 'notifications' && (
                    <div role="menu" onKeyDown={handleMenuKeys} className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-gray-200 bg-white py-2 shadow-2xl ring-1 ring-charcoal/10 sm:w-96">
                      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
                        <h3 className="text-sm font-bold text-charcoal">{t('member.navNotifications')}</h3>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setNotifCount(0)} className="text-xs font-medium text-honey-amber hover:underline">{t('member.clearAll')}</button>
                          <MenuCloseButton onClose={() => setOpenDropdown(null)} />
                        </div>
                      </div>
                      <div className="max-h-80 divide-y divide-gray-50 overflow-y-auto">
                        {dropdownNotifications.map(({ icon: NotifIcon, tone, text: body, when }) => (
                          <button
                            key={body}
                            role="menuitem"
                            onClick={() => setOpenDropdown(null)}
                            className="flex w-full gap-3 p-3 text-left transition-colors hover:bg-gray-50"
                          >
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tone}`}>
                              <NotifIcon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-xs font-medium text-charcoal">{body}</span>
                              <span className="text-[10px] text-brandMuted">{when}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 px-4 py-2 text-center">
                        <a href="#" className="text-xs font-semibold text-charcoal hover:text-honey-amber">{t('member.viewAllNotifications')}</a>
                      </div>
                    </div>
                  )}
                </div>

                <a href="#" aria-label={t('member.shoppingCart')} className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-honey">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-honey text-[10px] font-bold text-charcoal ring-2 ring-white">2</span>
                </a>

                <div className="mx-1 h-6 w-px bg-gray-200" />

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('profile')}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === 'profile'}
                    aria-label={t('member.profileMenu')}
                    className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-honey"
                  >
                    <Avatar user={user} className="h-8 w-8 rounded-full ring-2 ring-honey" fallbackTone="bg-honey text-charcoal" />
                    <ChevronDown className={`hidden h-4 w-4 text-gray-500 transition-transform sm:block ${openDropdown === 'profile' ? 'rotate-180' : ''}`} />
                  </button>

                  {openDropdown === 'profile' && (
                    <div role="menu" onKeyDown={handleMenuKeys} className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-gray-200 bg-white py-2 shadow-2xl ring-1 ring-charcoal/10">
                      <div className="flex items-start justify-between gap-2 border-b border-gray-100 px-4 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-charcoal">{user?.name ?? t('member.member')}</p>
                          <p className="truncate text-[11px] text-brandMuted">{user?.email ?? ''}</p>
                        </div>
                        <MenuCloseButton onClose={() => setOpenDropdown(null)} />
                      </div>
                      <div className="py-1">
                        <a
                          role="menuitem"
                          href="#marketplace"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 transition-colors hover:bg-honey-cream hover:text-charcoal"
                        >
                          <Store className="h-4 w-4 text-honey-amber" /><span>{t('storefront.browseMarketplace')}</span>
                        </a>
                        <a
                          role="menuitem"
                          href="#member-profile"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 transition-colors hover:bg-honey-cream hover:text-charcoal"
                        >
                          <User className="h-4 w-4 text-brandMuted" /><span>{t('admin.viewProfile')}</span>
                        </a>
                        <a
                          role="menuitem"
                          href="#account-security"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 transition-colors hover:bg-honey-cream hover:text-charcoal"
                        >
                          <Settings className="h-4 w-4 text-brandMuted" /><span>{t('admin.accountSettings')}</span>
                        </a>
                        <a
                          role="menuitem"
                          href="#"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 transition-colors hover:bg-honey-cream hover:text-charcoal"
                        >
                          <Crown className="h-4 w-4 text-honey-amber" /><span>{t('member.membership')}</span>
                        </a>
                        <a
                          role="menuitem"
                          href="#"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 transition-colors hover:bg-honey-cream hover:text-charcoal"
                        >
                          <CircleHelp className="h-4 w-4 text-brandMuted" /><span>{t('member.helpCenter')}</span>
                        </a>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          role="menuitem"
                          onClick={() => { setOpenDropdown(null); setLogoutOpen(true); }}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-brandDanger transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" /><span>{t('auth.signOut')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* ========== MAIN CONTENT ========== */}
          <main className="bg-honeycomb flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
            {mainContent ?? <>

            {/* ========== 3. WELCOME BANNER ========== */}
            <section className="relative overflow-hidden rounded-3xl border border-charcoal-light bg-gradient-to-r from-charcoal via-charcoal-light to-charcoal p-6 text-white shadow-xl sm:p-8" aria-label={t('member.welcome')}>
              <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-1/3 bg-honey/10 blur-2xl" />
              <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-honey">
                    <Calendar className="h-4 w-4" />
                    <span>{now.toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {t(greetingKey(now.getHours()))}, <span className="text-honey">{firstName}!</span> 🐝
                  </h1>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {t('member.welcomeIntro')}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a href="#" className="flex items-center gap-2 rounded-xl bg-honey px-5 py-3 text-xs font-bold text-charcoal shadow-lg shadow-honey/20 transition-all hover:bg-honey-hover focus:outline-none focus:ring-2 focus:ring-white sm:text-sm">
                    <CirclePlus className="h-4 w-4" />
                    <span>{t('member.navCreateListing')}</span>
                  </a>
                  <a href="#marketplace" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-honey sm:text-sm">
                    <Store className="h-4 w-4 text-honey" />
                    <span>{t('storefront.browseMarketplace')}</span>
                  </a>
                </div>
              </div>
            </section>

            {/* Dismissible alert */}
            {alertVisible && (
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-honey/40 bg-honey-cream p-4 shadow-sm" role="alert">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 rounded-xl bg-honey/20 p-2 text-honey-amber">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium text-charcoal sm:text-sm">
                    <span className="font-bold">{t('member.promoTitle')}</span> {t('member.promoBody')}
                  </p>
                </div>
                <button onClick={() => setAlertVisible(false)} aria-label={t('member.dismissAlert')} className="rounded-lg p-1 text-gray-400 hover:text-charcoal focus:outline-none">
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* ========== 4. SUMMARY STAT CARDS ========== */}
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label={t('member.summaryMetrics')}>
              {stats.map((stat) => {
                const StatIcon = stat.icon;
                const FootIcon = 'footIcon' in stat ? stat.footIcon : null;

                return (
                  <div key={stat.label} className="group flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-brandMuted">{t(stat.label)}</span>
                        <h3 className="mt-1 text-3xl font-black text-charcoal">{stat.value}</h3>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${stat.tone}`}>
                        <StatIcon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                      <span className={`flex items-center gap-1 font-medium ${stat.footTone}`}>
                        {FootIcon && <FootIcon className="h-3.5 w-3.5" />} {t(stat.foot)}
                      </span>
                      <a href="#" className="flex items-center gap-0.5 font-bold text-charcoal hover:text-honey-amber group-hover:underline">
                        {t('member.view')} <ChevronRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* ========== MAIN GRID (2 COL + SIDE) ========== */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

              <div className="min-w-0 space-y-8 xl:col-span-2">

                {/* ========== 5. RECENT ORDERS ========== */}
                <section className="space-y-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm" aria-labelledby="orders-heading">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 id="orders-heading" className="text-lg font-bold text-charcoal">{t('member.recentOrders')}</h2>
                      <p className="text-xs text-brandMuted">{t('member.recentOrdersIntro')}</p>
                    </div>
                    <a href="#" className="flex items-center gap-1 text-xs font-bold text-honey-amber hover:underline">
                      {t('member.viewAllOrders')} <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-left text-xs text-charcoal">
                      <thead className="border-y border-gray-100 bg-gray-50 font-semibold uppercase tracking-wider text-brandMuted">
                        <tr>
                          <th className="px-3 py-3">{t('member.colOrderId')}</th>
                          <th className="px-3 py-3">{t('member.colItem')}</th>
                          <th className="px-3 py-3">{t('member.colSeller')}</th>
                          <th className="px-3 py-3">{t('vendor.colDate')}</th>
                          <th className="px-3 py-3">{t('member.colTotal')}</th>
                          <th className="px-3 py-3">{t('member.colStatus')}</th>
                          <th className="px-3 py-3 text-right">{t('member.colAction')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="transition-colors hover:bg-gray-50/80">
                            <td className="px-3 py-3.5 font-bold text-charcoal">{order.id}</td>
                            <td className="px-3 py-3.5 font-medium">{order.item}</td>
                            <td className="px-3 py-3.5 text-brandMuted">{order.seller}</td>
                            <td className="px-3 py-3.5 text-brandMuted">{order.date}</td>
                            <td className="px-3 py-3.5 font-bold">{order.total}</td>
                            <td className="px-3 py-3.5">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${order.statusTone}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${order.dotTone}`} /> {order.status}
                              </span>
                            </td>
                            <td className="px-3 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className={`rounded-lg px-2.5 py-1 transition-colors ${order.actionTone}`}>{order.action}</button>
                                <button className="rounded-md p-1 text-gray-400 hover:text-charcoal" title={t('member.moreOptions')}>
                                  <EllipsisVertical className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-3 md:hidden">
                    {orders.filter((order) => order.mobileAction).map((order) => (
                      <div key={order.id} className="space-y-2 rounded-2xl border border-gray-200/60 bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-charcoal">{order.id}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${order.statusTone}`}>{order.status}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-charcoal">{order.item}</h4>
                        <div className="flex items-center justify-between text-[11px] text-brandMuted">
                          <span>{t('member.sellerPrefix', { name: order.seller })}</span>
                          <span className="font-bold text-charcoal">{order.total}</span>
                        </div>
                        <div className="flex justify-end gap-2 border-t border-gray-200/50 pt-2">
                          <button className={`rounded-lg px-3 py-1 text-xs ${order.status === 'Delivered' ? 'bg-honey font-bold text-charcoal' : 'bg-gray-200 font-semibold text-charcoal'}`}>
                            {order.mobileAction}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ========== 6. UPCOMING SERVICE BOOKINGS ========== */}
                <section className="space-y-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm" aria-labelledby="bookings-heading">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 id="bookings-heading" className="text-lg font-bold text-charcoal">{t('member.upcomingBookingsTitle')}</h2>
                      <p className="text-xs text-brandMuted">{t('member.upcomingBookingsIntro')}</p>
                    </div>
                    <a href="#" className="flex items-center gap-1 text-xs font-bold text-honey-amber hover:underline">
                      {t('member.manageCalendar')} <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {bookings.map((booking) => {
                      const PlaceIcon = booking.placeIcon;

                      return (
                        <div key={booking.title} className="flex flex-col justify-between space-y-3 rounded-2xl border border-gray-200/80 bg-white p-4 transition-colors hover:border-honey">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${booking.statusTone}`}>{booking.status}</span>
                              <span className="text-xs font-bold text-charcoal">{booking.rate}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <img src={booking.image} alt={booking.title} className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                              <div className="min-w-0">
                                <h4 className="truncate text-xs font-bold text-charcoal">{booking.title}</h4>
                                <p className="flex items-center gap-1 text-[11px] text-brandMuted">
                                  {booking.provider} <BadgeCheck className="h-3 w-3 fill-honey/20 text-honey" />
                                </p>
                              </div>
                            </div>
                            <div className="space-y-1 rounded-xl bg-gray-50 p-2.5 text-[11px] text-charcoal">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-honey-amber" />
                                <span>{booking.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-honey-amber" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-brandMuted">
                                <PlaceIcon className="h-3.5 w-3.5" />
                                <span className="truncate">{booking.place}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <button className="flex-1 rounded-lg bg-gray-100 py-1.5 text-xs font-semibold text-charcoal transition-colors hover:bg-gray-200">{t('member.details')}</button>
                            <button className="rounded-lg border border-gray-200 p-1.5 text-charcoal transition-colors hover:bg-honey-cream" title={t('member.messageProvider')}>
                              <MessageSquare className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* ========== 7. RECOMMENDED FOR YOU ========== */}
                <section className="space-y-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm" aria-labelledby="recommendations-heading">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 id="recommendations-heading" className="text-lg font-bold text-charcoal">{t('member.recommended')}</h2>
                      <p className="text-xs text-brandMuted">{t('member.recommendedIntro')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => scrollCarousel(-280)} aria-label={t('member.scrollLeft')} className="rounded-full border border-gray-200 p-2 text-charcoal transition-colors hover:bg-honey-cream focus:outline-none focus:ring-2 focus:ring-honey">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button onClick={() => scrollCarousel(280)} aria-label={t('member.scrollRight')} className="rounded-full border border-gray-200 p-2 text-charcoal transition-colors hover:bg-honey-cream focus:outline-none focus:ring-2 focus:ring-honey">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div ref={carousel} className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth py-1">
                    {recommendations.map((item) => (
                      <div key={item.title} className="flex w-64 shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-shadow hover:shadow-md">
                        <div className="relative h-36">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                          <span className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold ${item.kind === 'Service' ? 'bg-honey text-charcoal' : 'bg-charcoal/80 text-white backdrop-blur-sm'}`}>
                            {item.kind}
                          </span>
                          <button
                            onClick={() => toggleFavorite(item.title)}
                            aria-label={t('member.saveToFavorites')}
                            aria-pressed={favorites.includes(item.title)}
                            className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 text-gray-600 transition-colors hover:bg-white"
                          >
                            <Heart className={`h-4 w-4 ${favorites.includes(item.title) ? 'fill-brandDanger text-brandDanger' : ''}`} />
                          </button>
                        </div>
                        <div className="flex flex-1 flex-col justify-between space-y-2 p-4">
                          <div>
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-honey-amber">
                              <Star className="h-3.5 w-3.5 fill-honey" />
                              <span>{item.rating}</span>
                              <span className="text-brandMuted">{item.reviews}</span>
                            </div>
                            <h4 className="mt-0.5 line-clamp-1 text-xs font-bold text-charcoal">{item.title}</h4>
                            <p className="text-[11px] text-brandMuted">{item.by}</p>
                          </div>
                          <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                            <span className="text-sm font-black text-charcoal">{item.price}</span>
                            <button className="rounded-lg bg-honey px-3 py-1.5 text-xs font-bold text-charcoal transition-colors hover:bg-honey-hover">{item.cta}</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ========== 8. RECENT CONVERSATIONS ========== */}
                <section className="space-y-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm" aria-labelledby="messages-heading">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 id="messages-heading" className="text-lg font-bold text-charcoal">{t('member.recentConversations')}</h2>
                      <p className="text-xs text-brandMuted">{t('member.recentConversationsIntro')}</p>
                    </div>
                    <a href="#" className="flex items-center gap-1 text-xs font-bold text-honey-amber hover:underline">
                      {t('member.openInbox')} <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
                    {conversations.map((conversation) => {
                      const read = readConversations.includes(conversation.name);

                      return (
                        <div
                          key={conversation.name}
                          onClick={() => setReadConversations((current) => (current.includes(conversation.name) ? current : [...current, conversation.name]))}
                          className={`flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-honey-cream/30 ${read ? '' : 'bg-honey-cream/10'}`}
                        >
                          <div className="relative shrink-0">
                            <img src={conversation.avatar} alt={conversation.name} className="h-11 w-11 rounded-full object-cover" />
                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${conversation.online ? 'bg-brandSuccess' : 'bg-gray-300'}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between">
                              <h4 className="truncate text-xs font-bold text-charcoal">{conversation.name}</h4>
                              <span className="text-[10px] text-brandMuted">{conversation.when}</span>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-gray-600">{conversation.preview}</p>
                            <span className="text-[10px] font-semibold text-honey-amber">{conversation.re}</span>
                          </div>
                          {!read && <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-honey" />}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="min-w-0 space-y-8">

                {/* ========== 9. ACTIVITY TIMELINE ========== */}
                <section className="space-y-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm" aria-labelledby="activity-heading">
                  <div className="flex items-center justify-between">
                    <h2 id="activity-heading" className="text-base font-bold text-charcoal">{t('member.recentActivity')}</h2>
                    <button onClick={() => setNotifCount(0)} className="text-xs font-semibold text-honey-amber hover:underline">{t('member.markAllRead')}</button>
                  </div>

                  <div className="relative space-y-4 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-100">
                    {activity.map(({ icon: ActivityIcon, tone, text: body, when }) => (
                      <div key={when} className="relative flex items-start gap-3 pl-1">
                        <div className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ring-4 ring-white ${tone}`}>
                          <ActivityIcon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 text-xs">
                          <p className="font-medium text-charcoal">{body}</p>
                          <span className="text-[10px] text-brandMuted">{when}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ========== 10. SAVED ITEMS ========== */}
                <section className="space-y-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm" aria-labelledby="saved-heading">
                  <div className="flex items-center justify-between">
                    <h2 id="saved-heading" className="text-base font-bold text-charcoal">{t('member.savedItemsCount', { count: 4 })}</h2>
                    <a href="#" className="text-xs font-semibold text-honey-amber hover:underline">{t('common.viewAll')}</a>
                  </div>

                  <div className="space-y-3">
                    {savedItems.map((item) => (
                      <div key={item.title} className="flex items-center justify-between rounded-2xl border border-gray-100 p-2.5 transition-colors hover:border-honey/40">
                        <div className="flex min-w-0 items-center gap-3">
                          <img src={item.image} className="h-10 w-10 shrink-0 rounded-xl object-cover" alt={item.title} />
                          <div className="min-w-0">
                            <h4 className="truncate text-xs font-bold text-charcoal">{item.title}</h4>
                            <p className="text-[11px] font-bold text-honey-amber">{item.price}</p>
                          </div>
                        </div>
                        <button className="shrink-0 rounded-lg bg-honey px-2.5 py-1 text-xs font-bold text-charcoal transition-colors hover:bg-honey-hover">{t('member.addToCart')}</button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ========== 11 & 12. ACCOUNT & PROFILE HEALTH ========== */}
                <section className="space-y-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm">
                  <h2 className="flex items-center gap-2 text-base font-bold text-charcoal">
                    <ShieldCheck className="h-5 w-5 text-brandSuccess" />
                    {t('member.accountHealth')}
                  </h2>

                  <div className="space-y-2 text-xs">
                    {[
                      { label: t('member.healthEmail'), ok: Boolean(user?.email_verified_at), okText: t('verify.verified'), badText: t('verify.pending') },
                      { label: t('member.healthPhone'), ok: true, okText: t('verify.verified'), badText: t('verify.pending') },
                      { label: t('member.healthShipping'), ok: false, okText: t('member.statusSet'), badText: t('member.statusMissing') },
                      { label: t('member.healthTwoFactor'), ok: false, okText: t('member.statusEnabled'), badText: t('member.statusDisabled') },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between text-gray-700">
                        <span className="flex items-center gap-2">
                          {row.ok
                            ? <CheckCircle className="h-4 w-4 text-brandSuccess" />
                            : <CircleAlert className="h-4 w-4 text-brandWarning" />}
                          {row.label}
                        </span>
                        <span className={`font-semibold ${row.ok ? 'text-brandSuccess' : 'text-brandWarning'}`}>
                          {row.ok ? row.okText : row.badText}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button className="w-full rounded-xl bg-gray-100 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-gray-200">
                      {t('member.completeProfile', { percent: 85 })}
                    </button>
                  </div>
                </section>

                {/* ========== 13. WALLET WIDGET ========== */}
                <section className="space-y-4 rounded-3xl bg-gradient-to-br from-charcoal to-charcoal-light p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t('member.balance')}</span>
                    <Wallet className="h-5 w-5 text-honey" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-honey">$240.50</h3>
                    <p className="text-[11px] text-gray-300">{t('member.balanceCaption')}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 rounded-lg bg-honey py-1.5 text-xs font-bold text-charcoal transition-colors hover:bg-honey-hover">{t('member.withdraw')}</button>
                    <button className="flex-1 rounded-lg bg-white/10 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20">{t('member.addFunds')}</button>
                  </div>
                </section>
              </div>
            </div>

            {/* ========== 14. FOOTER ========== */}
            <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200/80 pt-6 text-xs text-brandMuted sm:flex-row">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-honey font-bold text-charcoal">
                  <Hexagon className="h-4 w-4" />
                </div>
                <span>{t('member.copyright', { year: new Date().getFullYear() })}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a href="#" className="transition-colors hover:text-charcoal">{t('vendor.privacyPolicy')}</a>
                <a href="#" className="transition-colors hover:text-charcoal">{t('member.termsOfService')}</a>
                <a href="#" className="transition-colors hover:text-charcoal">{t('member.helpCenter')}</a>
                <a href="#" className="transition-colors hover:text-charcoal">{t('member.accessibility')}</a>
                <div className="flex items-center gap-1 font-semibold text-charcoal">
                  <Globe className="h-3.5 w-3.5" />
                  <span>{SUPPORTED_LOCALES.find((l) => l.code === locale)?.native ?? locale}</span>
                </div>
              </div>
            </footer>
            </>}
          </main>
        </div>
      </div>

      {/* ========== LOGOUT MODAL ========== */}
      {logoutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          onClick={() => setLogoutOpen(false)}
        >
          <div className="w-full max-w-sm space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-brandDanger">
              <LogOut className="h-6 w-6" />
            </div>
            <div className="space-y-1 text-center">
              <h3 id="logout-title" className="text-base font-bold text-charcoal">{t('member.signOutTitle')}</h3>
              <p className="text-xs text-brandMuted">{t('member.signOutBody')}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setLogoutOpen(false)} className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-charcoal transition-colors hover:bg-gray-200">{t('common.cancel')}</button>
              <button onClick={() => void logout()} className="flex-1 rounded-xl bg-brandDanger py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-700">{t('auth.signOut')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
