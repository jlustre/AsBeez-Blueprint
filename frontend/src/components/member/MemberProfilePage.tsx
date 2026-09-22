import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
    AlertCircle,
    ArrowUpRight,
    BadgeCheck,
    Check,
    Loader2,
    Plus,
    Save,
    ShieldCheck,
    Trash2,
    Upload,
    X,
} from 'lucide-react';

import { useAuth } from '../../auth/AuthProvider';
import { ApiError, type FieldErrors } from '../../lib/api';
import { iconByName } from '../../lib/icons';
import {
    memberApi,
    type AddressInput,
    type MemberProfile,
    type MemberProfilePatch,
} from '../../lib/member';
import { structureApi, type Structure, type StructureNavLink, type StructureRegion } from '../../lib/store';
import { categoryOptions, indentOption } from '../../lib/categories';
import { toneClasses } from '../../lib/tones';
import { SUPPORTED_LOCALES, useTranslation } from '../../i18n';

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400';

const ghostButton =
    'inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60';

function Section({ id, title, description, aside, children }: {
    id?: string;
    title: string;
    description?: string;
    aside?: ReactNode;
    children: ReactNode;
}) {
    const headingId = `${title.toLowerCase().replace(/[^a-z]+/g, '-')}-heading`;

    return (
        <section id={id} aria-labelledby={headingId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 id={headingId} className="text-base font-bold text-slate-900">{title}</h2>
                    {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
                </div>
                {aside}
            </div>
            {children}
        </section>
    );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
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

function Toggle({ label, on, onChange, disabled = false }: {
    label: string;
    on: boolean;
    onChange: (on: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <label className={`relative inline-flex shrink-0 items-center ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`} aria-label={label}>
            <input type="checkbox" className="peer sr-only" checked={on} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
            <span className="h-6 w-10 rounded-full bg-slate-300 transition-colors peer-checked:bg-amber-400 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:after:translate-x-4" />
        </label>
    );
}

/** Empty state for the sections whose domain does not exist yet. */
function NotConnected({ title, note, links }: { title: string; note: string; links?: string[] }) {
    const { t } = useTranslation();

    return (
        <Section title={title}>
            <div className="p-5 sm:p-6">
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <p className="text-sm font-semibold text-slate-700">{t('profile.notConnected')}</p>
                    <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">{note}</p>
                    {links && (
                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                            {links.map((l) => (
                                <span key={l} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">{l}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
}

/* ------------------------------------------------------------------ */
/* Draft                                                               */
/* ------------------------------------------------------------------ */

type Draft = {
    personal: Record<string, string>;
    publicProfile: { is_public: boolean; show_activity: boolean; show_reviews: boolean; allow_vendor_contact: boolean };
    preferences: { favorite_business: string; shopping_radius_km: string };
    interestIds: number[];
    notifications: Record<string, Record<string, boolean>>;
};

function draftFrom(profile: MemberProfile): Draft {
    const p = profile.personal;

    return {
        personal: {
            first_name: p.first_name ?? '',
            middle_name: p.middle_name ?? '',
            last_name: p.last_name ?? '',
            display_name: p.display_name ?? '',
            username: p.username ?? '',
            birth_date: p.birth_date ?? '',
            gender: p.gender ?? '',
            pronouns: p.pronouns ?? '',
            occupation: p.occupation ?? '',
            company: p.company ?? '',
            website: p.website ?? '',
            bio: p.bio ?? '',
            phone: p.phone ?? '',
            language: p.language,
            timezone: p.timezone,
        },
        publicProfile: {
            is_public: profile.public_profile.is_public,
            show_activity: profile.public_profile.show_activity,
            show_reviews: profile.public_profile.show_reviews,
            allow_vendor_contact: profile.public_profile.allow_vendor_contact,
        },
        preferences: {
            favorite_business: profile.preferences.favorite_business ?? '',
            shopping_radius_km: profile.preferences.shopping_radius_km?.toString() ?? '',
        },
        interestIds: profile.interests.map((i) => i.id),
        notifications: Object.fromEntries(
            profile.notifications.topics.map((t) => [t.key, { ...t.channels }]),
        ),
    };
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function MemberProfilePage() {
    const { t, locale } = useTranslation();
    const { refresh } = useAuth();
    const [profile, setProfile] = useState<MemberProfile | null>(null);
    const [structure, setStructure] = useState<Structure | null>(null);
    const [draft, setDraft] = useState<Draft | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const baseline = useRef<Draft | null>(null);
    const avatarInput = useRef<HTMLInputElement>(null);

    const adopt = useCallback((fresh: MemberProfile) => {
        const next = draftFrom(fresh);
        setProfile(fresh);
        setDraft(next);
        baseline.current = next;
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const [fetched, structureData] = await Promise.all([memberApi.get(), structureApi.get()]);

                if (!cancelled) {
                    adopt(fetched);
                    setStructure(structureData);
                }
            } catch (caught) {
                if (!cancelled) {
                    setLoadError(caught instanceof Error ? caught.message : t('profile.loadFailed'));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => { cancelled = true; };
    }, [adopt]);

    const dirty = useMemo(
        () => draft !== null && baseline.current !== null && !same(draft, baseline.current),
        [draft],
    );

    useEffect(() => {
        if (!dirty) {
            return;
        }

        const warn = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty]);

    function patch(update: (current: Draft) => Draft) {
        setDraft((current) => (current ? update(current) : current));
        setMessage('');
        setError('');
    }

    const setPersonal = (key: string, value: string) =>
        patch((c) => ({ ...c, personal: { ...c.personal, [key]: value } }));

    const setPublic = (key: keyof Draft['publicProfile'], value: boolean) =>
        patch((c) => ({ ...c, publicProfile: { ...c.publicProfile, [key]: value } }));

    const setPreference = (key: keyof Draft['preferences'], value: string) =>
        patch((c) => ({ ...c, preferences: { ...c.preferences, [key]: value } }));

    const toggleInterest = (id: number) =>
        patch((c) => ({
            ...c,
            interestIds: c.interestIds.includes(id) ? c.interestIds.filter((i) => i !== id) : [...c.interestIds, id],
        }));

    const setNotification = (topic: string, channel: string, on: boolean) =>
        patch((c) => ({
            ...c,
            notifications: { ...c.notifications, [topic]: { ...c.notifications[topic], [channel]: on } },
        }));

    async function commit() {
        if (!profile || !draft || !baseline.current) {
            return;
        }

        const before = baseline.current;
        setSaving(true);
        setError('');
        setMessage('');
        setFieldErrors({});

        try {
            let latest = profile;

            if (!same(draft.personal, before.personal)
                || !same(draft.publicProfile, before.publicProfile)
                || !same(draft.preferences, before.preferences)) {
                const blanked = Object.fromEntries(
                    Object.entries(draft.personal).map(([k, v]) => [k, v === '' ? null : v]),
                );

                latest = await memberApi.update({
                    ...blanked,
                    ...draft.publicProfile,
                    favorite_business: draft.preferences.favorite_business || null,
                    shopping_radius_km: draft.preferences.shopping_radius_km
                        ? Number(draft.preferences.shopping_radius_km)
                        : null,
                } as MemberProfilePatch);
            }

            if (!same(draft.interestIds, before.interestIds)) {
                latest = await memberApi.saveInterests(draft.interestIds);
            }

            if (!same(draft.notifications, before.notifications)) {
                latest = await memberApi.saveNotifications(draft.notifications);
            }

            adopt(latest);
            setMessage(t('common.changesSaved'));
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : t('profile.saveFailed'));
            setFieldErrors(caught instanceof ApiError ? caught.errors : {});
        } finally {
            setSaving(false);
        }
    }

    function discard() {
        if (baseline.current) {
            setDraft(baseline.current);
            setError('');
            setMessage('');
            setFieldErrors({});
        }
    }

    /**
     * Runs an avatar change.
     *
     * The avatar also rides on the auth user, because the surrounding shell
     * paints it in the sidebar and top bar. Refreshing auth afterwards is what
     * makes those two update; without it the new picture appears here and
     * nowhere else until the next full page load.
     */
    async function withProfile(action: () => Promise<MemberProfile>) {
        setError('');

        try {
            adopt(await action());
            await refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : t('profile.actionFailed'));
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex items-center gap-3 text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">{t('profile.loading')}</span>
                </div>
            </div>
        );
    }

    if (loadError || !profile || !draft || !structure) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-8">
                <div className="max-w-sm space-y-3 text-center">
                    <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
                    <p className="text-sm font-semibold text-slate-900">{loadError || t('profile.unavailable')}</p>
                    <button onClick={() => window.location.reload()} className={ghostButton}>{t('common.tryAgain')}</button>
                </div>
            </div>
        );
    }

    const err = (name: string) => fieldErrors[name]?.[0];
    const { completeness, notifications } = profile;
    const memberSince = profile.account.member_since
        ? new Date(profile.account.member_since).toLocaleDateString(locale, { month: 'long', year: 'numeric' })
        : '—';

    return (
        // Rendered inside the member shell's <main>, which supplies the page
        // padding and the breadcrumb, so this is a plain section.
        <div className="mx-auto w-full max-w-7xl space-y-6">

            {/* ===== HEADER ===== */}
            <header className="space-y-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{t('nav.memberProfile')}</h1>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                                {t('profile.activeMember')}
                            </span>
                            {profile.account.email_verified_at && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                                    <BadgeCheck className="h-3.5 w-3.5" />{t('verify.verified')}
                                </span>
                            )}
                        </div>
                        <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
                            {t('profile.intro')}
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {draft.personal.username && (
                            <a href={`?member=${draft.personal.username}#member`} className={ghostButton}>
                                {t('profile.viewPublicProfile')}<ArrowUpRight className="h-4 w-4" />
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={() => void commit()}
                            disabled={!dirty || saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 shadow-sm transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving ? t('common.saving') : t('common.saveChanges')}
                        </button>
                    </div>
                </div>

                {error && (
                    <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                        <AlertCircle className="mt-px h-4 w-4 shrink-0" />{error}
                    </p>
                )}
                {message && (
                    <p role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                        <Check className="mt-px h-4 w-4 shrink-0" />{message}
                    </p>
                )}
            </header>

            {/* ===== COMPLETION ===== */}
            <section aria-labelledby="completion-heading" className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                    <div className="shrink-0 lg:w-[340px]">
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">{t('profile.accountSetup')}</p>
                        <h2 id="completion-heading" className="mt-1 text-lg font-bold text-slate-900">
                            {t('profile.percentComplete', { percent: completeness.percent })}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            {t('profile.completeIntro')}
                        </p>
                        <div
                            className="mt-4 h-2.5 w-full overflow-hidden rounded-full border border-amber-200 bg-white"
                            role="progressbar"
                            aria-label={t('profile.completionLabel')}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={completeness.percent}
                        >
                            <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-500" style={{ width: `${completeness.percent}%` }} />
                        </div>
                    </div>

                    <ul className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2" role="list">
                        {completeness.tasks.map((task) => (
                            <li key={task.key} className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${task.done ? 'border-emerald-200 bg-white/70' : 'border-amber-200 bg-white'}`}>
                                <span className={`text-sm font-semibold ${task.done ? 'text-slate-600 line-through decoration-slate-300' : 'text-slate-900'}`}>
                                    {task.label}
                                </span>
                                {task.done
                                    ? <span className="shrink-0 text-xs font-bold text-emerald-600">{t('profile.done')}</span>
                                    : <a href={task.href} className="shrink-0 text-xs font-bold text-amber-700 hover:underline">{task.cta}</a>}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">

                    {/* ===== PERSONAL ===== */}
                    <Section id="personal" title={t('profile.personalTitle')} description={t('profile.personalIntro')}>
                        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
                            <Field label={t('profile.firstName')} error={err('first_name')}>
                                <input type="text" autoComplete="given-name" value={draft.personal.first_name} onChange={(e) => setPersonal('first_name', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label={t('profile.middleName')}>
                                <input type="text" autoComplete="additional-name" value={draft.personal.middle_name} onChange={(e) => setPersonal('middle_name', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label={t('profile.lastName')} error={err('last_name')}>
                                <input type="text" autoComplete="family-name" value={draft.personal.last_name} onChange={(e) => setPersonal('last_name', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label={t('profile.displayName')} hint={t('profile.displayNameHint')} error={err('display_name')}>
                                <input type="text" value={draft.personal.display_name} onChange={(e) => setPersonal('display_name', e.target.value)} className={inputClass} />
                            </Field>

                            <Field label={t('profile.username')} hint={t('profile.usernameHint')} error={err('username')}>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">asbeez.com/members/</span>
                                    <input type="text" value={draft.personal.username} onChange={(e) => setPersonal('username', e.target.value)} className={`${inputClass} pl-[158px] font-mono`} />
                                </div>
                            </Field>
                            <Field label={t('profile.birthDate')} hint={t('profile.birthDateHint')} error={err('birth_date')}>
                                <input type="date" autoComplete="bday" value={draft.personal.birth_date} onChange={(e) => setPersonal('birth_date', e.target.value)} className={inputClass} />
                            </Field>

                            <Field label={t('profile.emailAddress')} hint={profile.account.email_verified_at ? t('profile.emailVerifiedHint') : t('profile.emailNotVerifiedHint')}>
                                <input type="email" readOnly value={profile.account.email} className={`${inputClass} bg-slate-100 text-slate-500`} />
                            </Field>
                            <Field label={t('profile.phoneNumber')} error={err('phone')}>
                                <input type="tel" autoComplete="tel" value={draft.personal.phone} onChange={(e) => setPersonal('phone', e.target.value)} className={inputClass} />
                            </Field>

                            <Field label={t('profile.gender')} error={err('gender')}>
                                <select value={draft.personal.gender} onChange={(e) => setPersonal('gender', e.target.value)} className={inputClass}>
                                    <option value="">{t('profile.genderUnset')}</option>
                                    <option value="male">{t('profile.genderMale')}</option>
                                    <option value="female">{t('profile.genderFemale')}</option>
                                    <option value="non-binary">{t('profile.genderNonBinary')}</option>
                                    <option value="prefer-not-to-say">{t('profile.genderPreferNot')}</option>
                                    <option value="self-describe">{t('profile.genderSelfDescribe')}</option>
                                </select>
                            </Field>
                            <Field label={t('profile.pronouns')}>
                                <input type="text" placeholder={t('profile.pronounsPlaceholder')} value={draft.personal.pronouns} onChange={(e) => setPersonal('pronouns', e.target.value)} className={inputClass} />
                            </Field>

                            <Field label={t('profile.occupation')}>
                                <input type="text" autoComplete="organization-title" value={draft.personal.occupation} onChange={(e) => setPersonal('occupation', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label={t('profile.company')}>
                                <input type="text" autoComplete="organization" value={draft.personal.company} onChange={(e) => setPersonal('company', e.target.value)} className={inputClass} />
                            </Field>

                            <div className="sm:col-span-2">
                                <Field label={t('profile.website')} error={err('website')}>
                                    <input type="url" autoComplete="url" value={draft.personal.website} onChange={(e) => setPersonal('website', e.target.value)} className={inputClass} />
                                </Field>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-sm font-semibold text-slate-900">{t('profile.bio')}</label>
                                <textarea rows={4} maxLength={500} value={draft.personal.bio} onChange={(e) => setPersonal('bio', e.target.value)} className={`${inputClass} resize-y`} />
                                <div className="mt-1 flex items-center justify-between">
                                    {err('bio') && <p className="text-[11px] font-medium text-rose-600">{err('bio')}</p>}
                                    <span className="ml-auto text-[11px] text-slate-400">{t('profile.bioCount', { count: draft.personal.bio.length })}</span>
                                </div>
                            </div>

                            <Field label={t('profile.preferredLanguage')}>
                                <select value={draft.personal.language} onChange={(e) => setPersonal('language', e.target.value)} className={inputClass}>
                                    {SUPPORTED_LOCALES.map((l) => (
                                        <option key={l.code} value={l.code}>{l.native}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label={t('profile.timezone')} error={err('timezone')}>
                                <select value={draft.personal.timezone} onChange={(e) => setPersonal('timezone', e.target.value)} className={inputClass}>
                                    {['UTC', 'America/Vancouver', 'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York', 'Asia/Manila', 'Australia/Sydney', 'Europe/London']
                                        .map((tz) => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
                                </select>
                            </Field>
                        </div>
                    </Section>

                    {/* ===== INTERESTS ===== */}
                    <Section id="interests" title={t('profile.interestsTitle')} description={t('profile.interestsIntro')}>
                        <div className="space-y-5 p-5 sm:p-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-900">{t('profile.shoppingInterests')}</label>
                                <div className="mb-2.5 flex flex-wrap gap-2">
                                    {draft.interestIds.map((id) => {
                                        const category = structure.categories.find((c) => c.id === id);
                                        if (!category) return null;

                                        return (
                                            <span key={id} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses(category.tone).chip}`}>
                                                {category.name}
                                                <button type="button" onClick={() => toggleInterest(id)} aria-label={t('profile.removeInterest', { name: category.name })} className="rounded hover:opacity-70">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        );
                                    })}
                                    {draft.interestIds.length === 0 && <span className="text-xs text-slate-400">{t('profile.noInterests')}</span>}
                                </div>
                                {/* Drawn from the same admin taxonomy stores are filed under. */}
                                <select value="" onChange={(e) => e.target.value && toggleInterest(Number(e.target.value))} className={inputClass}>
                                    <option value="">{t('profile.addInterest')}</option>
                                    {categoryOptions(structure.categories).filter((c) => !draft.interestIds.includes(c.id))
                                        .map((c) => <option key={c.id} value={c.id} title={c.path}>{indentOption(c)}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label={t('profile.favoriteBusiness')}>
                                    <input type="text" value={draft.preferences.favorite_business} onChange={(e) => setPreference('favorite_business', e.target.value)} className={inputClass} />
                                </Field>
                                <Field label={t('profile.shoppingRadius')} hint={t('profile.shoppingRadiusHint')} error={err('shopping_radius_km')}>
                                    <select value={draft.preferences.shopping_radius_km} onChange={(e) => setPreference('shopping_radius_km', e.target.value)} className={inputClass}>
                                        <option value="">{t('profile.radiusAnywhere')}</option>
                                        {[10, 25, 50, 100].map((km) => (
                                            <option key={km} value={km}>{t('profile.radiusKm', { km })}</option>
                                        ))}
                                    </select>
                                </Field>
                            </div>
                        </div>
                    </Section>

                    {/* ===== ADDRESSES ===== */}
                    <AddressBook
                        profile={profile}
                        structure={structure}
                        onChanged={(fresh) => adopt(fresh)}
                        onError={setError}
                    />

                    {/* ===== COMMUNICATION ===== */}
                    <Section id="communication" title={t('profile.communicationTitle')} description={t('profile.communicationIntro')}>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[560px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        <th scope="col" className="px-5 py-3">{t('profile.notification')}</th>
                                        {notifications.channels.map((channel) => (
                                            <th key={channel.key} scope="col" className="px-3 py-3 text-center">
                                                {channel.label}
                                                {!channel.available && <span className="block text-[9px] font-medium normal-case text-slate-400">{t('verify.unavailable')}</span>}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {notifications.topics.map((topic) => (
                                        <tr key={topic.key} className="hover:bg-slate-50/70">
                                            <th scope="row" className="px-5 py-3 text-sm font-semibold text-slate-800">
                                                {topic.label}
                                                {topic.is_mandatory && (
                                                    <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">{t('verify.required')}</span>
                                                )}
                                            </th>
                                            {notifications.channels.map((channel) => (
                                                <td key={channel.key} className="px-3 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        aria-label={t('profile.notifyBy', { topic: topic.label, channel: channel.label })}
                                                        checked={draft.notifications[topic.key]?.[channel.key] ?? false}
                                                        disabled={topic.is_mandatory || !channel.available}
                                                        onChange={(e) => setNotification(topic.key, channel.key, e.target.checked)}
                                                        className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="border-t border-slate-100 px-5 py-3 text-[11px] text-slate-500">
                            {t('profile.mandatoryNote')}
                        </p>
                    </Section>

                    {/* ===== Domains that do not exist yet ===== */}
                    <NotConnected
                        title={t('profile.paymentsTitle')}
                        note={t('profile.paymentsNote')}
                        links={[t('profile.linkPaymentMethods'), t('profile.linkWallet'), t('profile.linkGiftCards'), t('profile.linkTransactions')]}
                    />
                    <NotConnected
                        title={t('profile.rewardsTitle')}
                        note={t('profile.rewardsNote')}
                        links={[t('profile.linkPoints'), t('profile.linkCoupons'), t('profile.linkReferrals')]}
                    />
                    <NotConnected
                        title={t('profile.activityTitle')}
                        note={t('profile.activityNote')}
                        links={[t('profile.linkOrders'), t('profile.linkReviews'), t('profile.linkSignIns')]}
                    />
                </div>

                {/* ===== RIGHT COLUMN ===== */}
                <div className="space-y-6">
                    <section aria-labelledby="summary-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 id="summary-heading" className="text-base font-bold text-slate-900">{t('profile.summaryTitle')}</h2>

                        <div className="mt-4 flex flex-col items-center text-center">
                            {profile.public_profile.avatar_url ? (
                                <img src={profile.public_profile.avatar_url} alt={t('profile.avatarAlt')} className="h-24 w-24 rounded-2xl object-cover ring-4 ring-amber-100" />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-100 text-2xl font-extrabold text-amber-800 ring-4 ring-amber-50">
                                    {profile.public_profile.initials}
                                </div>
                            )}

                            <input ref={avatarInput} type="file" accept="image/*" className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) void withProfile(() => memberApi.uploadAvatar(file));
                                }} />

                            <div className="mt-3 flex gap-2">
                                <button type="button" onClick={() => avatarInput.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                    <Upload className="h-3.5 w-3.5" />{t('profile.editAvatar')}
                                </button>
                                {profile.public_profile.avatar_url && (
                                    <button type="button" onClick={() => void withProfile(() => memberApi.removeAvatar())} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50">
                                        <Trash2 className="h-3.5 w-3.5" />{t('common.remove')}
                                    </button>
                                )}
                            </div>

                            <h3 className="mt-3 text-lg font-bold text-slate-900">{profile.public_profile.public_name}</h3>
                            {draft.personal.username && <p className="text-xs text-slate-500">@{draft.personal.username}</p>}
                        </div>

                        <dl className="mt-4 divide-y divide-slate-100 border-t border-slate-100 text-sm">
                            {[
                                [t('profile.memberSince'), memberSince],
                                [t('auth.email'), profile.account.email_verified_at ? t('verify.verified') : t('profile.unverified')],
                                [t('profile.interests'), String(draft.interestIds.length)],
                                [t('profile.addresses'), String(profile.addresses.length)],
                                [t('profile.publicProfile'), draft.publicProfile.is_public ? t('profile.visible') : t('profile.hidden')],
                            ].map(([term, value]) => (
                                <div key={term} className="flex items-center justify-between py-2.5">
                                    <dt className="text-slate-500">{term}</dt>
                                    <dd className="font-semibold text-slate-800">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    {/* Public profile controls */}
                    <Section title={t('profile.publicProfile')} description={t('profile.publicIntro')}>
                        <div className="space-y-1 p-5 sm:p-6">
                            {([
                                ['is_public', t('profile.showPublic'), t('profile.showPublicHint')],
                                ['show_activity', t('profile.showActivity'), t('profile.showActivityHint')],
                                ['show_reviews', t('profile.showReviews'), t('profile.showReviewsHint')],
                                ['allow_vendor_contact', t('profile.allowVendorContact'), t('profile.allowVendorContactHint')],
                            ] as const).map(([key, label, hint]) => (
                                <div key={key} className="flex items-start justify-between gap-4 rounded-xl p-3 hover:bg-slate-50">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{label}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
                                    </div>
                                    <div className="mt-1">
                                        <Toggle label={label} on={draft.publicProfile[key]} onChange={(on) => setPublic(key, on)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Account and trust */}
                    <Section id="account-security" title={t('profile.accountTitle')} description={t('profile.accountIntro')}>
                        <div className="p-5 sm:p-6">
                            <dl className="divide-y divide-slate-100 text-sm">
                                {[
                                    [t('profile.accountStatus'), t('profile.active'), true],
                                    [t('profile.emailVerification'), profile.account.email_verified_at ? t('verify.verified') : t('profile.actionRequired'), Boolean(profile.account.email_verified_at)],
                                    [t('profile.phoneNumber'), draft.personal.phone ? t('profile.onFile') : t('profile.notAdded'), Boolean(draft.personal.phone)],
                                    [t('profile.publicProfile'), draft.publicProfile.is_public ? t('profile.visible') : t('profile.hidden'), true],
                                ].map(([term, value, ok]) => (
                                    <div key={String(term)} className="flex items-center justify-between py-2.5">
                                        <dt className="text-slate-500">{String(term)}</dt>
                                        <dd className={`font-semibold ${ok ? 'text-emerald-700' : 'text-amber-700'}`}>{String(value)}</dd>
                                    </div>
                                ))}
                            </dl>

                            <div className="mt-4 flex flex-col gap-2">
                                <a href="#account-security" className={`${ghostButton} justify-center`}>
                                    <ShieldCheck className="h-4 w-4" />{t('profile.changePassword')}
                                </a>
                            </div>
                        </div>
                    </Section>
                </div>
            </div>

            {/* ===== MANAGE ACCOUNT — every link is a nav_links row ===== */}
            <section aria-labelledby="manage-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                    <h2 id="manage-heading" className="text-base font-bold text-slate-900">{t('profile.manageTitle')}</h2>
                    <p className="mt-0.5 text-xs text-slate-500">{t('profile.manageIntro')}</p>
                </div>
                <div className="space-y-6 p-5 sm:p-6">
                    {Object.entries(
                        (structure.nav_links.member ?? []).reduce<Record<string, StructureNavLink[]>>((groups, link) => {
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

            {/* ===== STICKY SAVE BAR =====
                Sticky rather than fixed: inside the member shell a fixed bar
                spans the whole viewport and slides under the sidebar, and the
                page cannot know how wide that sidebar currently is. */}
            {dirty && (
                <>
                    <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
                            <p className="flex items-center gap-2 text-xs font-semibold text-slate-700 sm:text-sm">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" aria-hidden="true" />
                                {t('common.unsavedChanges')}
                            </p>
                            <div className="flex gap-2">
                                <button type="button" onClick={discard} disabled={saving} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-60">
                                    {t('common.discard')}
                                </button>
                                <button type="button" onClick={() => void commit()} disabled={saving} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-sm hover:bg-amber-300 disabled:opacity-60">
                                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                    {saving ? t('common.saving') : t('common.saveChanges')}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Address book                                                        */
/* ------------------------------------------------------------------ */

const emptyAddress: AddressInput = {
    label: '',
    recipient: '',
    line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
};

function AddressBook({ profile, structure, onChanged, onError }: {
    profile: MemberProfile;
    structure: Structure;
    onChanged: (profile: MemberProfile) => void;
    onError: (message: string) => void;
}) {
    const { t } = useTranslation();
    const [editing, setEditing] = useState<number | 'new' | null>(null);
    const [form, setForm] = useState<AddressInput>(() => ({ ...emptyAddress, label: t('address.home') }));
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});

    const regions: StructureRegion[] = (form.country && structure.regions[form.country]) || [];

    function open(id: number | 'new') {
        setEditing(id);
        setErrors({});

        if (id === 'new') {
            setForm({ ...emptyAddress, label: t('address.home') });
            return;
        }

        const existing = profile.addresses.find((a) => a.id === id);

        if (existing) {
            setForm({
                label: existing.label,
                recipient: existing.recipient,
                line1: existing.line1,
                line2: existing.line2 ?? '',
                city: existing.city,
                state: existing.state ?? '',
                postal_code: existing.postal_code ?? '',
                country: existing.country,
                phone: existing.phone ?? '',
            });
        }
    }

    async function run(action: () => Promise<MemberProfile>, closeAfter = true) {
        setBusy(true);
        setErrors({});

        try {
            onChanged(await action());
            if (closeAfter) setEditing(null);
        } catch (caught) {
            if (caught instanceof ApiError) {
                setErrors(caught.errors);
            }
            onError(caught instanceof Error ? caught.message : t('address.saveFailed'));
        } finally {
            setBusy(false);
        }
    }

    const err = (name: string) => errors[name]?.[0];

    return (
        <Section
            id="addresses"
            title={t('address.bookTitle')}
            description={t('address.bookIntro')}
            aside={
                <button type="button" onClick={() => open('new')} className={ghostButton}>
                    <Plus className="h-4 w-4" />{t('address.addNew')}
                </button>
            }
        >
            <div className="space-y-3 p-5 sm:p-6">
                {profile.addresses.length === 0 && editing !== 'new' && (
                    <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                        {t('address.empty')}
                    </p>
                )}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {profile.addresses.map((address) => (
                        <article key={address.id} className="rounded-xl border border-slate-200 p-4">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900">{address.label}</h3>
                                {address.is_default_shipping && (
                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{t('address.defaultShipping')}</span>
                                )}
                                {address.is_default_billing && (
                                    <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">{t('address.defaultBilling')}</span>
                                )}
                            </div>
                            <address className="text-xs not-italic leading-relaxed text-slate-600">
                                {address.recipient}<br />
                                {address.line1}{address.line2 ? <><br />{address.line2}</> : null}<br />
                                {[address.city, address.state_name, address.postal_code].filter(Boolean).join(', ')}<br />
                                {address.country_name}
                                {address.phone ? <><br />{address.phone}</> : null}
                            </address>
                            <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                                <button type="button" onClick={() => open(address.id)} className="text-xs font-semibold text-slate-700 hover:text-amber-700">{t('common.edit')}</button>
                                {!address.is_default_shipping && (
                                    <button type="button" disabled={busy} onClick={() => void run(() => memberApi.makeAddressDefault(address.id, 'shipping'), false)} className="text-xs font-semibold text-slate-700 hover:text-amber-700 disabled:opacity-60">
                                        {t('address.setDefault')}
                                    </button>
                                )}
                                <button type="button" disabled={busy} onClick={() => void run(() => memberApi.deleteAddress(address.id), false)} className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-60">
                                    {t('common.delete')}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {editing !== null && (
                    <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                        <h3 className="text-sm font-bold text-slate-900">{editing === 'new' ? t('address.new') : t('address.edit')}</h3>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Field label={t('address.label')} error={err('label')}>
                                <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inputClass} />
                            </Field>
                            <Field label={t('address.recipient')} error={err('recipient')}>
                                <input type="text" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} className={inputClass} />
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label={t('address.line1')} error={err('line1')}>
                                    <input type="text" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className={inputClass} />
                                </Field>
                            </div>
                            <div className="sm:col-span-2">
                                <Field label={t('address.line2')}>
                                    <input type="text" value={form.line2 ?? ''} onChange={(e) => setForm({ ...form, line2: e.target.value })} className={inputClass} />
                                </Field>
                            </div>
                            <Field label={t('address.country')} error={err('country')}>
                                <select
                                    value={form.country}
                                    onChange={(e) => setForm({ ...form, country: e.target.value, state: '' })}
                                    className={inputClass}
                                >
                                    <option value="">{t('address.selectCountry')}</option>
                                    {structure.countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                                </select>
                            </Field>
                            <Field label={t('address.stateOrProvince')} error={err('state')}>
                                {regions.length > 0 ? (
                                    <select value={form.state ?? ''} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass}>
                                        <option value="">{t('address.select')}</option>
                                        {regions.map((r) => <option key={r.code} value={r.code}>{r.name}</option>)}
                                    </select>
                                ) : (
                                    <input type="text" value={form.state ?? ''} disabled={!form.country} onChange={(e) => setForm({ ...form, state: e.target.value })} className={`${inputClass} disabled:bg-slate-100`} />
                                )}
                            </Field>
                            <Field label={t('address.city')} error={err('city')}>
                                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
                            </Field>
                            <Field label={t('address.postalCode')} error={err('postal_code')}>
                                <input type="text" value={form.postal_code ?? ''} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className={inputClass} />
                            </Field>
                            <Field label={t('address.phone')} error={err('phone')}>
                                <input type="tel" value={form.phone ?? ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                            </Field>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setEditing(null)} disabled={busy} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-60">
                                {t('common.cancel')}
                            </button>
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => void run(() => (editing === 'new'
                                    ? memberApi.addAddress(form)
                                    : memberApi.updateAddress(editing as number, form)))}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-60"
                            >
                                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                {editing === 'new' ? t('address.add') : t('address.save')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
}
