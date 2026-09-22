import type { ReactNode } from 'react';

export function AdminPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="-m-4 space-y-6 text-slate-800 sm:-m-6 lg:-m-8">
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
