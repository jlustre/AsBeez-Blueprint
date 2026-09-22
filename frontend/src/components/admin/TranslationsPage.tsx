import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, Languages, Loader2, Save } from 'lucide-react';

import { SUPPORTED_LOCALES, useTranslation } from '../../i18n';
import { adminApi, type TranslationRegistry, type TranslationRow } from '../../lib/admin';

const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400';

const ghostButton =
    'inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60';

function localeName(code: string): string {
    return SUPPORTED_LOCALES.find((l) => l.code === code)?.native ?? code;
}

/**
 * Where an administrator translates the curated registries.
 *
 * Source text sits beside each field so a translator never has to guess what
 * they are translating, and clearing a field is a first-class action: it drops
 * the row and falls back to the source language.
 */
export function TranslationsPage() {
    const { t } = useTranslation();

    const [registries, setRegistries] = useState<TranslationRegistry[]>([]);
    const [locales, setLocales] = useState<string[]>([]);
    const [locale, setLocale] = useState('');
    const [open, setOpen] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadRegistries = useCallback(async () => {
        setError('');

        try {
            const data = await adminApi.registries();
            setRegistries(data.registries);
            setLocales(data.locales);
            setLocale((current) => current || data.locales[0] || '');
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : t('admin.registriesLoadFailed'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void loadRegistries(); }, [loadRegistries]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">{t('common.loading')}</span>
            </div>
        );
    }

    if (error && registries.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-8">
                <div className="max-w-sm space-y-3 text-center">
                    <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
                    <p className="text-sm font-semibold text-slate-900">{error}</p>
                    <button onClick={() => window.location.reload()} className={ghostButton}>{t('common.tryAgain')}</button>
                </div>
            </div>
        );
    }

    if (locales.length === 0) {
        return (
            <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                    <Languages className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-2 text-sm font-semibold text-slate-700">{t('admin.onlyOneLocale')}</p>
                    <p className="mt-1 text-xs text-slate-500">{t('admin.onlyOneLocaleHint')}</p>
                </div>
            </main>
        );
    }

    if (open) {
        return (
            <RegistryEditor
                registry={open}
                locale={locale}
                onBack={() => { setOpen(null); void loadRegistries(); }}
            />
        );
    }

    return (
        <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
                        <Languages className="h-6 w-6 text-amber-500" />{t('admin.translations')}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {t('admin.translationsIntro')}
                    </p>
                </div>

                <label className="shrink-0">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">{t('admin.translatingInto')}</span>
                    <select value={locale} onChange={(e) => setLocale(e.target.value)} className={inputClass}>
                        {locales.map((code) => (
                            <option key={code} value={code}>{localeName(code)}</option>
                        ))}
                    </select>
                </label>
            </header>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {registries.map((registry) => {
                    const progress = registry.progress[locale] ?? { done: 0, percent: 0 };
                    const complete = progress.percent === 100;

                    return (
                        <button
                            key={registry.slug}
                            onClick={() => setOpen(registry.slug)}
                            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50/30"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h2 className="text-sm font-bold text-slate-900">{registry.label}</h2>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {t('admin.registryCounts', { rows: registry.rows, fields: registry.translatable })}
                                    </p>
                                </div>
                                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${complete ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                                    {progress.percent}%
                                </span>
                            </div>

                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className={`h-full rounded-full transition-all ${complete ? 'bg-emerald-500' : 'bg-amber-400'}`}
                                    style={{ width: `${progress.percent}%` }}
                                />
                            </div>

                            <p className="mt-2 text-[11px] text-slate-500">
                                {t('admin.registryProgress', { done: progress.done, total: registry.translatable, locale: localeName(locale) })}
                            </p>
                        </button>
                    );
                })}
            </div>
        </main>
    );
}

function RegistryEditor({ registry, locale, onBack }: {
    registry: string;
    locale: string;
    onBack: () => void;
}) {
    const { t } = useTranslation();

    const [label, setLabel] = useState(registry);
    const [rows, setRows] = useState<TranslationRow[]>([]);
    const [draft, setDraft] = useState<Record<number, Record<string, string>>>({});
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [savedId, setSavedId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [onlyUntranslated, setOnlyUntranslated] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError('');

            try {
                const data = await adminApi.rows(registry, locale);

                if (cancelled) {
                    return;
                }

                setLabel(data.registry.label);
                setRows(data.rows);
                setDraft(Object.fromEntries(
                    data.rows.map((row) => [row.id, Object.fromEntries(row.fields.map((f) => [f.field, f.value]))]),
                ));
            } catch (caught) {
                if (!cancelled) {
                    setError(caught instanceof Error ? caught.message : t('admin.rowsLoadFailed'));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => { cancelled = true; };
    }, [registry, locale]);

    const visible = useMemo(() => {
        const needle = filter.trim().toLowerCase();

        return rows.filter((row) => {
            if (onlyUntranslated && row.fields.every((f) => (draft[row.id]?.[f.field] ?? '').trim() !== '')) {
                return false;
            }

            if (!needle) {
                return true;
            }

            return row.identifier.toLowerCase().includes(needle)
                || row.fields.some((f) => f.source.toLowerCase().includes(needle));
        });
    }, [rows, filter, onlyUntranslated, draft]);

    function isDirty(row: TranslationRow): boolean {
        return row.fields.some((f) => (draft[row.id]?.[f.field] ?? '') !== f.value);
    }

    async function save(row: TranslationRow) {
        setSavingId(row.id);
        setError('');

        try {
            const { row: saved } = await adminApi.save(registry, row.id, locale, draft[row.id] ?? {});

            // Re-baseline so the row stops reporting itself as dirty.
            setRows((current) => current.map((r) => (r.id === row.id
                ? { ...r, fields: r.fields.map((f) => ({ ...f, value: saved.values[f.field] ?? '' })) }
                : r)));

            setSavedId(row.id);
            window.setTimeout(() => setSavedId((id) => (id === row.id ? null : id)), 1800);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : t('admin.rowSaveFailed'));
        } finally {
            setSavingId(null);
        }
    }

    const remaining = rows.filter((r) => r.fields.some((f) => (draft[r.id]?.[f.field] ?? '').trim() === '')).length;

    return (
        <main className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 sm:px-6">
            <header className="space-y-3">
                <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-700">
                    <ArrowLeft className="h-3.5 w-3.5" />{t('admin.allRegistries')}
                </button>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">{label}</h1>
                        <p className="mt-0.5 text-xs text-slate-500">
                            {t('admin.editorSubtitle', { locale: localeName(locale), count: remaining })}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            type="search"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder={t('common.search')}
                            className={`${inputClass} w-auto`}
                        />
                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <input
                                type="checkbox"
                                checked={onlyUntranslated}
                                onChange={(e) => setOnlyUntranslated(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                            />
                            {t('admin.untranslatedOnly')}
                        </label>
                    </div>
                </div>

                {error && (
                    <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                        <AlertCircle className="mt-px h-4 w-4 shrink-0" />{error}
                    </p>
                )}
            </header>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-slate-500">
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium">{t('common.loading')}</span>
                </div>
            ) : visible.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
                    {t('admin.noMatches')}
                </p>
            ) : (
                <div className="space-y-3">
                    {visible.map((row) => (
                        <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <code className="truncate rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                    {row.identifier}
                                </code>
                                <div className="flex shrink-0 items-center gap-2">
                                    {savedId === row.id && (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                                            <Check className="h-3.5 w-3.5" />{t('common.changesSaved')}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => void save(row)}
                                        disabled={!isDirty(row) || savingId === row.id}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {savingId === row.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                        {savingId === row.id ? t('common.saving') : t('common.save')}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {row.fields.map((field) => (
                                    <div key={field.field} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                {t('admin.fieldSource', { field: field.field })}
                                            </label>
                                            {/* Read-only so a translator always sees what they are translating. */}
                                            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{field.source}</p>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                {t('admin.fieldTarget', { field: field.field, locale: localeName(locale) })}
                                            </label>
                                            <input
                                                type="text"
                                                value={draft[row.id]?.[field.field] ?? ''}
                                                onChange={(e) => setDraft((current) => ({
                                                    ...current,
                                                    [row.id]: { ...current[row.id], [field.field]: e.target.value },
                                                }))}
                                                placeholder={field.source}
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="mt-2 text-[11px] text-slate-400">
                                {t('admin.blankFallsBack')}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}
