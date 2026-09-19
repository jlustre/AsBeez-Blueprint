import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
    AlertCircle,
    Check,
    ChevronDown,
    ChevronRight,
    Clock,
    Copy,
    ExternalLink,
    Eye,
    Globe,
    Loader2,
    MapPin,
    Maximize,
    Plus,
    Save,
    ShieldCheck,
    Star,
    Trash2,
    Upload,
    WandSparkles,
    X,
} from 'lucide-react';

import { iconByName } from '../../lib/icons';
import { toneClasses } from '../../lib/tones';
import { storeApi, type StoreProfile, type StructureSettingDefinition } from '../../lib/store';
import { useStoreProfile, type Draft } from './useStoreProfile';

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

const inputClass =
    'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-white transition-all';

const ghostButton =
    'inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:opacity-60';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Section({ id, title, description, aside, children }: {
    id?: string;
    title: string;
    description: string;
    aside?: ReactNode;
    children: ReactNode;
}) {
    const headingId = `${title.toLowerCase().replace(/[^a-z]+/g, '-')}-heading`;

    return (
        <section id={id} aria-labelledby={headingId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 id={headingId} className="text-base font-bold text-slate-900">{title}</h2>
                    <p className="mt-0.5 text-xs text-slate-500">{description}</p>
                </div>
                {aside}
            </div>
            {children}
        </section>
    );
}

function Field({ label, hint, error, children }: { label: string; hint?: string | null; error?: string; children: ReactNode }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-900">{label}</label>
            {children}
            {error
                ? <p className="mt-1 text-[11px] font-medium text-rose-600">{error}</p>
                : hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
        </div>
    );
}

function Toggle({ label, on, onChange, size = 'lg', onColor = 'peer-checked:bg-amber-400' }: {
    label: string;
    on: boolean;
    onChange: (on: boolean) => void;
    size?: 'sm' | 'lg';
    onColor?: string;
}) {
    const track = size === 'lg' ? 'w-10 h-6' : 'w-9 h-5';
    const knob = size === 'lg' ? 'after:h-5 after:w-5' : 'after:h-4 after:w-4';

    return (
        <label className="relative inline-flex shrink-0 cursor-pointer items-center" aria-label={label}>
            <input type="checkbox" className="peer sr-only" checked={on} onChange={(e) => onChange(e.target.checked)} />
            <span className={`${track} rounded-full bg-slate-300 transition-colors ${onColor} after:absolute after:left-0.5 after:top-0.5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] ${knob} peer-checked:after:translate-x-4`} />
        </label>
    );
}

function StatusPill({ status, children }: { status: string; children: ReactNode }) {
    const map: Record<string, { box: string; dot: string }> = {
        published: { box: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
        verified: { box: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
        draft: { box: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
        pending: { box: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
        rejected: { box: 'text-rose-700 bg-rose-50 border-rose-200', dot: 'bg-rose-500' },
    };
    const tone = map[status] ?? { box: 'text-slate-600 bg-slate-50 border-slate-200', dot: 'bg-slate-400' };

    return (
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone.box}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
            {children}
        </span>
    );
}

function Centered({ children }: { children: ReactNode }) {
    return <div className="flex min-h-[60vh] items-center justify-center p-8 text-center">{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function storeIdFromLocation(): number | null {
    const raw = new URLSearchParams(window.location.search).get('store');
    const id = raw ? Number(raw) : NaN;

    return Number.isFinite(id) && id > 0 ? id : null;
}

export function StoreProfilePage() {
    const [routeStoreId, setRouteStoreId] = useState(storeIdFromLocation);
    const profile = useStoreProfile(routeStoreId);
    const {
        structure, stores, store, draft, loading, loadError, dirty, save,
        setCore, setSetting, setSocial, toggleCategory, setHours, commit, discard, replaceStore,
    } = profile;

    const [copied, setCopied] = useState(false);
    const [busyMedia, setBusyMedia] = useState<'banner' | 'logo' | null>(null);
    const [mediaError, setMediaError] = useState('');
    const bannerInput = useRef<HTMLInputElement>(null);
    const logoInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const onHashChange = () => setRouteStoreId(storeIdFromLocation());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    if (loading) {
        return (
            <Centered>
                <div className="flex items-center gap-3 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">Loading your store profile…</span>
                </div>
            </Centered>
        );
    }

    if (loadError) {
        return (
            <Centered>
                <div className="max-w-sm space-y-3">
                    <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
                    <p className="text-sm font-semibold text-slate-900">{loadError}</p>
                    <button onClick={() => window.location.reload()} className={ghostButton}>Try again</button>
                </div>
            </Centered>
        );
    }

    if (!store || !draft || !structure) {
        return (
            <Centered>
                <div className="max-w-sm space-y-3">
                    <Store2 />
                    <p className="text-sm font-semibold text-slate-900">You do not have a store yet.</p>
                    <p className="text-xs text-slate-500">Create one to start building your storefront.</p>
                    <CreateStoreButton onCreated={(fresh) => { replaceStore(fresh); setRouteStoreId(fresh.id); }} />
                </div>
            </Centered>
        );
    }

    const fieldError = (name: string) => save.fieldErrors[name]?.[0];

    async function uploadMedia(kind: 'banner' | 'logo', file: File | undefined) {
        if (!file || !store) {
            return;
        }

        setBusyMedia(kind);
        setMediaError('');

        try {
            replaceStore(await storeApi.uploadMedia(store.id, kind, file));
        } catch (error) {
            setMediaError(error instanceof Error ? error.message : 'Upload failed.');
        } finally {
            setBusyMedia(null);
        }
    }

    async function removeMedia(kind: 'banner' | 'logo') {
        if (!store) {
            return;
        }

        setBusyMedia(kind);

        try {
            replaceStore(await storeApi.removeMedia(store.id, kind));
        } catch (error) {
            setMediaError(error instanceof Error ? error.message : 'Could not remove the image.');
        } finally {
            setBusyMedia(null);
        }
    }

    async function copyStoreUrl() {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/#/stores/${draft!.core.slug}`);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard blocked; leave the label unchanged.
        }
    }

    const settingsByGroup = (group: string) =>
        structure.setting_definitions.filter((d) => d.group === group);

    return (
        <main id="main-content" className="mx-auto w-full max-w-[1700px] flex-1 space-y-6 px-4 py-5 sm:px-6 sm:py-6">

            {/* ===== PAGE HEADER ===== */}
            <header className="space-y-4">
                <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        <li><a href="#vendor-dashboard" className="rounded transition-colors hover:text-amber-600">Dashboard</a></li>
                        <li aria-hidden="true" className="text-slate-300"><ChevronRight className="h-3.5 w-3.5" /></li>
                        <li><a href="#store-profile" className="rounded transition-colors hover:text-amber-600">My Store</a></li>
                        <li aria-hidden="true" className="text-slate-300"><ChevronRight className="h-3.5 w-3.5" /></li>
                        <li aria-current="page" className="font-medium text-slate-700">Store Profile</li>
                    </ol>
                </nav>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Store Profile</h1>
                            <StatusPill status={store.status === 'active' ? 'published' : 'draft'}>
                                {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                            </StatusPill>
                            {store.verified_at && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                    <ShieldCheck className="h-3.5 w-3.5" />Verified
                                </span>
                            )}
                        </div>
                        <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
                            Manage the public identity, media, and presentation of your store. Changes here appear on your live storefront.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {stores.length > 1 && (
                            <StoreSwitcher
                                stores={stores}
                                currentId={store.id}
                                dirty={dirty}
                                onSwitch={(id) => {
                                    const url = new URL(window.location.href);
                                    url.searchParams.set('store', String(id));
                                    window.history.replaceState({}, '', url);
                                    setRouteStoreId(id);
                                }}
                            />
                        )}
                        {/* Preview uses the saved slug, not the draft one: the
                            storefront can only resolve what is actually stored. */}
                        <a href={`?store=${store.slug}#storefront`} className={ghostButton}>
                            <Eye className="h-4 w-4" />Preview Store
                        </a>
                        {store.status === 'active' && (
                            <a
                                href={`?store=${store.slug}#storefront`}
                                target="_blank"
                                rel="noreferrer"
                                className={ghostButton}
                                title="Opens your published storefront in a new tab"
                            >
                                <ExternalLink className="h-4 w-4" />View Live Store
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={() => void commit()}
                            disabled={!dirty || save.saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {save.saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {save.saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {save.error && (
                    <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                        <AlertCircle className="mt-px h-4 w-4 shrink-0" />{save.error}
                    </p>
                )}
                {save.message && (
                    <p role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                        <Check className="mt-px h-4 w-4 shrink-0" />{save.message}
                    </p>
                )}
            </header>

            {/* ===== COMPLETENESS ===== */}
            <section aria-labelledby="completeness-heading" className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-white shadow-sm">
                <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                        <div className="shrink-0 lg:w-[340px]">
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/25 text-amber-700">
                                    <WandSparkles className="h-5 w-5" />
                                </span>
                                <div>
                                    <h2 id="completeness-heading" className="text-base font-bold text-slate-900">Complete your store setup</h2>
                                    <p className="mt-0.5 text-xs text-slate-500">A complete store builds customer trust and ranks higher in search.</p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <div className="mb-1.5 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-600">Setup progress</span>
                                    <span className="text-sm font-extrabold text-amber-700">{store.completeness.percent}% complete</span>
                                </div>
                                <div
                                    className="h-2.5 w-full overflow-hidden rounded-full border border-amber-200 bg-white"
                                    role="progressbar"
                                    aria-valuenow={store.completeness.percent}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label="Store setup progress"
                                >
                                    <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-500" style={{ width: `${store.completeness.percent}%` }} />
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    {store.completeness.remaining === 0
                                        ? 'Everything is done. Nice work.'
                                        : `${store.completeness.remaining} of ${store.completeness.total} remaining tasks. Finish them to boost your store visibility.`}
                                </p>
                            </div>
                        </div>

                        <div className="min-w-0 flex-1">
                            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="list">
                                {store.completeness.tasks.map((task) => (
                                    <li
                                        key={task.key}
                                        className={`flex items-start gap-3 rounded-xl border p-3 ${task.done ? 'border-emerald-200 bg-white/70' : 'border-amber-200 bg-white'}`}
                                    >
                                        <span
                                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${task.done ? 'bg-emerald-500' : 'border-2 border-amber-400'}`}
                                            aria-hidden="true"
                                        >
                                            {task.done ? <Check className="h-3 w-3 text-white" /> : <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-sm font-semibold ${task.done ? 'text-slate-700 line-through decoration-slate-300' : 'text-slate-900'}`}>
                                                {task.label}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-slate-500">{task.hint}</p>
                                            {!task.done && (
                                                <a href={task.href} className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-800">
                                                    {task.cta}<ChevronRight className="h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MAIN TWO-COLUMN ===== */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">

                    {/* --- Identity & media --- */}
                    <Section
                        id="store-identity"
                        title="Store Identity & Media"
                        description="Your storefront branding — logo, banner, name, and description."
                        aside={
                            <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 sm:inline-flex">
                                Branding
                            </span>
                        }
                    >
                        <div className="space-y-6 p-5 sm:p-6">
                            {mediaError && (
                                <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{mediaError}</p>
                            )}

                            {/* Banner */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-900">Store banner</label>
                                    <span className="text-[11px] text-slate-500">Recommended 1600 × 400px · JPG or PNG · max 5MB</span>
                                </div>
                                <input ref={bannerInput} type="file" accept="image/*" className="hidden" onChange={(e) => void uploadMedia('banner', e.target.files?.[0])} />
                                <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 transition-colors hover:border-amber-400">
                                    {store.media.banner_url ? (
                                        <img src={store.media.banner_url} alt="Current store banner" className="h-40 w-full object-cover sm:h-52" />
                                    ) : (
                                        <div className="flex h-40 w-full items-center justify-center bg-slate-50 text-xs text-slate-400 sm:h-52">No banner uploaded yet</div>
                                    )}
                                    <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-slate-900/60 to-transparent p-4">
                                        <div className="flex gap-2">
                                            <button type="button" disabled={busyMedia === 'banner'} onClick={() => bannerInput.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:bg-white disabled:opacity-60">
                                                {busyMedia === 'banner' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                                                {store.media.banner_url ? 'Replace' : 'Upload'}
                                            </button>
                                            {store.media.banner_url && (
                                                <button type="button" disabled={busyMedia === 'banner'} onClick={() => void removeMedia('banner')} className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-sm hover:bg-white disabled:opacity-60">
                                                    <Trash2 className="h-3.5 w-3.5" />Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Logo */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-900">Store logo</label>
                                    <span className="text-[11px] text-slate-500">Recommended 400 × 400px · PNG or SVG</span>
                                </div>
                                <input ref={logoInput} type="file" accept="image/*" className="hidden" onChange={(e) => void uploadMedia('logo', e.target.files?.[0])} />
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    {store.media.logo_url ? (
                                        <img src={store.media.logo_url} alt="Current store logo" className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-4 ring-amber-100" />
                                    ) : (
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-[10px] text-slate-400 ring-4 ring-amber-100">No logo</div>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        <button type="button" disabled={busyMedia === 'logo'} onClick={() => logoInput.current?.click()} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60">
                                            {busyMedia === 'logo' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                                            {store.media.logo_url ? 'Upload new logo' : 'Upload logo'}
                                        </button>
                                        {store.media.logo_url && (
                                            <button type="button" disabled={busyMedia === 'logo'} onClick={() => void removeMedia('logo')} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 shadow-sm hover:bg-rose-50 disabled:opacity-60">
                                                <Trash2 className="h-3.5 w-3.5" />Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Store name" hint="Displayed across your storefront, listings, and receipts." error={fieldError('name')}>
                                    <input type="text" value={draft.core.name} onChange={(e) => setCore('name', e.target.value)} className={inputClass} />
                                </Field>
                                <Field label="Store slug" hint="Lowercase letters, numbers, and hyphens only." error={fieldError('slug')}>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">asbeez.com/store/</span>
                                        <input type="text" value={draft.core.slug} onChange={(e) => setCore('slug', e.target.value)} className={`${inputClass} pl-[148px] font-mono`} />
                                    </div>
                                </Field>
                            </div>

                            <Field label="Public store URL">
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input type="text" readOnly value={`asbeez.com/store/${draft.core.slug}`} className="flex-1 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 font-mono text-sm text-slate-600" />
                                    <button type="button" onClick={() => void copyStoreUrl()} aria-label="Copy store URL to clipboard" className={`${ghostButton} justify-center py-2.5`}>
                                        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </Field>

                            <Field label="Short tagline" hint="Appears under your store name. Max 120 characters." error={fieldError('tagline')}>
                                <input type="text" maxLength={120} value={draft.core.tagline} onChange={(e) => setCore('tagline', e.target.value)} className={inputClass} />
                            </Field>

                            <div>
                                <label htmlFor="store-description" className="mb-1.5 block text-sm font-semibold text-slate-900">Store description</label>
                                <textarea id="store-description" rows={5} value={draft.core.description} onChange={(e) => setCore('description', e.target.value)} className={`${inputClass} resize-y`} />
                                <div className="mt-1.5 flex items-center justify-between">
                                    <p className="text-[11px] text-slate-500">Aim for 150–300 characters for best SEO results.</p>
                                    <span className="text-[11px] text-slate-400">{draft.core.description.length} / 5000</span>
                                </div>
                            </div>

                            {/* Categories — options come from the admin registry */}
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-900">Store categories</label>
                                <div className="mb-2.5 flex flex-wrap gap-2">
                                    {draft.categoryIds.map((id) => {
                                        const category = structure.categories.find((c) => c.id === id);
                                        if (!category) return null;

                                        return (
                                            <span key={id} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses(category.tone).chip}`}>
                                                {category.name}
                                                <button type="button" onClick={() => toggleCategory(id)} aria-label={`Remove ${category.name} category`} className="rounded hover:opacity-70">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        );
                                    })}
                                    {draft.categoryIds.length === 0 && <span className="text-xs text-slate-400">No categories chosen yet.</span>}
                                </div>
                                <select
                                    value=""
                                    onChange={(e) => e.target.value && toggleCategory(Number(e.target.value))}
                                    className={inputClass}
                                >
                                    <option value="">Choose a category to add…</option>
                                    {structure.categories
                                        .filter((c) => !draft.categoryIds.includes(c.id))
                                        .map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </Section>

                    {/* --- Contact & location --- */}
                    <Section id="contact-location" title="Contact & Location" description="How customers reach you and where your business operates.">
                        <div className="space-y-5 p-5 sm:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Public email" error={fieldError('public_email')}>
                                    <input type="email" value={draft.core.public_email} onChange={(e) => setCore('public_email', e.target.value)} className={inputClass} />
                                </Field>
                                <Field label="Customer-service phone" error={fieldError('public_phone')}>
                                    <input type="tel" value={draft.core.public_phone} onChange={(e) => setCore('public_phone', e.target.value)} className={inputClass} />
                                </Field>
                                <div className="sm:col-span-2">
                                    <Field label="Website" error={fieldError('website')}>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Globe className="h-4 w-4" /></span>
                                            <input type="url" value={draft.core.website} onChange={(e) => setCore('website', e.target.value)} className={`${inputClass} pl-10`} />
                                        </div>
                                    </Field>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Country" error={fieldError('country')}>
                                    <input type="text" maxLength={2} value={draft.core.country} onChange={(e) => setCore('country', e.target.value.toUpperCase())} className={inputClass} placeholder="US" />
                                </Field>
                                <Field label="State or province">
                                    <input type="text" value={draft.core.state} onChange={(e) => setCore('state', e.target.value)} className={inputClass} />
                                </Field>
                                <Field label="City">
                                    <input type="text" value={draft.core.city} onChange={(e) => setCore('city', e.target.value)} className={inputClass} />
                                </Field>
                                <Field label="Postal code">
                                    <input type="text" value={draft.core.postal_code} onChange={(e) => setCore('postal_code', e.target.value)} className={inputClass} />
                                </Field>
                                <div className="sm:col-span-2">
                                    <Field label="Business address">
                                        <input type="text" value={draft.core.address_line} onChange={(e) => setCore('address_line', e.target.value)} className={inputClass} />
                                    </Field>
                                    <label className="mt-2.5 inline-flex cursor-pointer items-center gap-2">
                                        <input type="checkbox" checked={draft.core.hide_address} onChange={(e) => setCore('hide_address', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400" />
                                        <span className="text-xs text-slate-600">Hide the complete street address from customers</span>
                                    </label>
                                </div>
                            </div>

                            <Field label="Service area" hint="Describe where you deliver products or offer services.">
                                <input type="text" value={draft.core.service_area} onChange={(e) => setCore('service_area', e.target.value)} className={inputClass} />
                            </Field>

                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-900">Location map</label>
                                <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-white" role="img" aria-label="Approximate store location">
                                    <div className="absolute inset-0 opacity-30" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #F7B928 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, #E89B0C 0.5px, transparent 1px)', backgroundSize: '22px 22px, 34px 34px' }} />
                                    <div className="relative px-4 text-center">
                                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow-lg"><MapPin className="h-6 w-6" /></span>
                                        <p className="mt-3 text-sm font-semibold text-slate-800">
                                            {[draft.core.address_line, draft.core.city, draft.core.state, draft.core.postal_code].filter(Boolean).join(', ') || 'No address set'}
                                        </p>
                                        <button type="button" className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-white">
                                            <Maximize className="h-3.5 w-3.5" />Adjust pin location
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* --- Business hours --- */}
                    <Section
                        id="business-hours"
                        title="Business Hours"
                        description="Set when customers can reach you or place orders."
                        aside={
                            <select value={draft.core.timezone} onChange={(e) => setCore('timezone', e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
                                {(settingsByGroup('commerce').find((d) => d.key === 'store_timezone')?.options ?? []).map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        }
                    >
                        <div className="p-5 sm:p-6">
                            <div className="space-y-2.5">
                                {WEEKDAYS.map((dayName, weekday) => {
                                    const row = draft.hours.find((h) => h.weekday === weekday)
                                        ?? { weekday, is_closed: true, opens_at: '09:00', closes_at: '17:00' };

                                    const update = (next: Partial<typeof row>) => {
                                        const merged = { ...row, ...next };
                                        setHours([
                                            ...draft.hours.filter((h) => h.weekday !== weekday),
                                            merged,
                                        ].sort((a, b) => a.weekday - b.weekday));
                                    };

                                    return (
                                        <div key={dayName} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:flex-row sm:items-center">
                                            <div className="flex shrink-0 items-center gap-3 sm:w-44">
                                                <Toggle
                                                    label={`Toggle ${dayName} open`}
                                                    on={!row.is_closed}
                                                    size="sm"
                                                    onColor="peer-checked:bg-emerald-500"
                                                    onChange={(on) => update({ is_closed: !on })}
                                                />
                                                <span className="text-sm font-semibold text-slate-800">{dayName}</span>
                                                {row.is_closed && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500">Closed</span>}
                                            </div>
                                            <div className={`flex flex-1 items-center gap-2 ${row.is_closed ? 'pointer-events-none opacity-50' : ''}`}>
                                                <input
                                                    type="time"
                                                    value={row.opens_at ?? ''}
                                                    disabled={row.is_closed}
                                                    onChange={(e) => update({ opens_at: e.target.value })}
                                                    aria-label={`${dayName} opening time`}
                                                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-slate-100 sm:w-32"
                                                />
                                                <span className="text-xs text-slate-400">to</span>
                                                <input
                                                    type="time"
                                                    value={row.closes_at ?? ''}
                                                    disabled={row.is_closed}
                                                    onChange={(e) => update({ closes_at: e.target.value })}
                                                    aria-label={`${dayName} closing time`}
                                                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-slate-100 sm:w-32"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const monday = draft.hours.find((h) => h.weekday === 1);
                                        if (!monday) return;
                                        setHours(draft.hours.map((h) => (h.weekday >= 1 && h.weekday <= 5
                                            ? { ...h, opens_at: monday.opens_at, closes_at: monday.closes_at, is_closed: monday.is_closed }
                                            : h)));
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                                >
                                    <Clock className="h-3.5 w-3.5" />Apply Monday&apos;s hours to weekdays
                                </button>
                            </div>
                        </div>
                    </Section>

                    {/* --- Social — platform list comes from the admin registry --- */}
                    <Section title="Social & Communication" description="Connect your social profiles and control how customers reach you.">
                        <div className="space-y-5 p-5 sm:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {structure.social_platforms.map((platform) => {
                                    const FallbackIcon = iconByName(platform.icon);

                                    return (
                                        <div key={platform.id}>
                                            <label htmlFor={`social-${platform.key}`} className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${toneClasses(platform.tone).iconBoxStrong}`}>
                                                    {platform.icon_path ? (
                                                        <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                            <path d={platform.icon_path} />
                                                        </svg>
                                                    ) : <FallbackIcon className="h-3.5 w-3.5" />}
                                                </span>
                                                {platform.label}
                                            </label>
                                            <input
                                                id={`social-${platform.key}`}
                                                type={platform.input_type}
                                                placeholder={platform.placeholder ?? ''}
                                                value={draft.socials[platform.id] ?? ''}
                                                onChange={(e) => setSocial(platform.id, e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-3">
                                {settingsByGroup('social').map((definition) => (
                                    <SettingRow key={definition.key} definition={definition} draft={draft} onChange={setSetting} />
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* --- Policies — types come from the admin registry --- */}
                    <PolicySection
                        store={store}
                        policyTypes={structure.policy_types}
                        onChanged={replaceStore}
                    />

                    {/* --- Settings — every control is a setting_definition row --- */}
                    <Section title="Store Settings" description="Control how your store behaves for customers.">
                        <div className="space-y-5 p-5 sm:p-6">
                            <div className="space-y-3">
                                {settingsByGroup('store').map((definition) => (
                                    <SettingRow key={definition.key} definition={definition} draft={draft} onChange={setSetting} />
                                ))}
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {settingsByGroup('commerce').map((definition) => (
                                    <Field key={definition.key} label={definition.label} hint={definition.hint}>
                                        {definition.type === 'select' ? (
                                            <select value={draft.settings[definition.key] ?? ''} onChange={(e) => setSetting(definition.key, e.target.value)} className={inputClass}>
                                                {(definition.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                type={definition.type === 'number' ? 'number' : 'text'}
                                                step={definition.type === 'number' ? '0.01' : undefined}
                                                value={draft.settings[definition.key] ?? ''}
                                                onChange={(e) => setSetting(definition.key, e.target.value)}
                                                className={inputClass}
                                            />
                                        )}
                                    </Field>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* --- Verification --- */}
                    <VerificationSection store={store} onRefresh={profile.refresh} />
                </div>

                {/* ===== RIGHT COLUMN: PREVIEW ===== */}
                <div className="space-y-6">
                    <section aria-labelledby="preview-heading" className="sticky top-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
                            <h2 id="preview-heading" className="text-sm font-bold text-slate-900">Storefront Preview</h2>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Live</span>
                        </div>
                        <div className="p-3">
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <div className="relative">
                                    {store.media.banner_url
                                        ? <img src={store.media.banner_url} alt="" className="h-28 w-full object-cover" />
                                        : <div className="h-28 w-full bg-gradient-to-br from-amber-100 to-yellow-50" />}
                                    {store.media.logo_url
                                        ? <img src={store.media.logo_url} alt="" className="absolute -bottom-6 left-4 h-14 w-14 rounded-2xl object-cover shadow-md ring-4 ring-white" />
                                        : <div className="absolute -bottom-6 left-4 h-14 w-14 rounded-2xl bg-slate-200 shadow-md ring-4 ring-white" />}
                                </div>
                                <div className="px-4 pb-4 pt-8">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="truncate text-sm font-bold text-slate-900">{draft.core.name || 'Untitled store'}</h3>
                                        {store.verified_at && (
                                            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white" aria-label="Verified store">
                                                <Check className="h-2.5 w-2.5" />
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                                        <span className="inline-flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /><span className="font-semibold text-slate-700">New</span></span>
                                        {draft.core.city && <><span className="text-slate-300">·</span><span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{draft.core.city}{draft.core.state ? `, ${draft.core.state}` : ''}</span></>}
                                    </div>
                                    <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{draft.core.tagline || 'Add a tagline to introduce your store.'}</p>
                                    <div className="mt-3 flex gap-2">
                                        <button type="button" className="inline-flex flex-1 items-center justify-center rounded-lg bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-slate-900 shadow-sm">Follow Store</button>
                                        <button type="button" className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700">Contact</button>
                                    </div>
                                    <nav className="mt-3 flex gap-3 overflow-x-auto border-t border-slate-100 pt-3" aria-label="Storefront navigation preview">
                                        <span className="whitespace-nowrap border-b-2 border-amber-400 pb-1 text-[11px] font-semibold text-amber-700">Home</span>
                                        {['Products', 'Services', 'About', 'Reviews', 'Policies'].map((item) => (
                                            <span key={item} className="whitespace-nowrap text-[11px] text-slate-500">{item}</span>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                        <a
                            href={`?store=${store.slug}#storefront`}
                            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                        >
                            <Eye className="h-3.5 w-3.5" />Open full preview
                        </a>
                    </section>
                </div>
            </div>

            {/* ===== MANAGE YOUR STORE — every link is a nav_links row ===== */}
            <section aria-labelledby="nav-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                    <h2 id="nav-heading" className="text-base font-bold text-slate-900">Manage Your Store</h2>
                    <p className="mt-0.5 text-xs text-slate-500">Jump straight to any part of your vendor workspace.</p>
                </div>
                <div className="space-y-6 p-5 sm:p-6">
                    {Object.entries(
                        structure.nav_links.reduce<Record<string, typeof structure.nav_links>>((groups, link) => {
                            (groups[link.group] ??= []).push(link);
                            return groups;
                        }, {}),
                    ).map(([group, links]) => (
                        <div key={group}>
                            <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />{group}
                            </h3>
                            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                                {links.map((link) => {
                                    const LinkIcon = iconByName(link.icon);

                                    return (
                                        <a key={link.id} href={link.route} className="group flex items-start gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-amber-300 hover:bg-amber-50/40">
                                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneClasses(link.tone).iconBox}`}>
                                                <LinkIcon className="h-4 w-4" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">{link.label}</p>
                                                <p className="mt-0.5 text-[11px] text-slate-500">{link.hint}</p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== STICKY SAVE BAR — appears only when there is something to save ===== */}
            {dirty && (
                <>
                    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.1)]">
                        <div className="mx-auto flex max-w-[1700px] items-center gap-3">
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-400" aria-hidden="true" />
                                <p className="truncate text-xs font-semibold text-slate-700">Unsaved changes</p>
                            </div>
                            <button type="button" onClick={discard} disabled={save.saving} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                                Discard
                            </button>
                            <button type="button" onClick={() => void commit()} disabled={save.saving} className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-900 shadow-sm hover:bg-amber-500 disabled:opacity-60">
                                {save.saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                {save.saving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </div>
                    <div className="h-20" aria-hidden="true" />
                </>
            )}
        </main>
    );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Store2() {
    const Icon = iconByName('Store');
    return <Icon className="mx-auto h-10 w-10 text-slate-300" />;
}

function CreateStoreButton({ onCreated }: { onCreated: (store: StoreProfile) => void }) {
    const [name, setName] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    async function create() {
        if (!name.trim()) return;

        setBusy(true);
        setError('');

        try {
            onCreated(await storeApi.create(name.trim()));
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'Could not create the store.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="space-y-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Store name" className={inputClass} />
            {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
            <button type="button" onClick={() => void create()} disabled={busy || !name.trim()} className="w-full rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 disabled:opacity-60">
                {busy ? 'Creating…' : 'Create store'}
            </button>
        </div>
    );
}

function StoreSwitcher({ stores, currentId, dirty, onSwitch }: {
    stores: { id: number; name: string; status: string }[];
    currentId: number;
    dirty: boolean;
    onSwitch: (id: number) => void;
}) {
    const current = stores.find((s) => s.id === currentId);

    return (
        <label className="relative inline-flex items-center">
            <span className="sr-only">Switch store</span>
            <select
                value={currentId}
                onChange={(e) => {
                    const id = Number(e.target.value);
                    // Switching would drop unsaved edits, so make that explicit.
                    if (dirty && !window.confirm('You have unsaved changes. Switch store and discard them?')) {
                        e.target.value = String(currentId);
                        return;
                    }
                    onSwitch(id);
                }}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-9 text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                title={current?.name}
            >
                {stores.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}{s.status !== 'active' ? ` (${s.status})` : ''}</option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-500" />
        </label>
    );
}

function SettingRow({ definition, draft, onChange }: {
    definition: StructureSettingDefinition;
    draft: Draft;
    onChange: (key: string, value: string) => void;
}) {
    const value = draft.settings[definition.key] ?? definition.default_value ?? '';

    return (
        <div className="flex items-start justify-between gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50">
            <div>
                <p className="text-sm font-semibold text-slate-900">{definition.label}</p>
                {definition.hint && <p className="mt-0.5 text-xs text-slate-500">{definition.hint}</p>}
            </div>
            <div className="mt-1">
                <Toggle label={definition.label} on={value === '1'} onChange={(on) => onChange(definition.key, on ? '1' : '0')} />
            </div>
        </div>
    );
}

function PolicySection({ store, policyTypes, onChanged }: {
    store: StoreProfile;
    policyTypes: { id: number; key: string; label: string; hint: string | null; icon: string; tone: string; is_required: boolean }[];
    onChanged: (store: StoreProfile) => void;
}) {
    const [editing, setEditing] = useState<number | null>(null);
    const [body, setBody] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    async function savePolicy(typeId: number, status: 'draft' | 'published') {
        setBusy(true);
        setError('');

        try {
            await storeApi.savePolicy(store.id, { policy_type_id: typeId, body, status });
            onChanged(await storeApi.get(store.id));
            setEditing(null);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'Could not save the policy.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <Section
            id="store-policies"
            title="Store Policies"
            description="Policies are shown to customers at checkout and on your storefront."
            aside={
                <span className="text-[11px] font-semibold text-slate-500">
                    {store.policies.filter((p) => p.status === 'published').length} of {policyTypes.length} published
                </span>
            }
        >
            {error && <p role="alert" className="mx-5 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{error}</p>}
            <ul className="divide-y divide-slate-100" role="list">
                {policyTypes.map((type) => {
                    const existing = store.policies.find((p) => p.policy_type_id === type.id);
                    const PolicyIcon = iconByName(type.icon);
                    const isEditing = editing === type.id;

                    return (
                        <li key={type.id} className="p-4 sm:px-6">
                            <div className="flex items-center gap-4">
                                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses(type.tone).iconBox}`}>
                                    <PolicyIcon className="h-5 w-5" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                        {type.label}
                                        {type.is_required && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">Required</span>}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">{type.hint}</p>
                                </div>
                                <StatusPill status={existing?.status ?? 'none'}>
                                    {existing ? (existing.status === 'published' ? 'Published' : 'Draft') : 'Not configured'}
                                </StatusPill>
                                <button
                                    type="button"
                                    onClick={() => { setEditing(isEditing ? null : type.id); setBody(existing?.body ?? ''); }}
                                    className="shrink-0 text-xs font-semibold text-slate-700 hover:text-amber-700"
                                >
                                    {isEditing ? 'Cancel' : existing ? 'Edit' : 'Add'}
                                </button>
                            </div>

                            {isEditing && (
                                <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3">
                                    <textarea
                                        rows={5}
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        placeholder={`Write your ${type.label.toLowerCase()}…`}
                                        className={`${inputClass} resize-y bg-white`}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button type="button" disabled={busy} onClick={() => void savePolicy(type.id, 'draft')} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-60">
                                            Save draft
                                        </button>
                                        <button type="button" disabled={busy || !body.trim()} onClick={() => void savePolicy(type.id, 'published')} className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 disabled:opacity-60">
                                            {busy ? 'Saving…' : 'Publish'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </Section>
    );
}

function VerificationSection({ store, onRefresh }: { store: StoreProfile; onRefresh: () => Promise<void> }) {
    const [busy, setBusy] = useState<string | null>(null);
    const kinds: { kind: string; label: string; hint: string }[] = [
        { kind: 'business', label: 'Business verification', hint: 'Business licence or registration document' },
        { kind: 'identity', label: 'Identity verification', hint: 'Government ID and a selfie' },
        { kind: 'email', label: 'Email verification', hint: store.contact.public_email ?? 'Add a public email first' },
        { kind: 'phone', label: 'Phone verification', hint: 'Enables SMS notifications' },
        { kind: 'payment', label: 'Secure-payment badge', hint: 'Shows the AsBeez Secure Payments badge' },
    ];

    async function request(kind: string) {
        setBusy(kind);

        try {
            await storeApi.requestVerification(store.id, kind);
            await onRefresh();
        } finally {
            setBusy(null);
        }
    }

    return (
        <Section id="verification-trust" title="Verification & Trust" description="Verified stores get more customer trust and higher placement in search results.">
            <ul className="divide-y divide-slate-100" role="list">
                {kinds.map(({ kind, label, hint }) => {
                    const row = store.verifications.find((v) => v.kind === kind);
                    const status = row?.status ?? 'unverified';

                    return (
                        <li key={kind} className="flex items-center gap-4 p-4 sm:px-6">
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                <ShieldCheck className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-900">{label}</p>
                                <p className="mt-0.5 text-xs text-slate-500">{row?.reference ?? hint}</p>
                            </div>
                            <StatusPill status={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </StatusPill>
                            {status !== 'verified' && status !== 'pending' && (
                                <button type="button" disabled={busy === kind} onClick={() => void request(kind)} className="shrink-0 text-xs font-semibold text-slate-700 hover:text-amber-700 disabled:opacity-60">
                                    {busy === kind ? 'Sending…' : 'Verify now'}
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </Section>
    );
}
