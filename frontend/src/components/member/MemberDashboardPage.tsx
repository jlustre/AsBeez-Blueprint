import React, { type ReactNode } from 'react';
import { Bell, BriefcaseBusiness, CalendarClock, ChevronRight, CreditCard, Heart, LayoutDashboard, PackageCheck, Search, ShieldCheck, Sparkles, Store, TrendingUp, UserRound } from 'lucide-react';

const statCards = [
  { label: 'Wallet Balance', value: '$2,480.30', change: '+8.4%', icon: CreditCard, tone: 'text-honey bg-honey/15' },
  { label: 'Orders this month', value: '24', change: '+12.1%', icon: PackageCheck, tone: 'text-brandInfo bg-brandInfo/10' },
  { label: 'Saved Favorites', value: '118', change: '+6.3%', icon: Heart, tone: 'text-brandDanger bg-brandDanger/10' },
  { label: 'Member Status', value: 'Verified', change: 'Active', icon: ShieldCheck, tone: 'text-brandSuccess bg-brandSuccess/10' },
] as const;

const quickActions = [
  { label: 'Discover Deals', icon: Search },
  { label: 'Book a Service', icon: CalendarClock },
  { label: 'My Listings', icon: Store },
  { label: 'Career Hub', icon: BriefcaseBusiness },
] as const;

const sidebarNav = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Discover', icon: Search, active: false },
  { label: 'Saved Items', icon: Heart, active: false },
  { label: 'Orders', icon: PackageCheck, active: false },
  { label: 'Bookings', icon: CalendarClock, active: false },
  { label: 'Payments', icon: CreditCard, active: false },
  { label: 'Profile', icon: UserRound, active: false },
] as const;

const activityItems = [
  { title: 'Local Yoga Sessions', detail: 'Booked for Saturday · 2 seats left', amount: '$120.00', tag: 'Upcoming' },
  { title: 'Premium Organic Box', detail: 'Delivered today · 1 item missing', amount: '$42.50', tag: 'Needs attention' },
  { title: 'Home Cleaning Service', detail: 'Completed successfully · 4.9 rating', amount: '$85.00', tag: 'Paid' },
] as const;

const tabs = ['Overview', 'Orders', 'Bookings', 'Wishlist', 'Settings'];

export function MemberDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-charcoal">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-gray-200 bg-charcoal text-white lg:block lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-honey text-charcoal shadow-md shadow-honey/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold leading-none">As<span className="text-honey">Beez</span></div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-honey">Member Portal</div>
              </div>
            </div>
            <button className="rounded-lg border border-white/10 p-2 text-gray-300 lg:hidden">
              <Bell className="h-4 w-4" />
            </button>
          </div>

          <nav className="px-3 py-4">
            <div className="mb-4 rounded-xl border border-white/5 bg-white/5 p-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                  alt="Member avatar"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-honey"
                />
                <div>
                  <div className="font-semibold">Joey Lustre</div>
                  <div className="text-xs text-honey">Verified Member</div>
                </div>
              </div>
            </div>

            <ul className="space-y-1.5">
              {sidebarNav.map(({ label, icon: Icon, active }) => (
                <li key={label}>
                  <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-honey text-charcoal font-semibold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1">
          <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brandMuted">Welcome back</p>
                <h1 className="text-2xl font-extrabold">Member Dashboard</h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative rounded-xl border border-gray-200 bg-white p-2.5 text-charcoal shadow-sm">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-honey text-[10px] font-bold text-charcoal">3</span>
                </button>
                <button className="rounded-xl bg-charcoal px-4 py-2.5 text-sm font-semibold text-white">Upgrade Membership</button>
              </div>
            </div>
          </header>

          <div className="space-y-6 p-4 sm:p-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map(({ label, value, change, icon: Icon, tone }) => (
                <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-brandSuccess/10 px-2 py-1 text-xs font-bold text-brandSuccess">{change}</span>
                  </div>
                  <div className="text-sm text-brandMuted">{label}</div>
                  <div className="mt-2 text-2xl font-extrabold tracking-tight">{value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold">Quick actions</h2>
                <button className="text-sm font-semibold text-honey">Manage shortcuts</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {quickActions.map(({ label, icon: Icon }) => (
                  <button key={label} className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#F7F7F5] px-4 py-3 text-left transition hover:border-honey hover:bg-honey/5">
                    <span className="flex items-center gap-3 font-medium">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-honey/15 text-charcoal"><Icon className="h-4 w-4" /></span>
                      {label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-brandMuted" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recent activity</h2>
                  <button className="text-sm font-semibold text-honey">View all</button>
                </div>

                <div className="space-y-3">
                  {activityItems.map(({ title, detail, amount, tag }) => (
                    <div key={title} className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-[#F7F7F5] p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-honey/15 text-charcoal">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold">{title}</div>
                          <div className="text-sm text-brandMuted">{detail}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-charcoal">{amount}</div>
                        <div className="mt-1 inline-flex rounded-full bg-brandSuccess/10 px-2 py-0.5 text-[10px] font-bold text-brandSuccess">{tag}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Performance</h2>
                  <span className="rounded-full bg-honey/15 px-2 py-1 text-xs font-bold text-honey">Live</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-brandMuted">Marketplace activity</span>
                      <span className="font-semibold">84%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-200">
                      <div className="h-2.5 w-[84%] rounded-full bg-honey" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-brandMuted">Community engagement</span>
                      <span className="font-semibold">72%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-200">
                      <div className="h-2.5 w-[72%] rounded-full bg-brandInfo" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-brandMuted">Saved opportunities</span>
                      <span className="font-semibold">91%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-200">
                      <div className="h-2.5 w-[91%] rounded-full bg-brandSuccess" />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold">Workspace overview</h2>
                <div className="flex gap-2 overflow-x-auto">
                  {tabs.map((tab, index) => (
                    <button key={tab} className={`rounded-full px-3 py-1.5 text-sm font-medium ${index === 0 ? 'bg-charcoal text-white' : 'bg-[#F7F7F5] text-brandMuted'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ['Products', '12 active listings', '$1,860 sold'],
                  ['Services', '6 booked this month', '4.9 avg rating'],
                  ['Community', '18 public reviews', '3 communities joined'],
                ].map(([label, primary, secondary]) => (
                  <div key={label} className="rounded-xl border border-gray-200 bg-[#F7F7F5] p-4">
                    <div className="mb-2 text-sm text-brandMuted">{label}</div>
                    <div className="font-bold">{primary}</div>
                    <div className="mt-2 text-sm text-brandMuted">{secondary}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
