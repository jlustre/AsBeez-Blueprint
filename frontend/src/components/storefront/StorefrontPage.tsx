import { useEffect, useState } from 'react';
import {
    AlertCircle,
    ArrowLeft,
    BadgeCheck,
    Clock,
    Eye,
    Globe,
    Loader2,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Star,
} from 'lucide-react';

import { iconByName } from '../../lib/icons';
import { toneClasses } from '../../lib/tones';
import { storefrontApi, structureApi, type PublicStore, type Structure } from '../../lib/store';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TABS = ['Home', 'Products', 'Services', 'About', 'Reviews', 'Policies'] as const;

/** Slug comes from the query string, beside the route hash. */
function slugFromLocation(): string {
    return new URLSearchParams(window.location.search).get('store') ?? '';
}

function formatTime(value: string | null): string {
    if (!value) {
        return '';
    }

    const [hours, minutes] = value.split(':').map(Number);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;

    return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

export function StorefrontPage() {
    const [slug, setSlug] = useState(slugFromLocation);
    const [store, setStore] = useState<PublicStore | null>(null);
    const [structure, setStructure] = useState<Structure | null>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tab, setTab] = useState<(typeof TABS)[number]>('Home');

    useEffect(() => {
        const onHashChange = () => setSlug(slugFromLocation());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError('');

            if (!slug) {
                setError('No store was named in the link.');
                setLoading(false);
                return;
            }

            try {
                const { store: fetched, preview } = await storefrontApi.get(slug);

                if (cancelled) {
                    return;
                }

                setStore(fetched);
                setIsPreview(preview);

                // Social marks live in the admin registry; only fetch them when
                // the store actually has links to show, and never block on it.
                if (fetched.socials.length > 0) {
                    structureApi.get().then((s) => !cancelled && setStructure(s)).catch(() => undefined);
                }
            } catch (caught) {
                if (!cancelled) {
                    setError(caught instanceof Error ? caught.message : 'This storefront could not be loaded.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void load();

        return () => { cancelled = true; };
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">Loading storefront…</span>
                </div>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="max-w-sm space-y-3 text-center">
                    <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
                    <p className="text-sm font-semibold text-slate-900">{error || 'Storefront not found.'}</p>
                    <p className="text-xs text-slate-500">
                        The store may be unpublished, or the link may be out of date.
                    </p>
                    <a href="#store-profile" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                        <ArrowLeft className="h-4 w-4" />Back to your store profile
                    </a>
                </div>
            </div>
        );
    }

    const openToday = store.hours.find((h) => h.weekday === new Date().getDay());
    const publishedPolicies = store.policies.filter((p) => p.status === 'published');

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">

            {/* Preview banner — never let a draft masquerade as a live storefront */}
            {isPreview && (
                <div className="sticky top-0 z-50 border-b border-amber-300 bg-amber-100 px-4 py-2.5">
                    <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
                        <p className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                            <Eye className="h-4 w-4" />
                            Preview — this store is <b>{store.status}</b> and is not visible to shoppers yet.
                        </p>
                        <a href="#store-profile" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50">
                            <ArrowLeft className="h-3.5 w-3.5" />Back to editing
                        </a>
                    </div>
                </div>
            )}

            {/* Banner + identity */}
            <header className="bg-white">
                <div className="relative">
                    {store.media.banner_url
                        ? <img src={store.media.banner_url} alt={`${store.name} banner`} className="h-48 w-full object-cover sm:h-64 lg:h-72" />
                        : <div className="h-48 w-full bg-gradient-to-br from-amber-200 via-amber-100 to-yellow-50 sm:h-64 lg:h-72" />}
                </div>

                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="-mt-12 flex flex-col gap-4 pb-6 sm:-mt-14 sm:flex-row sm:items-end">
                        {store.media.logo_url
                            ? <img src={store.media.logo_url} alt={`${store.name} logo`} className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-lg ring-4 ring-white sm:h-28 sm:w-28" />
                            : <div className="h-24 w-24 shrink-0 rounded-2xl bg-slate-200 shadow-lg ring-4 ring-white sm:h-28 sm:w-28" />}

                        <div className="min-w-0 flex-1 sm:pb-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">{store.name}</h1>
                                {store.verified_at && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700" title="Verified store">
                                        <BadgeCheck className="h-3.5 w-3.5" />Verified
                                    </span>
                                )}
                            </div>
                            {store.tagline && <p className="mt-1 text-sm text-slate-600">{store.tagline}</p>}

                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    <span className="font-semibold text-slate-700">New store</span>
                                </span>
                                {(store.location.city || store.location.state) && (
                                    <>
                                        <span className="text-slate-300">·</span>
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {[store.location.city, store.location.state].filter(Boolean).join(', ')}
                                        </span>
                                    </>
                                )}
                                {openToday && (
                                    <>
                                        <span className="text-slate-300">·</span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {openToday.is_closed
                                                ? 'Closed today'
                                                : `Open today ${formatTime(openToday.opens_at)} – ${formatTime(openToday.closes_at)}`}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex shrink-0 gap-2 sm:pb-1">
                            <button type="button" className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm hover:bg-amber-500">
                                Follow Store
                            </button>
                            {store.contact.public_email && (
                                <a href={`mailto:${store.contact.public_email}`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                                    Contact
                                </a>
                            )}
                        </div>
                    </div>

                    <nav className="flex gap-1 overflow-x-auto border-t border-slate-100" aria-label="Storefront sections">
                        {TABS.map((item) => (
                            <button
                                key={item}
                                onClick={() => setTab(item)}
                                aria-current={tab === item ? 'page' : undefined}
                                className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors ${
                                    tab === item
                                        ? 'border-amber-400 font-semibold text-amber-700'
                                        : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
                {tab === 'Policies' ? (
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold">Store policies</h2>
                        {publishedPolicies.length === 0 ? (
                            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                                This store has not published any policies yet.
                            </p>
                        ) : publishedPolicies.map((policy) => (
                            <article key={policy.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                                <h3 className="text-sm font-bold capitalize">{policy.type_key?.replace(/_/g, ' ')}</h3>
                                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{policy.body}</p>
                            </article>
                        ))}
                    </section>
                ) : tab === 'Products' || tab === 'Services' || tab === 'Reviews' ? (
                    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <p className="text-sm font-semibold text-slate-700">No {tab.toLowerCase()} yet</p>
                        <p className="mt-1 text-xs text-slate-500">This store has not listed any {tab.toLowerCase()} so far.</p>
                    </section>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {store.description && (
                                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                                    <h2 className="text-base font-bold">About this store</h2>
                                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{store.description}</p>

                                    {store.categories.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {store.categories.map((category) => (
                                                <span key={category.id} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses(category.tone).chip}`}>
                                                    {category.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}

                            {store.hours.length > 0 && (
                                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                    <h2 className="border-b border-slate-100 p-5 text-base font-bold">Opening hours</h2>
                                    <ul className="divide-y divide-slate-100">
                                        {[...store.hours].sort((a, b) => a.weekday - b.weekday).map((row) => (
                                            <li key={row.weekday} className="flex items-center justify-between px-5 py-2.5 text-sm">
                                                <span className={row.weekday === new Date().getDay() ? 'font-bold' : 'text-slate-600'}>
                                                    {WEEKDAYS[row.weekday]}
                                                </span>
                                                <span className={row.is_closed ? 'text-slate-400' : 'font-medium text-slate-800'}>
                                                    {row.is_closed ? 'Closed' : `${formatTime(row.opens_at)} – ${formatTime(row.closes_at)}`}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {publishedPolicies.length > 0 && (
                                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                                    <h2 className="text-base font-bold">Policies</h2>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {publishedPolicies.map((policy) => (
                                            <button
                                                key={policy.id}
                                                onClick={() => setTab('Policies')}
                                                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold capitalize text-slate-600 hover:border-amber-300 hover:text-amber-700"
                                            >
                                                {policy.type_key?.replace(/_/g, ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <aside className="space-y-6">
                            <section className="rounded-2xl border border-slate-200 bg-white p-5">
                                <h2 className="text-base font-bold">Contact</h2>
                                <ul className="mt-3 space-y-2.5 text-sm">
                                    {store.contact.public_email && (
                                        <li className="flex items-start gap-2.5">
                                            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                            <a href={`mailto:${store.contact.public_email}`} className="min-w-0 break-words text-slate-700 hover:text-amber-700">{store.contact.public_email}</a>
                                        </li>
                                    )}
                                    {store.contact.public_phone && (
                                        <li className="flex items-start gap-2.5">
                                            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                            <a href={`tel:${store.contact.public_phone}`} className="text-slate-700 hover:text-amber-700">{store.contact.public_phone}</a>
                                        </li>
                                    )}
                                    {store.contact.website && (
                                        <li className="flex items-start gap-2.5">
                                            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                            <a href={store.contact.website} target="_blank" rel="noreferrer" className="min-w-0 break-words text-slate-700 hover:text-amber-700">{store.contact.website}</a>
                                        </li>
                                    )}
                                    {(store.location.address_line || store.location.city) && (
                                        <li className="flex items-start gap-2.5">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                            <span className="text-slate-700">
                                                {[store.location.address_line, store.location.city, store.location.state, store.location.postal_code]
                                                    .filter(Boolean).join(', ')}
                                            </span>
                                        </li>
                                    )}
                                </ul>

                                {store.location.service_area && (
                                    <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                        <b className="text-slate-700">Serving:</b> {store.location.service_area}
                                    </p>
                                )}
                            </section>

                            {store.socials.length > 0 && structure && (
                                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                                    <h2 className="text-base font-bold">Follow along</h2>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {store.socials.map((social) => {
                                            const platform = structure.social_platforms.find((p) => p.id === social.platform_id);

                                            if (!platform) {
                                                return null;
                                            }

                                            const FallbackIcon = iconByName(platform.icon);
                                            const isLink = platform.input_type === 'url';

                                            return (
                                                <a
                                                    key={social.platform_id}
                                                    href={isLink ? social.value : undefined}
                                                    target={isLink ? '_blank' : undefined}
                                                    rel={isLink ? 'noreferrer' : undefined}
                                                    title={`${platform.label}: ${social.value}`}
                                                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:scale-110 ${toneClasses(platform.tone).iconBoxStrong}`}
                                                >
                                                    {platform.icon_path ? (
                                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                            <path d={platform.icon_path} />
                                                        </svg>
                                                    ) : <FallbackIcon className="h-4 w-4" />}
                                                    <span className="sr-only">{platform.label}</span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {store.verifications.some((v) => v.status === 'verified') && (
                                <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                    <h2 className="flex items-center gap-2 text-base font-bold text-emerald-900">
                                        <ShieldCheck className="h-5 w-5" />Trusted seller
                                    </h2>
                                    <ul className="mt-2 space-y-1 text-xs text-emerald-800">
                                        {store.verifications.filter((v) => v.status === 'verified').map((v) => (
                                            <li key={v.kind} className="capitalize">✓ {v.kind.replace(/_/g, ' ')} verified</li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </aside>
                    </div>
                )}
            </main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-slate-500 sm:px-6">
                    <p>
                        <span className="font-extrabold text-slate-800">As<span className="text-amber-500">Beez</span></span>
                        {' '}· storefront for {store.name}
                    </p>
                    <a href="#marketplace" className="mt-2 inline-block font-semibold text-slate-600 hover:text-amber-700">
                        Browse the AsBeez marketplace
                    </a>
                </div>
            </footer>
        </div>
    );
}
