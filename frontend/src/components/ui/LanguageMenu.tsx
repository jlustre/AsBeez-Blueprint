import { Check, ChevronDown, Globe2 } from 'lucide-react';

import { SUPPORTED_LOCALES, useTranslation } from '../../i18n';
import { handleMenuKeys } from '../../lib/menu';
import { MenuCloseButton } from './MenuCloseButton';

/**
 * Language chooser for the dashboard top bars.
 *
 * A menu rather than the native `<select>` of LanguageSwitcher: it sits beside
 * the notification and account dropdowns, which are menus, and a bare select
 * among them looks like a different control doing a different kind of thing.
 * The select is still right where it stands alone — the home header, the auth
 * screens — so both exist.
 *
 * Controlled rather than self-contained, so it joins the shell's one-menu-at-
 * a-time state: opening this closes notifications, and the shell's existing
 * outside-click and Escape handling covers it for free.
 *
 * Each option is labelled in its own language, because someone who cannot read
 * the current language cannot read the word "Spanish" either.
 */
export function LanguageMenu({ open, onToggle, onClose, buttonClassName = '', closeTone }: {
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    /** Whole class set for the trigger; the shells' palettes disagree. */
    buttonClassName?: string;
    closeTone?: string;
}) {
    const { locale, setLocale, t } = useTranslation();
    const active = SUPPORTED_LOCALES.find((option) => option.code === locale);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={t('common.chooseLanguage')}
                className={buttonClassName}
            >
                <Globe2 className="h-5 w-5" />
                {/* The code, not the name: it has to fit beside the icon. */}
                <span className="hidden text-xs font-bold uppercase sm:inline">{active?.code ?? locale}</span>
                <ChevronDown className={`hidden h-4 w-4 transition-transform sm:block ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div
                    role="menu"
                    onKeyDown={handleMenuKeys}
                    className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-gray-300 bg-white py-2 shadow-2xl ring-1 ring-charcoal/10"
                >
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 pb-2 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{t('common.language')}</span>
                        <MenuCloseButton onClose={onClose} tone={closeTone} />
                    </div>

                    {SUPPORTED_LOCALES.map((option) => {
                        const current = option.code === locale;

                        return (
                            <button
                                key={option.code}
                                type="button"
                                role="menuitem"
                                lang={option.code}
                                aria-current={current ? 'true' : undefined}
                                onClick={() => { setLocale(option.code); onClose(); }}
                                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-honey-cream/60 ${current ? 'font-bold text-charcoal' : 'text-gray-700'}`}
                            >
                                <span className="min-w-0">
                                    <span className="block truncate">{option.native}</span>
                                    <span className="block text-[11px] uppercase text-gray-400">{option.code}</span>
                                </span>
                                {current && <Check className="h-4 w-4 shrink-0 text-honey-amber" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
