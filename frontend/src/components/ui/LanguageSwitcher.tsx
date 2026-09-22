import { Globe2 } from 'lucide-react';

import { SUPPORTED_LOCALES, useTranslation } from '../../i18n';

/**
 * Language chooser.
 *
 * Each option is labelled in its own language: someone who cannot read the
 * current language cannot read the word "Spanish" either.
 */
export function LanguageSwitcher({ className = '', compact = false }: {
    className?: string;
    compact?: boolean;
}) {
    const { locale, setLocale, t } = useTranslation();

    return (
        <label className={`relative inline-flex items-center ${className}`}>
            <span className="sr-only">{t('common.chooseLanguage')}</span>
            <Globe2 className="pointer-events-none absolute left-2 h-4 w-4 opacity-70" aria-hidden="true" />
            <select
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
                className={`appearance-none rounded-lg bg-transparent py-1 pl-7 pr-6 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-honey ${compact ? 'text-xs' : ''}`}
            >
                {SUPPORTED_LOCALES.map((option) => (
                    // `lang` so a screen reader pronounces each name correctly.
                    <option key={option.code} value={option.code} lang={option.code} className="text-charcoal">
                        {option.native}
                    </option>
                ))}
            </select>
        </label>
    );
}
