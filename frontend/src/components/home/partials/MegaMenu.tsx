import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Baby, Bike, BookOpen, Bot, Briefcase, BriefcaseBusiness, Building2, Car, ChevronDown,
    ChevronLeft, ChevronRight, ChartNoAxesColumn, ClipboardCheck, Caravan, Compass, Download,
    Accessibility,
    FileSignature, FileText, Gamepad2, Gem, Gift, GraduationCap, Hammer, Handshake, HeartHandshake,
    HousePlus,
    House, Image, Key, KeyRound, Landmark, Laptop, LayoutGrid, LayoutTemplate, Loader2, Music,
    Package, Palette, PawPrint, PiggyBank, Plane, Printer, RefreshCw,
    Sailboat, Scale, Scissors, Search, ShieldCheck, Ship, Shirt, Sparkles, Sprout, Stethoscope,
    StickyNote, Store, TerminalSquare, TicketsPlane, TrainFront, Truck, TreePine, Umbrella,
    UsersRound, UtensilsCrossed, Users, Warehouse, Wrench, X,
    type LucideIcon,
} from 'lucide-react';

import { useTranslation, type MessageKey } from '../../../i18n';
import {
    categoryApi,
    categoryGroups,
    categoryHref,
    searchCategories,
    type CategoryTreeNode,
} from '../../../lib/categories';
import { toneClasses } from '../../../lib/tones';

/**
 * Icon per market and department.
 *
 * The seven roots come first; the departments beneath them keep their own
 * icons because the rail drills into them on mobile.
 *
 * Imported directly rather than through lib/icons: that registry is keyed by
 * the names stored in the database for admin-curated rows, and these are a
 * fixed presentation detail of this menu. Naming them here also means the
 * bundler can see them, and a slug with no entry falls back to the generic
 * grid rather than a question mark.
 */
const departmentIcon: Record<string, LucideIcon> = {
    // The seven markets.
    'physical-products': Package,
    'digital-products': Download,
    'professional-services': Handshake,
    'real-estate': Building2,
    automotive: Car,
    insurance: ShieldCheck,
    travel: Plane,

    // Physical Products, in the order the market lists its departments.
    electronics: Laptop,
    'home-living': House,
    'fashion-apparel': Shirt,
    'health-beauty': Sparkles,
    'health-wellness': Stethoscope,
    'food-beverage': UtensilsCrossed,
    'toys-kids-baby': Baby,
    'sports-outdoors': Bike,
    'tools-hardware': Hammer,
    'business-office': Printer,
    pets: PawPrint,
    'arts-crafts': Palette,
    'jewellery-watches': Gem,
    'books-media': BookOpen,
    'collectibles-antiques': Store,
    'garden-outdoor': Sprout,
    'local-products-gifts': Gift,
    'wholesale-business-supplies': Warehouse,

    // Digital Products.
    'digital-ebooks': BookOpen,
    'digital-courses': GraduationCap,
    'digital-software': TerminalSquare,
    'digital-templates': LayoutTemplate,
    'digital-graphics': Image,
    'digital-documents': FileText,
    'digital-audio': Music,
    'digital-memberships': RefreshCw,
    'digital-licenses': KeyRound,
    'digital-data-reports': ChartNoAxesColumn,
    'digital-ai-assets': Bot,
    'digital-printables': StickyNote,
    'digital-games': Gamepad2,

    // Travel.
    'travel-accommodation': House,
    'travel-vacation-rentals': Key,
    'travel-flights': Plane,
    'travel-car-rental': Car,
    'travel-cruises': Ship,
    'travel-tours': Compass,
    'travel-packages': Package,
    'travel-transport': Truck,
    'travel-rail-bus': TrainFront,
    'travel-agents': Handshake,
    'travel-corporate': Briefcase,
    'travel-group': UsersRound,
    'travel-protection': Umbrella,
    'travel-documents': TicketsPlane,

    // Insurance.
    'insurance-life': HeartHandshake,
    'insurance-health': Stethoscope,
    'insurance-medicare': ClipboardCheck,
    'insurance-disability': Accessibility,
    'insurance-long-term-care': HeartHandshake,
    'insurance-annuities': PiggyBank,
    'insurance-auto': Car,
    'insurance-property': House,
    'insurance-travel': Plane,
    'insurance-business': Briefcase,
    'insurance-group-benefits': UsersRound,
    'insurance-specialty': Umbrella,
    'insurance-brokers': Handshake,
    'insurance-education': GraduationCap,

    // Automotive.
    'vehicles-new': Car,
    'vehicles-for-sale': Car,
    'vehicles-certified': ShieldCheck,
    'vehicles-private-party': Handshake,
    'vehicles-motorcycles': Bike,
    'vehicles-recreational': Caravan,
    'vehicles-commercial': Truck,
    'vehicles-marine': Sailboat,
    'auto-parts': Wrench,
    'auto-inspections': ClipboardCheck,
    'auto-repair': Hammer,
    'auto-detailing': Sparkles,
    'auto-towing': Truck,
    'auto-financing': Landmark,
    'auto-warranties': ShieldCheck,
    'auto-rentals': Key,

    // Real Estate.
    'property-for-sale': House,
    'property-commercial': Building2,
    'property-new-developments': HousePlus,
    'property-land': TreePine,
    'property-for-rent': Key,
    'property-commercial-lease': Warehouse,
    'property-vacation-investment': Plane,
    'property-agents': Handshake,
    'property-mortgage': Landmark,
    'property-services': ClipboardCheck,
    'property-inspection': Search,
    'property-appraisal': ChartNoAxesColumn,
    'property-escrow-title': FileSignature,
    'property-legal': Scale,

    // Professional Services: three groups, then Jobs and Community.
    professionals: BriefcaseBusiness,
    'local-services': Wrench,
    'services-personal': Scissors,
    jobs: Briefcase,
    community: Users,
};

function useCount() {
    const { locale } = useTranslation();

    return useCallback((value: number) => value.toLocaleString(locale), [locale]);
}

/* ------------------------------------------------------------------ */

export function MegaMenu() {
    const { t } = useTranslation();
    const format = useCount();
    const panelId = useId();
    const triggerId = useId();

    const [open, setOpen] = useState(false);
    const [roots, setRoots] = useState<CategoryTreeNode[] | null>(null);
    const [loadError, setLoadError] = useState('');
    const [activeId, setActiveId] = useState<number | null>(null);
    const [drilled, setDrilled] = useState<CategoryTreeNode | null>(null);
    const [search, setSearch] = useState('');
    const [announcement, setAnnouncement] = useState('');

    const container = useRef<HTMLDivElement>(null);
    const panel = useRef<HTMLElement>(null);
    const searchInput = useRef<HTMLInputElement>(null);

    // Where the panel's top edge sits, measured from the trigger. The panel is
    // portalled to <body>, so it cannot inherit its position from the header.
    const [panelTop, setPanelTop] = useState(0);

    // Fetched on first open, not on mount: the header is on every page and
    // most visits never open this menu.
    useEffect(() => {
        if (!open || roots !== null) {
            return;
        }

        let cancelled = false;

        categoryApi.tree()
            .then((tree) => {
                if (cancelled) {
                    return;
                }

                setRoots(tree);
                setActiveId((current) => current ?? tree[0]?.id ?? null);
            })
            .catch(() => !cancelled && setLoadError(t('mega.loadFailed')));

        return () => { cancelled = true; };
    }, [open, roots, t]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                setDrilled(null);
            }
        };

        // Both refs, not just the container: the panel is portalled out of the
        // header, so a click inside it is not inside `container` any more.
        const onPointerDown = (event: MouseEvent) => {
            const target = event.target as Node;

            if (container.current?.contains(target) || panel.current?.contains(target)) {
                return;
            }

            setOpen(false);
            setDrilled(null);
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('mousedown', onPointerDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('mousedown', onPointerDown);
        };
    }, [open]);

    // Re-measured on scroll and resize: the header is sticky, so the bar moves
    // under the page without the panel unmounting.
    useEffect(() => {
        if (!open) {
            return;
        }

        const place = () => {
            const box = container.current?.getBoundingClientRect();

            if (box) {
                setPanelTop(box.bottom + 8);
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

    const active = useMemo(
        () => roots?.find((root) => root.id === activeId) ?? roots?.[0] ?? null,
        [roots, activeId],
    );

    const matches = useMemo(() => searchCategories(roots ?? [], search), [roots, search]);
    const searching = search.trim().length >= 2;

    function toggle() {
        const next = !open;

        setOpen(next);
        setAnnouncement(next ? t('mega.opened') : t('mega.closed'));

        if (!next) {
            setDrilled(null);
            setSearch('');
        }
    }

    function choose(root: CategoryTreeNode) {
        setActiveId(root.id);
        setAnnouncement(t('mega.categorySelected', { name: root.name }));
    }

    function close() {
        setOpen(false);
        setDrilled(null);
        setSearch('');
    }

    return (
        <div ref={container} className="relative">
            <button
                type="button"
                id={triggerId}
                aria-controls={panelId}
                aria-expanded={open}
                onClick={toggle}
                className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded px-3 py-2.5 font-semibold hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-honey"
            >
                <LayoutGrid className="h-4 w-4 text-honey" />
                {t('nav.allCategories')}
                <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {/*
                Portalled to <body>, fixed, and above everything on the page.
                Two reasons, either of which alone would clip it: the nav strip
                it is triggered from is an `overflow-x` scroller, which clips an
                absolutely positioned child in both axes; and the header is
                `sticky z-40`, which opens a stacking context the panel could
                never escape from the inside, however high its own z-index.
            */}
            {open && createPortal((
                <nav
                    ref={panel}
                    id={panelId}
                    aria-labelledby={triggerId}
                    aria-label={t('mega.menuLabel')}
                    style={{ top: panelTop }}
                    className="fixed inset-x-0 z-[100] max-h-[calc(100vh-4rem)] overflow-hidden border-y border-amber-200 bg-white text-charcoal shadow-2xl lg:left-1/2 lg:right-auto lg:w-[min(94vw,64rem)] lg:-translate-x-1/2 lg:rounded-2xl lg:border"
                >
                    {/* Mobile header: drill-down title and a way back out. */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-amber-50 px-4 py-3 lg:hidden">
                        {drilled ? (
                            <button
                                type="button"
                                onClick={() => setDrilled(null)}
                                className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-700 hover:bg-white"
                            >
                                <ChevronLeft className="h-5 w-5" />{t('common.back')}
                            </button>
                        ) : (
                            <h2 className="font-bold text-slate-950">{t('mega.title')}</h2>
                        )}
                        <button type="button" onClick={close} aria-label={t('common.close')} className="rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-slate-900">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="border-b border-slate-200 p-3">
                        <div className="relative mx-auto max-w-2xl">
                            <label htmlFor={`${panelId}-search`} className="sr-only">{t('mega.searchLabel')}</label>
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                            <input
                                id={`${panelId}-search`}
                                ref={searchInput}
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder={t('mega.searchPlaceholder')}
                                className="min-h-10 w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => { setSearch(''); searchInput.current?.focus(); }}
                                    aria-label={t('mega.clearSearch')}
                                    className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}

                            {search.trim().length > 0 && (
                                <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                                    {!searching ? (
                                        <div className="p-5 text-center">
                                            <p className="font-semibold text-slate-800">{t('mega.keepTyping')}</p>
                                            <p className="mt-1 text-sm text-slate-500">{t('mega.keepTypingHint')}</p>
                                        </div>
                                    ) : matches.length === 0 ? (
                                        <div className="p-5 text-center">
                                            <p className="font-semibold text-slate-900">{t('mega.noResults')}</p>
                                            <p className="mt-1 text-sm text-slate-500">{t('mega.noResultsHint')}</p>
                                        </div>
                                    ) : (
                                        <div className="max-h-80 overflow-y-auto p-2">
                                            <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">{t('mega.suggested')}</p>
                                            {matches.map(({ node, trail }) => (
                                                <a
                                                    key={node.id}
                                                    href={categoryHref(node.slug)}
                                                    onClick={close}
                                                    className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm hover:bg-amber-50"
                                                >
                                                    <span className="min-w-0">
                                                        <span className="block truncate text-slate-900">{node.name}</span>
                                                        {trail && <span className="block truncate text-xs text-slate-500">{trail}</span>}
                                                    </span>
                                                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${toneClasses(node.tone).chip}`}>
                                                        {node.total_count > 0 ? t('mega.listings', { count: format(node.total_count) }) : t('mega.noListings')}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {loadError ? (
                        <p role="alert" className="p-6 text-center text-sm font-medium text-rose-700">{loadError}</p>
                    ) : roots === null ? (
                        <div className="flex items-center justify-center gap-3 p-10 text-sm text-slate-500">
                            <Loader2 className="h-5 w-5 animate-spin text-amber-600" />{t('common.loading')}
                        </div>
                    ) : (
                        <div className="max-h-[calc(100vh-14rem)] overflow-y-auto lg:max-h-[65vh]">
                            <div className="grid lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[13rem_minmax(0,1fr)_13rem]">
                                <DepartmentRail
                                    roots={roots}
                                    active={active}
                                    drilled={drilled}
                                    onChoose={choose}
                                    onDrill={setDrilled}
                                />

                                {/* Desktop keeps the panel beside the rail; mobile
                                    shows it only after a department is tapped. */}
                                <div className={`${drilled ? 'block' : 'hidden'} p-3 lg:block lg:border-l lg:border-slate-200 lg:p-4`}>
                                    {(drilled ?? active) && <DepartmentPanel root={drilled ?? active!} onNavigate={close} />}
                                </div>

                                <FeaturedAside root={drilled ?? active} onNavigate={close} />
                            </div>

                            <Shortcuts onNavigate={close} />
                            <SellBanner onNavigate={close} />
                        </div>
                    )}
                </nav>
            ), document.body)}

            {/* Menus that open and close without moving focus are silent to a
                screen reader otherwise. */}
            <div aria-live="polite" className="sr-only">{announcement}</div>
        </div>
    );
}

/* ------------------------------------------------------------------ */

function DepartmentRail({ roots, active, drilled, onChoose, onDrill }: {
    roots: CategoryTreeNode[];
    active: CategoryTreeNode | null;
    drilled: CategoryTreeNode | null;
    onChoose: (root: CategoryTreeNode) => void;
    onDrill: (root: CategoryTreeNode) => void;
}) {
    const { t } = useTranslation();
    const format = useCount();

    return (
        <div className={`${drilled ? 'hidden' : 'block'} p-2 lg:block`}>
            <h2 className="px-2 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">{t('mega.departments')}</h2>
            <ul className="space-y-0.5">
                {roots.map((root) => {
                    const Icon = departmentIcon[root.slug] ?? LayoutGrid;
                    const current = active?.id === root.id;

                    return (
                        <li key={root.id}>
                            <button
                                type="button"
                                aria-current={current ? 'true' : undefined}
                                // Hover on desktop matches how a shopper scans a
                                // rail; tap drills in on mobile.
                                onMouseEnter={() => onChoose(root)}
                                onFocus={() => onChoose(root)}
                                onClick={() => { onChoose(root); onDrill(root); }}
                                className={`flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] font-semibold transition lg:min-h-9 ${current ? 'bg-amber-50 text-amber-900' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${toneClasses(root.tone).iconBox}`}>
                                    <Icon className="h-3.5 w-3.5" />
                                </span>
                                <span className="min-w-0 flex-1 truncate">{root.name}</span>
                                {root.total_count > 0 && (
                                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                        {format(root.total_count)}
                                    </span>
                                )}
                                <ChevronRight className={`h-4 w-4 shrink-0 ${current ? 'text-amber-700' : 'text-slate-300'}`} />
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function DepartmentPanel({ root, onNavigate }: { root: CategoryTreeNode; onNavigate: () => void }) {
    const { t } = useTranslation();
    const format = useCount();
    const groups = categoryGroups(root);

    return (
        <>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-slate-950">{root.name}</h2>
                        {root.total_count > 0 && (
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${toneClasses(root.tone).chip}`}>
                                {t('mega.listings', { count: format(root.total_count) })}
                            </span>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{t('mega.subcategories', { count: root.children.length })}</p>
                </div>
                <a
                    href={categoryHref(root.slug)}
                    onClick={onNavigate}
                    className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-amber-800 hover:bg-amber-50 lg:min-h-8"
                >
                    {t('mega.viewAll')}<ChevronRight className="h-4 w-4" />
                </a>
            </div>

            <div className="mt-3 grid gap-x-5 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                {groups.map((group) => (
                    <div key={group.heading?.id ?? 'more'}>
                        <h3 className="flex items-center gap-2 text-[13px] font-bold text-slate-950">
                            {group.heading ? (
                                <a href={categoryHref(group.heading.slug)} onClick={onNavigate} className="hover:text-amber-800">
                                    {group.heading.name}
                                </a>
                            ) : t('mega.moreIn', { name: root.name })}
                        </h3>
                        <ul className="mt-1.5 space-y-0.5">
                            {group.items.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={categoryHref(item.slug)}
                                        onClick={onNavigate}
                                        className="flex min-h-9 items-center justify-between gap-2 rounded-md px-1.5 text-[13px] text-slate-600 hover:bg-amber-50 hover:text-amber-900 lg:min-h-7"
                                    >
                                        <span className="truncate">{item.name}</span>
                                        {item.total_count > 0 && (
                                            <span className="shrink-0 text-xs text-slate-400">{format(item.total_count)}</span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <a
                href={categoryHref(root.slug)}
                onClick={onNavigate}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700 lg:min-h-9"
            >
                {t('mega.viewAllIn', { name: root.name })}<ChevronRight className="h-4 w-4" />
            </a>
        </>
    );
}

function FeaturedAside({ root, onNavigate }: { root: CategoryTreeNode | null; onNavigate: () => void }) {
    const { t } = useTranslation();
    const format = useCount();

    if (!root) {
        return null;
    }

    // "Popular" is the busiest branches by listing count — derived, so the
    // panel never claims a ranking the data does not support.
    const popular = [...root.children]
        .filter((child) => child.total_count > 0)
        .sort((a, b) => b.total_count - a.total_count)
        .slice(0, 5);

    return (
        <aside className="hidden border-t border-slate-200 p-3 xl:block xl:border-l xl:border-t-0">
            <div className="rounded-xl bg-gradient-to-br from-honey to-amber p-4 text-charcoal">
                <span className="inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                    {t('mega.featured')}
                </span>
                <h2 className="mt-2.5 text-lg font-black leading-tight">{root.name}</h2>
                <p className="mt-1 text-xs leading-5 text-amber-950">
                    {root.total_count > 0
                        ? t('mega.listings', { count: format(root.total_count) })
                        : t('mega.noListings')}
                </p>
                <a
                    href={categoryHref(root.slug)}
                    onClick={onNavigate}
                    className="mt-3 flex min-h-9 items-center justify-center rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                    {t('mega.viewAllIn', { name: root.name })}
                </a>
            </div>

            {popular.length > 0 && (
                <section className="mt-4">
                    <h2 className="text-[13px] font-bold text-slate-950">{t('mega.popularNow')}</h2>
                    <ul className="mt-1.5 space-y-0.5 text-[13px]">
                        {popular.map((child) => (
                            <li key={child.id}>
                                <a
                                    href={categoryHref(child.slug)}
                                    onClick={onNavigate}
                                    className="flex min-h-7 items-center justify-between gap-2 rounded-md px-1.5 text-slate-600 hover:bg-amber-50 hover:text-amber-900"
                                >
                                    <span className="truncate">{child.name}</span>
                                    <span className="shrink-0 text-xs text-slate-400">{format(child.total_count)}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </aside>
    );
}

function Shortcuts({ onNavigate }: { onNavigate: () => void }) {
    const { t } = useTranslation();

    const links: { label: MessageKey; href: string }[] = [
        { label: 'mega.shopProducts', href: '?type=products#marketplace' },
        { label: 'mega.browseServices', href: '?type=services#marketplace' },
        { label: 'mega.localBusinesses', href: '?type=stores#marketplace' },
        { label: 'mega.deals', href: '?sort=deals#marketplace' },
        { label: 'mega.newVendors', href: '?sort=newest#marketplace' },
        { label: 'mega.verifiedPartners', href: '?verified=1#marketplace' },
    ];

    return (
        <section className="border-t border-slate-200 bg-slate-50 px-3 py-2.5">
            <h2 className="sr-only">{t('mega.shortcuts')}</h2>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
                {links.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        onClick={onNavigate}
                        className="flex min-h-11 items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-amber-50 hover:text-amber-900 lg:min-h-9"
                    >
                        <Store className="h-4 w-4 shrink-0 text-amber-600" />
                        <span className="min-w-0 truncate">{t(link.label)}</span>
                    </a>
                ))}
            </div>
        </section>
    );
}

function SellBanner({ onNavigate }: { onNavigate: () => void }) {
    const { t } = useTranslation();

    return (
        <section className="border-t border-amber-200 bg-amber-50 px-4 py-3 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-950">{t('mega.sellTitle')}</h2>
                <p className="mt-0.5 max-w-xl text-xs text-slate-600">{t('mega.sellBody')}</p>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2.5 sm:mt-0 sm:shrink-0">
                <a
                    href="#sell-on-asbeez"
                    onClick={onNavigate}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700 lg:min-h-9"
                >
                    {t('mega.startSelling')}
                </a>
                <a
                    href="#how-it-works"
                    onClick={onNavigate}
                    className="inline-flex min-h-11 items-center text-xs font-semibold text-slate-700 underline hover:text-amber-800 lg:min-h-9"
                >
                    {t('mega.learnSelling')}
                </a>
            </div>
        </section>
    );
}
