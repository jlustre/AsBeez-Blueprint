export function SectionHeader({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>
      <p className="text-sm text-mutedgray">{copy}</p>
    </div>
  );
}
