import type { ReactNode } from 'react';

export type AdminTab = {
  key: string;
  label: string;
  count?: ReactNode;
  active: boolean;
  onClick: () => void;
};

export function AdminTabs({ tabs }: { tabs: AdminTab[] }) {
  return (
    <nav className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex min-w-max gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={tab.onClick}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${tab.active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-800'}`}
          >
            {tab.label}
            {tab.count !== undefined ? <span className={`ml-1 text-xs ${tab.active ? 'text-white/80' : ''}`}>{tab.count}</span> : null}
          </button>
        ))}
      </div>
    </nav>
  );
}
