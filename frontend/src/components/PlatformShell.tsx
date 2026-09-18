import type { ReactNode } from 'react';

type NavigationItem = {
    label: string;
    active?: boolean;
};

const navigation: NavigationItem[] = [
    { label: 'Overview', active: true },
    { label: 'Orders' },
    { label: 'Vendors' },
    { label: 'Members' },
    { label: 'Financials' },
];

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{detail}</p>
        </article>
    );
}

function ActivityRow({ children, status }: { children: ReactNode; status: string }) {
    return (
        <li className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
            <span className="text-sm text-slate-700">{children}</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{status}</span>
        </li>
    );
}

export function PlatformShell() {
    return (
        <main className="min-h-screen bg-slate-50 px-5 py-6 text-slate-950 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <header className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-lg font-black text-slate-950">A</span>
                            <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">AsBeez Platform</span>
                        </div>
                        <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">Commerce that compounds trust.</h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">A role-aware workspace for marketplace operations, vendors, members, and financial control.</p>
                    </div>
                    <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2">Open workspace</button>
                </header>

                <nav aria-label="Primary navigation" className="flex gap-2 overflow-x-auto py-5">
                    {navigation.map((item) => (
                        <button key={item.label} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${item.active ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white hover:text-slate-950'}`}>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <section aria-label="Platform metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Marketplace volume" value="$248.6K" detail="This month · illustrative data" />
                    <StatCard label="Active vendors" value="184" detail="Across 3 launch regions" />
                    <StatCard label="Repeat purchase" value="42.8%" detail="Up 6.4% from last period" />
                    <StatCard label="Control status" value="Healthy" detail="All core reconciliations current" />
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Operations pulse</p>
                                <h2 className="mt-2 text-xl font-semibold">A calm view of the moving parts</h2>
                            </div>
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Live preview</span>
                        </div>
                        <ul className="mt-5">
                            <ActivityRow status="Current">Payment reconciliation · 99.98% matched</ActivityRow>
                            <ActivityRow status="Ready">Vendor onboarding · 12 reviews pending</ActivityRow>
                            <ActivityRow status="Current">Refund queue · 4 open cases</ActivityRow>
                            <ActivityRow status="Review">Country rollout · Canada readiness review</ActivityRow>
                        </ul>
                    </article>

                    <aside className="rounded-2xl bg-amber-400 p-6 text-slate-950 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.16em]">Build note</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight">React is ready for the product surface.</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-800">This shell is a typed starting point. Livewire and Alpine can own server-driven admin workflows while React grows into customer, member, and vendor experiences.</p>
                    </aside>
                </section>
            </div>
        </main>
    );
}
