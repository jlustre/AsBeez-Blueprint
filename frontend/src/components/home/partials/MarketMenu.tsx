import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Loader2 } from 'lucide-react';

import { useTranslation, type MessageKey } from '../../../i18n';
import { categoryApi, categoryHref, type CategoryTreeNode } from '../../../lib/categories';

/** Panel width in pixels; also what the edge clamp below measures against. */
const PANEL_WIDTH = 480;

/** Gap kept between the panel and the viewport edge. */
const EDGE = 8;

/**
 * One market in the top bar, with its departments in a dropdown.
 *
 * The panel is portalled to <body> and placed with `position: fixed` against
 * the trigger's measured box. Two things would otherwise clip it: the nav
 * strip is an `overflow-x` scroller, and a container that scrolls in one axis
 * clips its absolutely positioned descendants in both; and the header is
 * `sticky z-40`, a stacking context no descendant can paint out of, however
 * high its own z-index. Leaving the header settles both.
 *
 * Hover is handled on the panel as well as the wrapper, because the pointer
 * moving from the trigger into the panel now leaves the wrapper's subtree.
 *
 * Departments only, not the whole branch: this is the quick way into a market
 * from any page. The mega menu beside it is where the full tree lives.
 */
export function MarketMenu({ slug, label }: { slug: string; label: MessageKey }) {
    const { t } = useTranslation();
    const panelId = useId();
    const trigger = useRef<HTMLButtonElement>(null);
    const wrapper = useRef<HTMLDivElement>(null);
    const panel = useRef<HTMLDivElement>(null);
    const closeTimer = useRef<number | undefined>(undefined);

    const [open, setOpen] = useState(false);
    const [wanted, setWanted] = useState(false);
    const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(null);
    const [market, setMarket] = useState<CategoryTreeNode | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle');

    // Latches on the first open and never clears. Two things depend on that:
    // the fetch below must not be torn down when the panel closes again
    // before it resolves, and its effect must not depend on state its own
    // body writes — setting `status` inside an effect that lists `status`
    // cancels the request it just started.
    useEffect(() => {
        if (open) {
            setWanted(true);
        }
    }, [open]);

    // Fetched on first open, never on mount: the header is on every page and
    // most visits open none of these. categoryApi.tree() is cached for the
    // page, so the seven markets share one request with the mega menu.
    useEffect(() => {
        if (!wanted) {
            return;
        }

        let cancelled = false;

        setStatus('loading');

        categoryApi.tree()
            .then((roots) => {
                if (cancelled) {
                    return;
                }

                setMarket(roots.find((root) => root.slug === slug) ?? null);
                setStatus('ready');
            })
            .catch(() => !cancelled && setStatus('failed'));

        return () => { cancelled = true; };
    }, [wanted, slug]);

    // Re-measured on scroll and resize rather than once on open: the header is
    // sticky, so the bar moves under the page without the panel unmounting.
    useEffect(() => {
        if (!open) {
            return;
        }

        const place = () => {
            const box = trigger.current?.getBoundingClientRect();

            if (box) {
                const most = Math.max(EDGE, window.innerWidth - PANEL_WIDTH - EDGE);

                setAnchor({ left: Math.min(Math.max(EDGE, box.left), most), top: box.bottom });
            }
        };

        place();
        window.addEventListener('resize', place);
        window.addEventListener('scroll', place, true);

        return () => {
            window.removeEventListener('resize', place);
            window.removeEventListener('scroll', place, true);
        };
    }, [open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                trigger.current?.focus();
            }
        };

        // Both refs: the panel is portalled out of the header, so a click
        // inside it is not inside `wrapper` any more.
        const onPointerDown = (event: MouseEvent) => {
            const target = event.target as Node;

            if (wrapper.current?.contains(target) || panel.current?.contains(target)) {
                return;
            }

            setOpen(false);
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('mousedown', onPointerDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('mousedown', onPointerDown);
        };
    }, [open]);

    useEffect(() => () => window.clearTimeout(closeTimer.current), []);

    // A short grace period on leaving: the pointer crosses a few pixels of gap
    // between the trigger and the panel, and closing on that would make the
    // menu unusable.
    function hold() {
        window.clearTimeout(closeTimer.current);
        setOpen(true);
    }

    function release() {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => setOpen(false), 180);
    }

    return (
        <div ref={wrapper} className="shrink-0" onMouseEnter={hold} onMouseLeave={release}>
            <button
                type="button"
                ref={trigger}
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
                onClick={() => setOpen((current) => !current)}
                className={`inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded px-3 py-2.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-honey ${open ? 'bg-white/10' : ''}`}
            >
                {t(label)}
                <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && anchor && createPortal((
                <div
                    ref={panel}
                    id={panelId}
                    onMouseEnter={hold}
                    onMouseLeave={release}
                    style={{ left: anchor.left, top: anchor.top, width: PANEL_WIDTH }}
                    className="fixed z-[100] mt-1 max-w-[92vw] overflow-hidden rounded-xl border border-amber-200 bg-white text-charcoal shadow-2xl"
                >
                    {status === 'failed' ? (
                        <p role="alert" className="p-5 text-center text-sm font-medium text-rose-700">{t('mega.loadFailed')}</p>
                    ) : status !== 'ready' ? (
                        <div className="flex items-center justify-center gap-2 p-6 text-sm text-slate-500">
                            <Loader2 className="h-4 w-4 animate-spin text-amber-600" />{t('common.loading')}
                        </div>
                    ) : market === null || market.children.length === 0 ? (
                        // Keyed off `status`, not off `market`: a market whose
                        // slug is missing from the taxonomy has nothing to show,
                        // and spinning forever would hide that.
                        <p className="p-5 text-center text-sm text-slate-500">{t('home.noCategories')}</p>
                    ) : (
                        <>
                            <div className="max-h-[min(28rem,70vh)] overflow-y-auto p-2">
                                <ul className="grid gap-x-2 sm:grid-cols-2">
                                    {market.children.map((department) => (
                                        <li key={department.id}>
                                            <a
                                                href={categoryHref(department.slug)}
                                                onClick={() => setOpen(false)}
                                                className="flex min-h-9 items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-900"
                                            >
                                                <span className="truncate">{department.name}</span>
                                                {department.children.length > 0 && (
                                                    <span className="shrink-0 text-xs text-slate-400">{department.children.length}</span>
                                                )}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <a
                                href={categoryHref(market.slug)}
                                onClick={() => setOpen(false)}
                                className="block border-t border-slate-200 px-4 py-3 text-sm font-bold text-amber-800 hover:bg-amber-50"
                            >
                                {t('mega.viewAllIn', { name: market.name })}
                            </a>
                        </>
                    )}
                </div>
            ), document.body)}
        </div>
    );
}
