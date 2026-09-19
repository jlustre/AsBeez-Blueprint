import React, { useEffect, useMemo, useState } from 'react';
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
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from 'lucide-react';

const kpis = [
  { label: 'Total Revenue', value: '$24,860', delta: '12.5%', tone: 'bg-softyellow text-amber' },
  { label: 'Total Orders', value: '386', delta: '8.2%', tone: 'bg-amber/10 text-charcoal' },
  { label: 'Bookings', value: '94', delta: '15.3%', tone: 'bg-brandInfo/10 text-brandInfo' },
  { label: 'Visitors', value: '8,429', delta: '6.7%', tone: 'bg-brandSuccess/10 text-brandSuccess' },
  { label: 'Conversion', value: '4.8%', delta: '0.6%', tone: 'bg-honey/15 text-charcoal' },
  { label: 'Avg. Rating', value: '4.9', delta: '327 reviews', tone: 'bg-gray-100 text-charcoal' },
] as const;

const sidebarItems: ReadonlyArray<{
  label: string;
  icon: typeof LayoutDashboard;
  active?: boolean;
  badge?: string;
  badgeTone?: string;
}> = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Products', icon: Package },
  { label: 'Services', icon: BriefcaseBusiness },
  { label: 'Orders', icon: ShoppingBag, badge: '8' },
  { label: 'Bookings', icon: CalendarCheck2, badge: '3' },
  { label: 'Customers', icon: Users },
  { label: 'Messages', icon: MessageSquareText, badge: '5', badgeTone: 'bg-brandInfo' },
  { label: 'Reviews', icon: Star },
  { label: 'Promotions', icon: Megaphone },
  { label: 'Analytics', icon: ChartColumnBig },
  { label: 'Finances', icon: WalletCards },
];

const businessItems = ['Store Profile', 'Team Members', 'Subscription', 'Settings', 'Help & Support'];

const quickActions = [
  ['Add Product', 'Create a new item'],
  ['Add Service', 'List your expertise'],
  ['Create Promotion', 'Launch a campaign'],
  ['Add Team Member', 'Invite a collaborator'],
  ['Create Discount', 'Reward customers'],
  ['Community Update', 'Post an announcement'],
] as const;

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

const tasksSeed = [
  'Ship three pending orders',
  'Confirm tomorrow’s bookings',
  'Update inventory quantities',
  'Reply to customer questions',
  'Review monthly statement',
] as const;

const notifications = [
  { icon: 'shopping-bag', text: 'New order #AB-4831 received', when: '2 min ago', alert: true },
  { icon: 'calendar-check', text: 'Website consultation confirmed', when: '18 min ago', alert: true },
  { icon: 'triangle-alert', text: 'Two products are out of stock', when: '1 hour ago', alert: true },
  { icon: 'star', text: 'New 5-star customer review', when: '3 hours ago', alert: true },
  { icon: 'wallet', text: 'Payout of $2,840 completed', when: 'Yesterday', alert: false },
] as const;

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
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

export function VendorDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [taskList, setTaskList] = useState<Array<{ id: number; text: string; done: boolean }>>(
    tasksSeed.map((text, index) => ({ id: Date.now() + index, text, done: false })),
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
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

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
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Vendor Center</div>
            </div>
          )}
          <button className="ml-auto rounded-lg p-2 text-gray-300 hover:bg-white/10 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className={`rounded-2xl border border-white/10 bg-white/[.06] p-4 ${collapsed ? 'hidden' : 'block'}`}>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=120&q=80" alt="Golden Hive Market logo" className="h-12 w-12 rounded-xl object-cover" />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="truncate text-sm font-extrabold">Golden Hive Market</p>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-honey" />
                </div>
                <p className="text-xs text-gray-400">Products & Services</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Store Active
              </span>
              <button className="text-xs font-bold text-honey hover:underline">View Store</button>
            </div>
          </div>

          {!collapsed && <p className="mt-6 px-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gray-500">Workspace</p>}

          <nav className="mt-2 space-y-1">
            {sidebarItems.map(({ label, icon: Icon, active, badge, badgeTone }) => {
              const IconComp = Icon;
              return (
                <button key={label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? 'bg-honey text-charcoal font-bold' : 'text-gray-300 hover:bg-white/10 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}>
                  <IconComp className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="flex-1 text-left">{label}</span>}
                  {!collapsed && badge && <span className={`rounded-full px-2 py-0.5 text-[11px] ${badgeTone ?? 'bg-honey text-charcoal'}`}>{badge}</span>}
                </button>
              );
            })}
          </nav>

          {!collapsed && (
            <>
              <button className="mt-6 flex w-full items-center px-3 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-gray-500" aria-expanded="true">
                <span>Business</span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </button>
              <nav className="mt-2 space-y-1">
                {businessItems.map((label) => {
                  const iconMap = {
                    'Store Profile': Store,
                    'Team Members': Users,
                    Subscription: CreditCard,
                    Settings: Settings,
                    'Help & Support': CircleHelp,
                  };
                  const Icon = iconMap[label as keyof typeof iconMap] ?? Store;
                  return (
                    <button key={label} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white">
                      <Icon className="h-5 w-5" />
                      <span className="flex-1 text-left">{label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 rounded-2xl bg-gradient-to-br from-honey to-amber p-4 text-charcoal">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Growth Plan</span>
                  <span className="text-xs font-extrabold">72%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/60">
                  <div className="h-full w-[72%] rounded-full bg-charcoal" />
                </div>
                <button className="mt-3 w-full rounded-lg bg-charcoal py-2 text-xs font-extrabold text-white hover:bg-black">Upgrade Plan</button>
              </div>

              <button className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white">
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </button>
            </>
          )}
        </div>
      </aside>

      <div className={`min-h-screen transition-all ${collapsed ? 'lg:pl-[84px]' : 'lg:pl-[270px]'}`}>
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center gap-3 px-4 sm:px-6">
            <button className="rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </button>
            <button className="hidden rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50 lg:block" onClick={() => setCollapsed((current) => !current)} aria-label="Collapse sidebar">
              <LayoutDashboard className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="hidden text-xs font-semibold text-gray-500 sm:block">Vendor Center / Overview</p>
              <h1 className="truncate text-lg font-extrabold sm:text-xl">Vendor Dashboard</h1>
            </div>

            <div className="relative ml-auto hidden w-full max-w-sm xl:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input type="search" placeholder="Search orders, customers, products…" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-honey focus:bg-white focus:outline-none" />
            </div>

            <div className="relative">
              <button className="hidden items-center gap-2 rounded-xl bg-honey px-4 py-2.5 text-sm font-extrabold hover:bg-amber sm:flex">
                <Plus className="h-4 w-4" />
                Create New
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <button className="relative hidden rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50 md:block" aria-label="Messages">
              <MessageSquareText className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brandInfo px-1 text-[10px] font-bold text-white">5</span>
            </button>
            <div className="relative">
              <button className="relative rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">5</span>
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-50">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" alt="Joey profile" className="h-9 w-9 rounded-xl object-cover" />
                <span className="hidden text-left lg:block">
                  <span className="block text-sm font-extrabold">Joey</span>
                  <span className="block text-[11px] text-gray-500">Owner</span>
                </span>
                <ChevronDown className="hidden h-4 w-4 lg:block" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <section className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
            <article className="relative overflow-hidden rounded-3xl bg-charcoal p-6 text-white shadow-soft sm:p-8">
              <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-honey/10" />
              <div className="relative">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-honey/30 bg-honey/10 px-3 py-1.5 text-xs font-bold text-honey">
                  <Sparkles className="h-4 w-4" />
                  <span>Wednesday, September 17, 2026</span>
                </div>
                <h2 className="text-3xl font-extrabold sm:text-4xl">Good morning, Joey!</h2>
                <p className="mt-2 max-w-xl text-gray-300">Here’s what’s happening with Golden Hive Market today.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-bold hover:bg-white hover:text-charcoal">View Store</button>
                  <button className="rounded-xl bg-honey px-4 py-2.5 text-sm font-extrabold text-charcoal hover:bg-amber">Add Product or Service</button>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Store setup</p>
                  <h2 className="mt-1 text-2xl font-extrabold">82% complete</h2>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-softyellow text-amber">
                  <Store className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-gray-100">
                <div className="h-full w-[82%] rounded-full bg-honey" />
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {['Add payment information', 'Complete return policy', 'Upload storefront banner'].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-3 w-3 rounded-full bg-amber" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="mt-5 w-full rounded-xl bg-charcoal py-2.5 text-sm font-extrabold text-white hover:bg-black">Complete Setup</button>
            </article>
          </section>

          <section className="mt-6" aria-label="Key performance indicators">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              {kpis.map(({ label, value, delta, tone }) => (
                <article key={label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                      {label.includes('Revenue') ? <DollarSign className="h-5 w-5" /> : label.includes('Orders') ? <ShoppingBag className="h-5 w-5" /> : label.includes('Bookings') ? <CalendarCheck2 className="h-5 w-5" /> : label.includes('Visitors') ? <Users className="h-5 w-5" /> : label.includes('Conversion') ? <TrendingUp className="h-5 w-5" /> : <Star className="h-5 w-5" />}
                    </span>
                    <span className="text-xs font-bold text-gray-500">↗</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-gray-500">{label}</p>
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
                  <p className="text-sm font-bold text-gray-500">Performance</p>
                  <h2 className="text-xl font-extrabold">Sales Overview</h2>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-3xl font-extrabold">$24,860</span>
                    <span className="mb-1 text-xs font-bold text-success">↗ 12.5%</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold">
                    <option>Last 30 Days</option>
                    <option>Last 7 Days</option>
                    <option>Last 90 Days</option>
                  </select>
                  <button className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold hover:bg-gray-50">
                    <Download className="mr-1 inline h-4 w-4" />Report
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
                <p className="text-sm font-bold text-gray-500">Sources</p>
                <h2 className="text-xl font-extrabold">Revenue Breakdown</h2>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-[conic-gradient(#F7B928_0_58%,#242424_58%_85%,#2563EB_85%_94%,#E5E7EB_94%_100%)]">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-xl font-extrabold text-charcoal">58%</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-gray-500">Gross revenue</span><strong className="mt-1 block">$28,920</strong></div>
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-gray-500">Marketplace fees</span><strong className="mt-1 block">−$2,315</strong></div>
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-gray-500">Refunds</span><strong className="mt-1 block">−$1,745</strong></div>
                <div className="rounded-xl bg-softyellow p-3"><span className="text-[#735000]">Net earnings</span><strong className="mt-1 block">$24,860</strong></div>
              </div>
            </article>
          </section>

          <section className="mt-6 rounded-3xl border border-gray-200 bg-white shadow-soft" aria-label="Recent orders">
            <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-sm font-bold text-gray-500">Commerce</p>
                <h2 className="text-xl font-extrabold">Recent Orders</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="relative flex-1 sm:flex-none">
                  <span className="sr-only">Search orders</span>
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input type="search" placeholder="Search orders" className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm sm:w-48" />
                </label>
                <select className="rounded-xl border border-gray-200 px-3 py-2 text-sm">
                  <option>All statuses</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Refunded</option>
                </select>
                <button className="rounded-xl bg-charcoal px-3 py-2 text-sm font-bold text-white">View All</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-4 py-4">Customer</th>
                    <th className="px-4 py-4">Product</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Payment</th>
                    <th className="px-4 py-4">Fulfillment</th>
                    <th className="px-4 py-4 text-right">Actions</th>
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
                      <td className="px-4 py-4 font-bold">{formatMoney(amount)}</td>
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
                  <p className="text-sm font-bold text-gray-500">Schedule</p>
                  <h2 className="text-xl font-extrabold">Upcoming Bookings</h2>
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
                      <button className="rounded-lg border px-3 py-2 text-xs font-bold">Details</button>
                      <button className="rounded-lg bg-charcoal px-3 py-2 text-xs font-bold text-white">Message</button>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-500">Catalog</p>
                  <h2 className="text-xl font-extrabold">Inventory Overview</h2>
                </div>
                <button className="rounded-xl bg-honey px-4 py-2 text-sm font-extrabold hover:bg-amber"><Plus className="mr-1 inline h-4 w-4" />Add Product</button>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-xl bg-gray-50 p-2"><strong className="block text-lg">42</strong>Active</div>
                <div className="rounded-xl bg-red-50 p-2 text-danger"><strong className="block text-lg">2</strong>Out</div>
                <div className="rounded-xl bg-amber-50 p-2 text-[#8A5900]"><strong className="block text-lg">5</strong>Low</div>
                <div className="rounded-xl bg-gray-50 p-2"><strong className="block text-lg">7</strong>Drafts</div>
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-[#735000]">
                <span className="mt-0.5 text-lg">⚠</span>
                <span>Seven products need inventory attention.</span>
              </div>
              <div className="mt-3 space-y-3">
                {inventory.map((item) => (
                  <div key={item.sku} className="flex items-center gap-3 py-2">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80" alt={item.name} className="h-11 w-11 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-sm">{item.name}</strong>
                      <span className="text-xs text-gray-500">{item.sku} · {formatMoney(item.price)}</span>
                    </div>
                    <div className="text-right">
                      <strong className={`block text-sm ${item.units === 0 ? 'text-danger' : item.units <= item.threshold ? 'text-[#8A5900]' : ''}`}>{item.units} units</strong>
                      <span className="text-[11px] text-gray-500">Threshold {item.threshold}</span>
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
                  <p className="text-sm font-bold text-gray-500">Performance</p>
                  <h2 className="text-xl font-extrabold">Top-performing Listings</h2>
                </div>
                <div className="flex rounded-xl bg-gray-100 p-1">
                  {(['All', 'Product', 'Service'] as const).map((filter) => (
                    <button key={filter} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${activeFilter === filter ? 'bg-charcoal text-white' : ''}`} onClick={() => setActiveFilter(filter)}>
                      {filter}
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
                      <p className="mt-1 text-xs text-gray-500">{listing.views.toLocaleString()} views · {listing.sales} orders · {listing.conversion} conversion</p>
                    </div>
                    <div className="text-right">
                      <strong className="block text-sm">{listing.revenue}</strong>
                      <span className={`text-xs ${listing.trend === 'up' ? 'text-success' : 'text-danger'}`}>{listing.trend === 'up' ? '↑' : '↓'} trend</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div>
                <p className="text-sm font-bold text-gray-500">Audience</p>
                <h2 className="text-xl font-extrabold">Customer Activity</h2>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-xs text-gray-500">New customers</span><strong className="mt-1 block text-xl">186</strong></div>
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-xs text-gray-500">Returning</span><strong className="mt-1 block text-xl">124</strong></div>
                <div className="rounded-xl bg-gray-50 p-3"><span className="text-xs text-gray-500">Repeat rate</span><strong className="mt-1 block text-xl">40%</strong></div>
                <div className="rounded-xl bg-softyellow p-3"><span className="text-xs text-[#735000]">Avg. value</span><strong className="mt-1 block text-xl">$80.19</strong></div>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[60%] bg-honey" />
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500"><span>60% new</span><span>40% returning</span></div>
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
                  <p className="text-sm font-bold text-gray-500">Reputation</p>
                  <h2 className="text-xl font-extrabold">Reviews & Ratings</h2>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-4xl font-extrabold">4.9</span>
                    <div>
                      <div className="flex text-honey">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">327 reviews</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3"><span className="text-gray-500">Response rate</span><strong className="block text-lg">96%</strong></div>
                  <div className="rounded-xl bg-gray-50 p-3"><span className="text-gray-500">Avg. response</span><strong className="block text-lg">42 min</strong></div>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500">Inbox</p>
                  <h2 className="text-xl font-extrabold">Messages</h2>
                </div>
                <button className="text-sm font-extrabold text-[#8A5900] hover:underline">View All</button>
              </div>
              <label className="relative mt-4 block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input value={messageSearch} onChange={(event) => setMessageSearch(event.target.value)} type="search" placeholder="Search conversations" className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm" />
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
                  <p className="text-sm font-bold text-gray-400">Financial summary</p>
                  <h2 className="text-xl font-extrabold">Available balance</h2>
                  <p className="mt-2 text-4xl font-extrabold text-honey">$8,462.38</p>
                </div>
                <button className="rounded-xl bg-honey px-4 py-2.5 text-sm font-extrabold text-charcoal hover:bg-amber">Withdraw Funds</button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-white/[.07] p-3"><span className="text-xs text-gray-400">Pending</span><strong className="mt-1 block">$1,280.00</strong></div>
                <div className="rounded-xl bg-white/[.07] p-3"><span className="text-xs text-gray-400">Next payout</span><strong className="mt-1 block">$2,840.15</strong></div>
                <div className="rounded-xl bg-white/[.07] p-3"><span className="text-xs text-gray-400">Payout date</span><strong className="mt-1 block">Sep 22</strong></div>
                <div className="rounded-xl bg-white/[.07] p-3"><span className="text-xs text-gray-400">Lifetime</span><strong className="mt-1 block">$142,806</strong></div>
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-500">Marketing</p>
                  <h2 className="text-xl font-extrabold">Promotions & Advertising</h2>
                </div>
                <button className="rounded-xl bg-honey px-4 py-2 text-sm font-extrabold hover:bg-amber">Create Promotion</button>
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
                <p className="text-sm font-bold text-gray-500">Personalized guidance</p>
                <h2 className="text-xl font-extrabold">Insights for Your Business</h2>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {[
                  ['High', 'Restock your best-selling product', 'Wireless Headphones may sell out within two days.'],
                  ['High', 'Respond to unanswered reviews', 'Three customers are waiting for a response.'],
                  ['Medium', 'Promote high-view listings', 'Two listings get traffic but convert below average.'],
                  ['Medium', 'Add service availability', 'Two services have no dates after next week.'],
                ].map(([priority, title, description]) => (
                  <div key={title} className="rounded-2xl border border-gray-100 p-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-extrabold ${priority === 'High' ? 'bg-red-50 text-danger' : 'bg-amber-50 text-[#8A5900]'}`}>{priority} PRIORITY</span>
                    <h3 className="mt-3 font-extrabold">{title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500">Stay on track</p>
                  <h2 className="text-xl font-extrabold">Tasks & Reminders</h2>
                </div>
                <button className="text-xs font-bold text-[#8A5900] hover:underline" onClick={() => setShowCompleted((current) => !current)}>
                  {showCompleted ? 'Hide completed' : 'Show completed'}
                </button>
              </div>
              <form onSubmit={addTask} className="mt-4 flex gap-2">
                <input name="task" required maxLength={80} placeholder="Add a new task" className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                <button className="rounded-xl bg-charcoal px-4 text-sm font-bold text-white">Add</button>
              </form>
              <div className="mt-4 space-y-2">
                {visibleTasks.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500">No tasks to show.</div>
                ) : (
                  visibleTasks.map((task) => (
                    <div key={task.id} className={`flex items-center gap-3 rounded-xl border border-gray-100 p-3 ${task.done ? 'opacity-55' : ''}`}>
                      <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="h-4 w-4" />
                      <span className={`min-w-0 flex-1 text-sm ${task.done ? 'line-through' : ''}`}>{task.text}</span>
                      <button className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-danger" onClick={() => setTaskList((current) => current.filter((item) => item.id !== task.id))}>×</button>
                    </div>
                  ))
                )}
              </div>
            </article>
          </section>
        </main>

        <footer className="mt-6 border-t border-gray-200 bg-white px-6 py-6 text-xs text-gray-500">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p>© 2026 AsBeez Marketplace · Vendor Center v2.4.0</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="hover:text-charcoal">Privacy Policy</a>
              <a href="#" className="hover:text-charcoal">Vendor Terms</a>
              <a href="#" className="hover:text-charcoal">Help Center</a>
              <span className="inline-flex items-center gap-2 text-success"><span className="h-2 w-2 rounded-full bg-success" />System Operational</span>
            </div>
            <p className="font-bold text-charcoal">Powered by As<span className="text-amber">Beez</span></p>
          </div>
        </footer>
      </div>
    </div>
  );
}
