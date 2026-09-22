import type { ReactNode } from 'react';

export function AdminMetricTiles({
  title,
  intro,
  tiles,
  columnsClass = 'grid-cols-2 sm:grid-cols-5',
}: {
  title: string;
  intro?: string;
  tiles: { key: string; label: string; value: ReactNode; tone?: string; valueClass?: string }[];
  columnsClass?: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      {intro ? <p className="mt-1 text-sm text-slate-500">{intro}</p> : null}
      <dl className={`mt-6 grid gap-3 ${columnsClass}`}>
        {tiles.map((tile) => (
          <div key={tile.key} className={`rounded-xl p-4 ${tile.tone ?? 'bg-slate-50'}`}>
            <dt className="text-xs text-slate-500">{tile.label}</dt>
            <dd className={`mt-1 text-xl font-black ${tile.valueClass ?? ''}`}>{tile.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
