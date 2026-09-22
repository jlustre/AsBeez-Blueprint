import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import en from './messages/en.json';
import es from './messages/es.json';

/**
 * A small translation layer, deliberately not i18next.
 *
 * The app's needs are flat keys, `{{variable}}` interpolation and simple
 * plurals; i18next plus its React bindings would add roughly 40 KB to a bundle
 * that is already over budget. The call signature matches i18next's, so moving
 * to it later is a mechanical change rather than a rewrite.
 */

/** English is the source of truth: every other locale is typed against it. */
export type MessageKey = keyof typeof en;

type Messages = Partial<Record<MessageKey, string>>;

const bundles: Record<string, Messages> = { en, es };

export const FALLBACK_LOCALE = 'en';

const STORAGE_KEY = 'asbeez_locale';

export type LocaleMeta = { code: string; name: string; native: string; dir: 'ltr' | 'rtl' };

/**
 * Mirrors config/locales.php. Kept here as well so a language can be chosen on
 * the sign-in screen, before any API call has been made.
 */
export const SUPPORTED_LOCALES: LocaleMeta[] = [
    { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
    { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr' },
];

export function isSupported(locale: string | null | undefined): boolean {
    return typeof locale === 'string' && SUPPORTED_LOCALES.some((l) => l.code === locale);
}

/** Stored choice, then browser preference, then English. */
function detectLocale(): string {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);

        if (isSupported(stored)) {
            return stored as string;
        }
    } catch {
        // Storage blocked; fall through to the browser's preference.
    }

    for (const tag of navigator.languages ?? [navigator.language]) {
        const base = tag.toLowerCase().split('-')[0];

        if (isSupported(base)) {
            return base;
        }
    }

    return FALLBACK_LOCALE;
}

/** Replaces {{name}} placeholders. */
function interpolate(template: string, vars?: Record<string, string | number>): string {
    if (!vars) {
        return template;
    }

    return template.replace(/\{\{(\w+)\}\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match);
}

export type TranslateFn = (key: MessageKey, vars?: Record<string, string | number>) => string;

type I18nValue = {
    locale: string;
    dir: 'ltr' | 'rtl';
    setLocale: (locale: string) => void;
    t: TranslateFn;
};

const I18nContext = createContext<I18nValue | null>(null);

/** Read outside React (the API client needs it for request headers). */
let activeLocale = FALLBACK_LOCALE;

export function getActiveLocale(): string {
    return activeLocale;
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState(detectLocale);

    useEffect(() => {
        activeLocale = locale;

        // Screen readers and browser features (hyphenation, spellcheck,
        // translation offers) all key off the document language.
        document.documentElement.lang = locale;
        document.documentElement.dir = SUPPORTED_LOCALES.find((l) => l.code === locale)?.dir ?? 'ltr';
    }, [locale]);

    const setLocale = useCallback((next: string) => {
        if (!isSupported(next)) {
            return;
        }

        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // The choice still applies for this session.
        }

        setLocaleState(next);
    }, []);

    const t = useCallback<TranslateFn>((key, vars) => {
        // Falls back to English, then to the key itself — a missing string
        // shows a readable identifier rather than an empty element.
        const template = bundles[locale]?.[key] ?? bundles[FALLBACK_LOCALE][key] ?? key;

        return interpolate(template, vars);
    }, [locale]);

    const value = useMemo<I18nValue>(() => ({
        locale,
        dir: SUPPORTED_LOCALES.find((l) => l.code === locale)?.dir ?? 'ltr',
        setLocale,
        t,
    }), [locale, setLocale, t]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation(): I18nValue {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useTranslation must be used inside I18nProvider');
    }

    return context;
}

/**
 * Keys present in English but missing from another locale.
 *
 * Exported so a test can assert that no locale silently drifts; a missing key
 * is not an error at runtime, it just falls back, which is easy to miss.
 */
export function missingKeys(locale: string): MessageKey[] {
    const bundle = bundles[locale] ?? {};

    return (Object.keys(en) as MessageKey[]).filter((key) => !(key in bundle));
}
