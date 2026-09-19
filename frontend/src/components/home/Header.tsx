import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe2, LayoutGrid, LogIn, LogOut, Menu, MonitorSmartphone, Search, ShoppingCart, UserRound, X } from 'lucide-react';
import { useAuth, dashboardHashFor } from '../../auth/AuthProvider';
import { ForgotPasswordForm, SignInForm, SignUpForm, type AuthPanel } from '../auth/AuthForms';
import { MenuCloseButton } from '../ui/MenuCloseButton';

const navItems = ['Today’s Deals', 'Products', 'Local Services', 'Professionals', 'Jobs', 'Real Estate', 'Vehicles', 'Community', 'Sell on AsBeez', 'Help'];
const mobileItems = ['Products', 'Today’s Deals', 'Local Services', 'Professionals', 'Jobs', 'Real Estate', 'Vehicles', 'Local Businesses', 'Community', 'Sell on AsBeez', 'Help'];

export function Header() {
  const { user } = useAuth();
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // The account panel used to close only by re-clicking its trigger; give it the
  // click-outside and Escape dismissal the dashboard dropdowns already have.
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

  return <>
    {announcementVisible && <div className="bg-amber text-center text-sm px-4 py-2 relative z-50"><span>Welcome to AsBeez—your community marketplace for products, services, and local opportunities.</span><button className="ml-3 underline font-semibold" onClick={() => setAnnouncementVisible(false)}>Learn More</button><button aria-label="Dismiss announcement" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setAnnouncementVisible(false)}><X className="h-4 w-4" /></button></div>}
    <header className="sticky top-0 z-40 bg-charcoal text-white shadow-lg">
      <div className="amazon-container py-2">
        <div className="flex items-center gap-3 lg:gap-4">
          <button className="lg:hidden p-2" aria-label="Open navigation" onClick={() => setDrawerOpen(true)}><Menu /></button>
          <a href="#" className="flex items-center gap-2 shrink-0" aria-label="AsBeez homepage"><span className="text-2xl font-extrabold"><span className="text-honey">As</span>Beez</span></a>
          <button className="hidden lg:flex items-center gap-1 text-sm px-2 py-1"><span className="text-honey">⌖</span><span className="text-left leading-tight"><small className="block text-gray-400">Delivering to</small><b>Your Location</b></span><ChevronDown className="h-3 w-3" /></button>
          <div className="hidden md:flex flex-1 max-w-3xl"><div className="flex w-full overflow-hidden rounded-lg ring-2 ring-honey/60 focus-within:ring-honey"><select aria-label="Search category" className="bg-gray-100 text-charcoal text-sm px-2 border-r border-gray-300"><option>All</option><option>Products</option><option>Services</option><option>Jobs</option></select><input className="min-w-0 flex-1 px-3 py-2.5 text-charcoal outline-none" placeholder="Search AsBeez marketplace…" /><button aria-label="Search" className="bg-honey px-4 text-charcoal"><Search className="h-5 w-5" /></button></div></div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3"><button className="hidden lg:flex items-center gap-1 text-sm"><Globe2 className="h-4 w-4" /> EN <ChevronDown className="h-3 w-3" /></button><div ref={accountRef} className="relative hidden sm:block"><button className="text-left text-sm" aria-haspopup="dialog" aria-expanded={accountOpen} onClick={() => setAccountOpen((open) => !open)}><small className="block text-gray-400">{user ? `Hello, ${user.name}` : 'Hello, Sign In'}</small><b>Account & Lists</b></button>{accountOpen && <AccountMenu onClose={() => setAccountOpen(false)} />}</div><button className="hidden lg:block text-left text-sm"><small className="block text-gray-400">Returns</small><b>& Orders</b></button><button className="relative p-2" aria-label="Shopping cart, 3 items"><ShoppingCart /><span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-honey text-xs font-bold text-charcoal">3</span></button></div>
        </div>
        <div className="mt-2 md:hidden"><div className="flex overflow-hidden rounded-lg ring-2 ring-honey/60"><input className="min-w-0 flex-1 px-3 py-2.5 text-charcoal outline-none" placeholder="Search AsBeez…" /><button className="bg-honey px-4 text-charcoal"><Search className="h-5 w-5" /></button></div></div>
      </div>
      <nav aria-label="Main navigation" className="hidden border-t border-white/10 lg:block"><div className="amazon-container flex items-center gap-1 overflow-x-auto py-1 text-sm scrollbar-hide"><div className="relative"><button className="flex items-center gap-1.5 whitespace-nowrap rounded px-3 py-2.5 font-semibold hover:bg-white/10" aria-expanded={categoriesOpen} onClick={() => setCategoriesOpen(!categoriesOpen)}><LayoutGrid className="h-4 w-4 text-honey" /> All Categories <ChevronDown className="h-3 w-3" /></button>{categoriesOpen && <div className="absolute left-0 top-full z-50 mt-1 grid w-[680px] grid-cols-3 gap-6 rounded-lg bg-white p-6 text-charcoal shadow-2xl"><CategoryGroup title="Shop" items={['Electronics', 'Home & Garden', 'Fashion', 'Health & Beauty', 'Sports & Outdoors', 'Toys & Games']} /><CategoryGroup title="Services" items={['Home Services', 'Professional Services', 'Health & Wellness', 'Education & Tutoring', 'Events & Entertainment', 'Automotive']} /><CategoryGroup title="Opportunities" items={['Jobs', 'Real Estate', 'Vehicles', 'Local Businesses', 'Community Listings', 'Sell on AsBeez']} /></div>}</div>{navItems.map((item) => <a key={item} href="#" className={`whitespace-nowrap rounded px-3 py-2.5 hover:bg-white/10 ${item === 'Sell on AsBeez' ? 'font-semibold text-honey' : ''}`}>{item}</a>)}</div></nav>
    </header>
    {drawerOpen && <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setDrawerOpen(false)}><aside className="h-full w-80 max-w-[85vw] overflow-y-auto bg-white text-charcoal p-5" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-gray-200 pb-4"><b className="text-xl"><span className="text-amber">As</span>Beez</b><button aria-label="Close navigation" onClick={() => setDrawerOpen(false)}><X /></button></div><nav className="mt-5 space-y-1">{mobileItems.map((item) => <a key={item} href="#" className="block rounded-lg px-3 py-3 hover:bg-softyellow">{item}</a>)}</nav></aside></div>}
  </>;
}

const panelCopy: Record<AuthPanel, { title: string; subtitle: string }> = {
  signin: { title: 'Sign in to AsBeez', subtitle: 'Access your dashboards' },
  signup: { title: 'Create your account', subtitle: 'Join the hive in under a minute' },
  forgot: { title: 'Reset your password', subtitle: 'We will email you a link' },
};

function AccountMenu({ onClose }: { onClose: () => void }) {
  const { user, logout, logoutAll } = useAuth();
  const [panel, setPanel] = useState<AuthPanel>('signin');

  if (user) {
    return <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-xl border border-gray-200 bg-white p-4 text-charcoal shadow-2xl ring-1 ring-charcoal/10">
      <div className="mb-3 flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex min-w-0 items-center gap-2"><UserRound className="h-5 w-5 shrink-0 text-amber" /><div className="min-w-0"><p className="truncate text-sm font-bold">{user.name}</p><p className="text-xs text-gray-500">Signed in as {user.role.replace('-', ' ')}</p></div></div>
        <MenuCloseButton onClose={onClose} />
      </div>
      <div className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Dashboards</div>
      <div className="space-y-1 text-sm">
        <a href={dashboardHashFor(user.role)} onClick={onClose} className="block rounded-lg px-3 py-2 font-semibold hover:bg-softyellow">Your dashboard</a>
        {user.role === 'super-admin' && <a href="#vendor-dashboard" onClick={onClose} className="block rounded-lg px-3 py-2 hover:bg-softyellow">Vendor Dashboard</a>}
        {user.role === 'super-admin' && <a href="#member-dashboard" onClick={onClose} className="block rounded-lg px-3 py-2 hover:bg-softyellow">Member Dashboard</a>}
        <a href="#account-security" onClick={onClose} className="block rounded-lg px-3 py-2 hover:bg-softyellow">Password & security</a>
      </div>
      <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
        <button onClick={() => { void logout(); onClose(); }} className="flex w-full items-center gap-2 px-3 text-left text-sm font-semibold text-red-600 hover:text-red-700"><LogOut className="h-4 w-4" /> Log out</button>
        <button onClick={() => { void logoutAll(); onClose(); }} className="flex w-full items-center gap-2 px-3 text-left text-xs text-gray-500 hover:text-charcoal"><MonitorSmartphone className="h-3.5 w-3.5" /> Log out of all devices</button>
      </div>
    </div>;
  }

  const copy = panelCopy[panel];

  return <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-xl border border-gray-200 bg-white p-4 text-charcoal shadow-2xl ring-1 ring-charcoal/10">
    <div className="mb-3 flex items-start justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2"><LogIn className="h-5 w-5 shrink-0 text-amber" /><div className="min-w-0"><p className="text-sm font-bold">{copy.title}</p><p className="text-xs text-gray-500">{copy.subtitle}</p></div></div>
      <MenuCloseButton onClose={onClose} />
    </div>
    {panel === 'signin' && <SignInForm onSwitch={setPanel} onDone={onClose} />}
    {panel === 'signup' && <SignUpForm onSwitch={setPanel} onDone={onClose} />}
    {panel === 'forgot' && <ForgotPasswordForm onSwitch={setPanel} />}
  </div>;
}

function CategoryGroup({ title, items }: { title: string; items: string[] }) { return <div><h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber">{title}</h3><ul className="space-y-2 text-sm">{items.map((item) => <li key={item}><a href="#" className="hover:text-amber">{item}</a></li>)}</ul></div>; }
