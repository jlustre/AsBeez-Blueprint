import type { ReactNode } from 'react';

export function GuideSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-44 border-b border-gray-100 py-12 sm:py-16 lg:scroll-mt-28">
      {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber">{eyebrow}</p> : null}
      <h2 className="mb-6 text-2xl font-extrabold sm:text-3xl">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-charcoal/90">{children}</div>
    </section>
  );
}

export function GuideCallout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="rounded-xl border-l-4 border-honey bg-softyellow/70 p-5">
      <p className="mb-2 text-sm font-bold">{title}</p>
      <div className="space-y-2 text-sm leading-relaxed text-charcoal/80">{children}</div>
    </aside>
  );
}

export function GuideQuote({ children, cite }: { children: string; cite: string }) {
  return (
    <blockquote className="rounded-xl bg-charcoal p-6 text-white sm:p-8">
      <p className="text-lg font-semibold leading-snug sm:text-xl">“{children}”</p>
      <footer className="mt-3 text-xs uppercase tracking-wider text-honey">{cite}</footer>
    </blockquote>
  );
}

export function GuideSteps({ steps }: { steps: { title: string; copy: string }[] }) {
  return (
    <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {steps.map((step, index) => (
        <li key={step.title} className="rounded-xl bg-white p-4 shadow-md">
          <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-honey text-sm font-extrabold text-charcoal">{index + 1}</span>
          <h3 className="mb-2 font-bold">{step.title}</h3>
          <p className="text-sm text-mutedgray">{step.copy}</p>
        </li>
      ))}
    </ol>
  );
}

export function GuideList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export function GuideTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-md">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-softyellow text-xs uppercase tracking-wider">
          <tr>
            {headers.map((header) => <th key={header} className="px-4 py-3 font-bold">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('|')} className="border-t border-gray-100">
              {row.map((cell) => <td key={cell} className="px-4 py-3 align-top">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
