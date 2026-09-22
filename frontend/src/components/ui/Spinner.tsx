import { useTranslation } from '../../i18n';

const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
} as const;

/**
 * The circling loader, in brand honey.
 *
 * A bordered circle with one transparent quadrant rather than an SVG or a
 * GIF: it inherits `currentColor` nowhere it should not, costs no request,
 * and scales crisply. `motion-reduce:animate-none` leaves a static ring for
 * anyone who has asked the system to stop animations — a spinner is the
 * classic trigger for motion sensitivity.
 *
 * Silent to assistive tech on its own. Wrap it in something that carries the
 * status text, or use `PageLoader`, which does.
 */
export function Spinner({
  size = 'md',
  className = '',
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 animate-spin rounded-full border-honey/25 border-t-honey motion-reduce:animate-none ${SIZES[size]} ${className}`}
    />
  );
}

/**
 * A page or panel waiting on its first load.
 *
 * `role="status"` with the label inside it, so a screen reader announces the
 * wait once rather than being handed a nameless graphic. `full` fills the
 * viewport for a whole-page boot; otherwise it fills whatever box it is in.
 */
export function PageLoader({
  label,
  full = false,
}: {
  /** Defaults to the shared "Loading…" string. */
  label?: string;
  full?: boolean;
}) {
  const { t } = useTranslation();
  const text = label ?? t('common.loading');

  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 text-sm text-slate-500 ${full ? 'min-h-screen bg-cream' : 'px-5 py-16'}`}
    >
      <Spinner size="lg" />
      <span>{text}</span>
    </div>
  );
}

/**
 * The inline form of the same thing, for a button or a row that is working.
 * The caller supplies the wording, because "Saving…" and "Loading…" are not
 * interchangeable.
 */
export function BusyLabel({ label }: { label: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2">
      <Spinner size="sm" />
      {label}
    </span>
  );
}
