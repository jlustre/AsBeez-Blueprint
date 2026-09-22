import { useEffect, useRef, type ReactNode } from 'react';

export function AdminActionMenu({
  open,
  onToggle,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointer = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [open, onClose]);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button type="button" onClick={onToggle} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold hover:bg-white">
        {label}
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 text-left shadow-xl">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function AdminMenuItem({
  children,
  onClick,
  tone = 'default',
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: 'default' | 'emerald' | 'amber' | 'rose' | 'blue';
}) {
  const tones = {
    default: 'hover:bg-amber-50',
    emerald: 'text-emerald-700 hover:bg-emerald-50',
    amber: 'text-amber-700 hover:bg-amber-50',
    rose: 'text-rose-700 hover:bg-rose-50',
    blue: 'text-blue-700 hover:bg-blue-50',
  };

  return (
    <button type="button" onClick={onClick} className={`block w-full rounded-lg p-2 text-left ${tones[tone]}`}>
      {children}
    </button>
  );
}

export function AdminStatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: string;
}) {
  return <span className={`rounded-full px-2 py-1 text-xs font-bold ${tone}`}>{label}</span>;
}

export function AdminPersonCell({
  name,
  sub,
  avatarUrl,
  initials,
  size = 'md',
}: {
  name: string;
  sub?: string;
  avatarUrl?: string | null;
  initials: string;
  size?: 'sm' | 'md';
}) {
  const avatar = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';

  return (
    <div className="flex items-center gap-3">
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className={`${avatar} rounded-full object-cover`} />
      ) : (
        <span className={`flex ${avatar} items-center justify-center rounded-full bg-amber-400 font-black text-slate-950`}>{initials}</span>
      )}
      <div>
        <p className="font-bold text-slate-950">{name}</p>
        {sub ? <p className="text-xs text-slate-500">{sub}</p> : null}
      </div>
    </div>
  );
}
