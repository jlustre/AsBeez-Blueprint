import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/** Gap between the rail and the tooltip. */
const OFFSET = 10;

/**
 * Names a collapsed sidebar item on hover and on keyboard focus.
 *
 * Portalled and `position: fixed` rather than absolutely positioned inside
 * the rail: the sidebar is an `overflow-y-auto` scroller, and a container
 * that scrolls in one axis clips its absolutely positioned descendants in
 * both — a tooltip sitting beside the rail would be cut off at its edge.
 *
 * Presentation only. A collapsed item shows no text, so the control itself
 * still needs an `aria-label`; this tooltip is `aria-hidden` so a screen
 * reader is not told the same word twice.
 */
export function SidebarTooltip({
  label,
  enabled,
  children,
}: {
  label: string;
  /** Collapsed rails need it; expanded ones already show the label. */
  enabled: boolean;
  children: ReactNode;
}) {
  const anchor = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState<{ left: number; top: number } | null>(null);

  function show() {
    const box = anchor.current?.getBoundingClientRect();

    if (box) {
      setAt({ left: box.right + OFFSET, top: box.top + box.height / 2 });
    }
  }

  const hide = () => setAt(null);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div
      ref={anchor}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {at && createPortal((
        <span
          role="tooltip"
          aria-hidden="true"
          style={{ left: at.left, top: at.top }}
          className="pointer-events-none fixed z-[110] -translate-y-1/2 whitespace-nowrap rounded-lg bg-charcoal px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg ring-1 ring-white/15"
        >
          {label}
        </span>
      ), document.body)}
    </div>
  );
}
