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

import { useTranslation } from '../../i18n';
import { iconByName } from '../../lib/icons';
import { toneClasses } from '../../lib/tones';
import { storefrontApi, structureApi, type PublicStore, type Structure } from '../../lib/store';

/** 2024-01-07 was a Sunday, so index 0..6 maps onto getDay(). */
function weekdayName(weekday: number, locale: string): string {
    return new Date(2024, 0, 7 + weekday).toLocaleDateString(locale, { weekday: 'long' });
}

const TABS = [
    { id: 'home', label: 'nav.home' },
    { id: 'products', label: 'nav.products' },
    { id: 'services', label: 'nav.services' },
    { id: 'about', label: 'nav.about' },
    { id: 'reviews', label: 'nav.reviews' },
    { id: 'policies', label: 'nav.policies' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/** Slug comes from the query string, beside the route hash. */
function slugFromLocation(): string {
    return new URLSearchParams(window.location.search).get('store') ?? '';
}

function formatTime(value: string | null, locale: string): string {
    if (!value) {
        return '';
    }

    const [hours, minutes] = value.split(':').map(Number);

    // A fixed date carries the clock; only the time part is rendered, so the
    // reader gets 24-hour or AM/PM according to their own locale.
    return new Date(2024, 0, 1, hours, minutes)
        .toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
}

export function StorefrontPage() {
    const { t, locale } = useTranslation();
    const [slug, setSlug] = useState(slugFromLocation);
    const [store, setStore] = useState<PublicStore | null>(null);
    const [structure, setStructure] = useState<Structure | null>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tab, setTab] = useState<TabId>('home');

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
                setError(t('storefront.noStoreNamed'));
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
                    setError(caught instanceof Error ? caught.message : t('storefront.couldNotLoad'));
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
                    <span className="text-sm font-medium">{t('storefront.loading')}</span>
                </div>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="max-w-sm space-y-3 text-center">
                    <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
                    <p className="text-sm font-semibold text-slate-900">{error || t('storefront.notFound')}</p>
                    <p className="text-xs text-slate-500">
                        {t('storefront.notFoundHint')}
                    </p>
                    <a href="#store-profile" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                        <ArrowLeft className="h-4 w-4" />{t('storefront.backToProfile')}
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
                            {t('storefront.previewBanner', { status: store.status })}
                        </p>
                        <a href="#store-profile" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50">
                            <ArrowLeft className="h-3.5 w-3.5" />{t('storefront.backToEditing')}
                        </a>
                    </div>
                </div>
            )}

            {/* Banner + identity */}
            <header className="bg-white">
                <div className="relative">
                    {store.media.banner_url
                        ? <img src={store.media.banner_url} alt={t('storefront.bannerAlt', { name: store.name })} className="h-48 w-full object-cover sm:h-64 lg:h-72" />
                        : <div className="h-48 w-full bg-gradient-to-br from-amber-200 via-amber-100 to-yellow-50 sm:h-64 lg:h-72" />}
                </div>

                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <div className="-mt-12 flex flex-col gap-4 pb-6 sm:-mt-14 sm:flex-row sm:items-end">
                        {store.media.logo_url
                            ? <img src={store.media.logo_url} alt={t('storefront.logoAlt', { name: store.name })} className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-lg ring-4 ring-white sm:h-28 sm:w-28" />
                            : <div className="h-24 w-24 shrink-0 rounded-2xl bg-slate-200 shadow-lg ring-4 ring-white sm:h-28 sm:w-28" />}

                        <div className="min-w-0 flex-1 sm:pb-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">{store.name}</h1>
                                {store.verified_at && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700" title={t('store.verifiedStore')}>
                                        <BadgeCheck className="h-3.5 w-3.5" />{t('storefront.verified')}
                                    </span>
                                )}
                            </div>
                            {store.tagline && <p className="mt-1 text-sm text-slate-600">{store.tagline}</p>}

                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    <span className="font-semibold text-slate-700">{t('storefront.newStore')}</span>
                                </span>
                                {(store.location.city || store.location.state) && (
                                    <>
                                        <span className="text-slate-300">·</span>
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {[store.location.city, store.location.state_name].filter(Boolean).join(', ')}
                                        </span>
                                    </>
                                )}
                                {openToday && (
                                    <>
                                        <span className="text-slate-300">·</span>
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {openToday.is_closed
                                                ? t('storefront.closedToday')
                                                : t('storefront.openToday', { from: formatTime(openToday.opens_at, locale), to: formatTime(openToday.closes_at, locale) })}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex shrink-0 gap-2 sm:pb-1">
                            <button type="button" className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm hover:bg-amber-500">
                                {t('storefront.followStore')}
                            </button>
                            {store.contact.public_email && (
                                <a href={`mailto:${store.contact.public_email}`} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                                    {t('storefront.contact')}
                                </a>
                            )}
                        </div>
                    </div>

                    <nav className="flex gap-1 overflow-x-auto border-t border-slate-100" aria-label={t('storefront.sections')}>
                        {TABS.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                aria-current={tab === id ? 'page' : undefined}
                                className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors ${
                                    tab === id
                                        ? 'border-amber-400 font-semibold text-amber-700'
                                        : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {t(label)}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
                {tab === 'policies' ? (
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold">{t('storefront.storePolicies')}</h2>
                        {publishedPolicies.length === 0 ? (
                            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                                {t('storefront.noPolicies')}
                            </p>
                        ) : publishedPolicies.map((policy) => (
                            <article key={policy.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                                <h3 className="text-sm font-bold capitalize">{policy.type_key?.replace(/_/g, ' ')}</h3>
                                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{policy.body}</p>
                            </article>
                        ))}
                    </section>
                ) : tab === 'products' || tab === 'services' || tab === 'reviews' ? (
                    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <p className="text-sm font-semibold text-slate-700">{t('storefront.emptyTitle', { section: t(`nav.${tab}`).toLowerCase() })}</p>
                        <p className="mt-1 text-xs text-slate-500">{t('storefront.emptyBody', { section: t(`nav.${tab}`).toLowerCase() })}</p>
                    </section>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {store.description && (
                                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                                    <h2 className="text-base font-bold">{t('storefront.aboutTitle')}</h2>
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
                                    <h2 className="border-b border-slate-100 p-5 text-base font-bold">{t('storefront.openingHours')}</h2>
                                    <ul className="divide-y divide-slate-100">
                                        {[...store.hours].sort((a, b) => a.weekday - b.weekday).map((row) => (
                                            <li key={row.weekday} className="flex items-center justify-between px-5 py-2.5 text-sm">
                                                <span className={row.weekday === new Date().getDay() ? 'font-bold' : 'text-slate-600'}>
                                                    {weekdayName(row.weekday, locale)}
                                                </span>
                                                <span className={row.is_closed ? 'text-slate-400' : 'font-medium text-slate-800'}>
                                                    {row.is_closed ? t('storefront.closed') : `${formatTime(row.opens_at, locale)} – ${formatTime(row.closes_at, locale)}`}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {publishedPolicies.length > 0 && (
                                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                                    <h2 className="text-base font-bold">{t('nav.policies')}</h2>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {publishedPolicies.map((policy) => (
                                            <button
                                                key={policy.id}
                                                onClick={() => setTab('policies')}
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
                                <h2 className="text-base font-bold">{t('storefront.contactTitle')}</h2>
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
                                                {[store.location.address_line, store.location.city, store.location.state_name, store.location.postal_code]
                                                    .filter(Boolean).join(', ')}
                                                {store.location.country_name ? `, ${store.location.country_name}` : ''}
                                            </span>
                                        </li>
                                    )}
                                </ul>

                                {store.location.service_area && (
                                    <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                        <b className="text-slate-700">{t('storefront.serving')}</b> {store.location.service_area}
                                    </p>
                                )}
                            </section>

                            {store.socials.length > 0 && structure && (
                                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                                    <h2 className="text-base font-bold">{t('storefront.followAlong')}</h2>
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
                                        <ShieldCheck className="h-5 w-5" />{t('storefront.trustedSeller')}
                                    </h2>
                                    <ul className="mt-2 space-y-1 text-xs text-emerald-800">
                                        {store.verifications.filter((v) => v.status === 'verified').map((v) => (
                                            <li key={v.kind} className="capitalize">✓ {v.kind.replace(/_/g, ' ')} {t('storefront.verifiedSuffix')}</li>
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
                        {' '}· {t('storefront.footer', { name: store.name })}
                    </p>
                    <a href="#marketplace" className="mt-2 inline-block font-semibold text-slate-600 hover:text-amber-700">
                        {t('storefront.browseMarketplace')}
                    </a>
                </div>
            </footer>
        </div>
    );
}
