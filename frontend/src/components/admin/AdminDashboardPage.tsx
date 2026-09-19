import React from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  Clock3,
  Database,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Globe,
  Hexagon,
  LayoutDashboard,
  Lock,
  Menu,
  Package,
  Percent,
  Search,
  Settings,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  UserPlus,
  UserRound,
  Users,
  Zap,
} from 'lucide-react';

const sidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Members', icon: Users },
  { label: 'Vendors', icon: Store, badge: '12' },
  { label: 'Products', icon: Package },
  { label: 'Services', icon: BriefcaseBusiness },
  { label: 'Orders & Bookings', icon: ShoppingBag },
  { label: 'Disputes', icon: ShieldAlert, badge: '7' },
  { label: 'Financials', icon: Percent },
];

const platformConfigItems = ['Categories', 'Content & CMS', 'Commissions'];
const systemItems = ['Audit Logs', 'Security Center', 'System Settings'];

const kpis = [
  { label: 'Total Revenue', value: '$1,284,650', delta: '+14.2%', icon: Sparkles, tone: 'bg-amber-50 text-amber-700' },
  { label: 'Active Members', value: '48,392', delta: '+8.7%', icon: Users, tone: 'bg-blue-50 text-blue-700' },
  { label: 'Active Vendors', value: '3,284', delta: '+6.4%', icon: Store, tone: 'bg-violet-50 text-violet-700' },
  { label: 'Total Orders', value: '28,946', delta: '+11.8%', icon: ShoppingBag, tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'Service Bookings', value: '12,487', delta: '+9.6%', icon: Clock3, tone: 'bg-cyan-50 text-cyan-700' },
  { label: 'Platform Commission', value: '$128,465', delta: '+12.1%', icon: Percent, tone: 'bg-yellow-50 text-yellow-700' },
  { label: 'Open Disputes', value: '37', delta: '8 Require Action', icon: ShieldAlert, tone: 'bg-rose-50 text-rose-700' },
  { label: 'Pending Approvals', value: '64', delta: '12 Vendor Queue', icon: UserPlus, tone: 'bg-indigo-50 text-indigo-700' },
] as const;

const healthChecks = [
  { label: 'Marketplace', status: 'Operational', tone: 'bg-emerald-500' },
  { label: 'Payments', status: 'Stripe & PayPal Active', tone: 'bg-emerald-500' },
  { label: 'Search Engine', status: '99.98% Latency OK', tone: 'bg-emerald-500' },
  { label: 'Email Delivery', status: 'Queue Clear', tone: 'bg-emerald-500' },
  { label: 'Storage Usage', status: '68% (1.4 TB)', tone: 'bg-amber-400' },
  { label: 'Backup', status: '2 hrs ago', tone: 'bg-blue-400' },
  { label: 'Maintenance', status: 'Sep 24, 02:00 UTC', tone: 'bg-violet-400' },
] as const;

const revenueTrend = [72, 84, 68, 96, 110, 118, 128, 126, 142, 152, 168, 180];

const approvalRows = [
  { name: 'Northwood Studio', type: 'Vendor', status: 'Awaiting review', priority: 'High', amount: '$4,200' },
  { name: 'Olivia & Co.', type: 'Vendor', status: 'Pending docs', priority: 'Medium', amount: '$2,760' },
  { name: 'Nimbus Events', type: 'Service', status: 'Reviewing profile', priority: 'High', amount: '$1,180' },
  { name: 'Bamboo Market', type: 'Product listing', status: 'Awaiting approval', priority: 'Low', amount: '$860' },
] as const;

const notificationRows = [
  { title: 'New order #AB-4831 received', time: '2 min ago', danger: true },
  { title: 'Website consultation confirmed', time: '18 min ago', danger: true },
  { title: 'Two products are out of stock', time: '1 hour ago', danger: true },
  { title: 'New 5-star customer review', time: '3 hours ago', danger: false },
  { title: 'Payout of $2,840 completed', time: 'Yesterday', danger: false },
] as const;

const topSegments = [
  { name: 'Locally Sourced Goods', value: '34.2%', color: 'bg-amber-400' },
  { name: 'Home Services', value: '28.1%', color: 'bg-blue-500' },
  { name: 'Wellness & Beauty', value: '23.7%', color: 'bg-violet-500' },
  { name: 'Digital Services', value: '14.0%', color: 'bg-emerald-500' },
] as const;

const topVendors = [
  { name: 'Golden Hive Market', sales: '$124.8K', score: '4.9/5' },
  { name: 'Northwood Studio', sales: '$94.4K', score: '4.8/5' },
  { name: 'Bamboo & Bloom', sales: '$81.2K', score: '4.9/5' },
  { name: 'Nimble Works', sales: '$69.7K', score: '4.7/5' },
] as const;

const quickActions = [
  'Review Vendor Queue',
  'Add New Category',
  'Export Financial Report',
  'Schedule Maintenance',
] as const;

const dashboardRoutes = [
  { label: 'Admin', hash: '#admin-dashboard', icon: ShieldAlert },
  { label: 'Vendor', hash: '#vendor-dashboard', icon: Store },
  { label: 'Member', hash: '#member-dashboard', icon: UserRound },
] as const;

export function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F8] text-slate-900 antialiased">
      <div className="flex min-h-screen overflow-hidden">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-slate-900 text-white md:flex">
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-slate-900 shadow-md shadow-yellow-500/30">
                <Hexagon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg font-bold leading-none">
                  <span>AsBeez</span>
                  <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-300">
                    Admin
                  </span>
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-400">Manage the hive</div>
              </div>
            </div>
            <button className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Toggle sidebar">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="border-b border-slate-800 bg-slate-800/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Joey Lustre"
                className="h-10 w-10 rounded-full border-2 border-yellow-400 object-cover"
              />
              <div>
                <h4 className="text-sm font-semibold text-white">Joey Lustre</h4>
                <div className="text-[11px] font-medium text-yellow-300">Super Admin</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 text-sm">
            <div>
              <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Main Menu</div>
              <ul className="space-y-1">
                {sidebarItems.map(({ label, icon: Icon, active, badge }) => (
                  <li key={label}>
                    <button
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition ${
                        active ? 'bg-yellow-400 text-slate-900 font-semibold shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span>{label}</span>
                      </span>
                      {badge ? (
                        <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-300">
                          {badge}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <span>Platform Config</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <ul className="space-y-1">
                {platformConfigItems.map((item) => (
                  <li key={item}>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-800 hover:text-white">
                      <FileText className="h-4 w-4" />
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <span>System & Security</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <ul className="space-y-1">
                {systemItems.map((item) => (
                  <li key={item}>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-800 hover:text-white">
                      {item === 'Security Center' ? <Lock className="h-4 w-4" /> : item === 'System Settings' ? <Settings className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="border-t border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span>Version 3.4.2</span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">PRODUCTION</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>System Operational</span>
              </div>
              <button className="text-slate-400 transition hover:text-rose-400" aria-label="Log out">
                <Lock className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden" aria-label="Open sidebar">
                  <Menu className="h-5 w-5" />
                </button>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>AsBeez Platform</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="font-medium text-slate-800">Administration Center</span>
                  </div>
                  <h1 className="text-lg font-bold text-slate-900">Overview Dashboard</h1>
                </div>
              </div>

              <div className="relative hidden max-w-md flex-1 md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search members, vendors, orders, listings..."
                  className="w-full rounded-xl border border-transparent bg-slate-100 py-2 pl-9 pr-11 text-sm text-slate-700 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-200"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                  /
                </kbd>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 lg:flex" aria-label="Dashboard switcher">
                  {dashboardRoutes.map(({ label, hash, icon: Icon }) => (
                    <button
                      key={hash}
                      onClick={() => {
                        window.location.hash = hash;
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                        hash === '#admin-dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`}
                      title={`Open ${label} dashboard`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-yellow-500">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Quick Action</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button className="relative rounded-xl p-2 text-slate-600 transition hover:bg-slate-100" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    7
                  </span>
                </button>
                <button className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80" alt="Admin profile" className="h-8 w-8 rounded-full object-cover ring-2 ring-yellow-400" />
                  <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto space-y-8 p-4 sm:p-6 lg:p-8">
            <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl">
              <div className="absolute inset-y-0 right-0 w-1/3 opacity-10" style={{ backgroundImage: 'radial-gradient(#F7B928 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-[11px] font-semibold text-slate-900">
                      <Zap className="h-3.5 w-3.5" />
                      Hive Live Operations
                    </span>
                    <span className="font-mono text-[11px] text-slate-300">2026-09-17 21:37:55 UTC</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, Joey.</h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-300">
                      Here is the real-time operational status across the AsBeez online marketplace. All services are running optimally with zero critical incidents.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700">
                    <ExternalLink className="h-4 w-4" />
                    View Live Marketplace
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-500">
                    <Download className="h-4 w-4" />
                    Generate Executive Report
                  </button>
                </div>
              </div>

              <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 border-t border-slate-700 pt-6 md:grid-cols-4 lg:grid-cols-7">
                {healthChecks.map(({ label, status, tone }) => (
                  <div key={label} className="rounded-xl border border-slate-700 bg-white/5 p-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
                        <p className="truncate text-xs font-bold text-white">{status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {kpis.map(({ label, value, delta, icon: Icon, tone }) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>{delta}</span>
                      {delta.includes('%') ? <span className="font-normal text-slate-400">vs last month</span> : null}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Marketplace performance</p>
                    <h3 className="text-xl font-bold text-slate-900">Revenue trend</h3>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <Gauge className="h-4 w-4" />
                    Live
                  </button>
                </div>

                <div className="flex h-56 items-end gap-2">
                  {revenueTrend.map((value, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex w-full items-end justify-center rounded-t-xl bg-gradient-to-t from-yellow-400 to-amber-200" style={{ height: `${value}%` }} />
                      <span className="text-[10px] uppercase tracking-wide text-slate-400">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Top categories</h3>
                  <button className="text-sm font-semibold text-yellow-600">Overview</button>
                </div>

                <div className="space-y-4">
                  {topSegments.map(({ name, value, color }) => (
                    <div key={name}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{name}</span>
                        <span className="font-semibold text-slate-900">{value}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100">
                        <div className={`h-2.5 rounded-full ${color}`} style={{ width: value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Approvals</p>
                    <h3 className="text-xl font-bold text-slate-900">Vendor queue</h3>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    View all
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {approvalRows.map((row) => (
                    <div key={row.name} className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.6fr] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
                      <div>
                        <div className="font-semibold text-slate-900">{row.name}</div>
                        <div className="text-xs text-slate-500">{row.type}</div>
                      </div>
                      <span className="inline-flex rounded-full bg-amber-100 px-2 py-1 text-center text-[11px] font-semibold text-amber-700">
                        {row.status}
                      </span>
                      <span className="text-slate-600">{row.priority}</span>
                      <span className="text-right font-bold text-slate-900">{row.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Notifications</p>
                    <h3 className="text-xl font-bold text-slate-900">Live admin feed</h3>
                  </div>
                  <button className="text-sm font-semibold text-yellow-600">Mark all as read</button>
                </div>

                <div className="space-y-3">
                  {notificationRows.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.danger ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-slate-800">{item.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Performance leaders</p>
                    <h3 className="text-xl font-bold text-slate-900">Top vendors</h3>
                  </div>
                  <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">Export</button>
                </div>

                <div className="space-y-3">
                  {topVendors.map(({ name, sales, score }, index) => (
                    <div key={name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100 text-sm font-bold text-slate-900">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{name}</div>
                          <div className="text-xs text-slate-500">{score}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{sales}</div>
                        <div className="text-xs text-emerald-600">+8.2%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Operations</p>
                    <h3 className="text-xl font-bold text-slate-900">Quick actions</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={action}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                        index === 0 ? 'bg-yellow-50 text-slate-900' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{action}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Review required
                  </div>
                  <p>8 disputes are awaiting a response before the next SLA checkpoint.</p>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Business health</p>
                    <h3 className="text-xl font-bold text-slate-900">Conversion overview</h3>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    +9.2%
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Checkout completion</div>
                    <div className="mt-2 text-3xl font-extrabold text-slate-900">81%</div>
                    <div className="mt-2 h-2.5 rounded-full bg-slate-200">
                      <div className="h-2.5 w-[81%] rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Avg. cart value</div>
                    <div className="mt-2 text-3xl font-extrabold text-slate-900">$148</div>
                    <div className="mt-2 h-2.5 rounded-full bg-slate-200">
                      <div className="h-2.5 w-[68%] rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Member retention</div>
                    <div className="mt-2 text-3xl font-extrabold text-slate-900">92%</div>
                    <div className="mt-2 h-2.5 rounded-full bg-slate-200">
                      <div className="h-2.5 w-[92%] rounded-full bg-violet-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Security</p>
                    <h3 className="text-xl font-bold text-slate-900">System integrity</h3>
                  </div>
                  <ShieldAlert className="h-5 w-5 text-emerald-600" />
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                    <span className="text-slate-700">MFA coverage</span>
                    <span className="font-bold text-slate-900">96%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                    <span className="text-slate-700">Audit log sync</span>
                    <span className="font-bold text-emerald-700">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                    <span className="text-slate-700">Fraud alert queue</span>
                    <span className="font-bold text-amber-700">12 items</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
