import { X } from 'lucide-react';

import { useTranslation } from '../../i18n';

/**
 * Dismiss control for a dropdown panel, shared by all three dashboards.
 *
 * Deliberately carries no `role="menuitem"`: it is panel chrome rather than a
 * choice, so arrow-key navigation skips it while Tab still reaches it.
 *
 * `tone` carries the host dashboard's palette. Passing a whole set of classes
 * rather than merging overrides keeps two competing utilities for the same
 * property out of the class list, where source order — not the call site —
 * would decide the winner.
 */
export function MenuCloseButton({
    onClose,
    tone = 'text-gray-400 hover:bg-gray-100 hover:text-charcoal focus:ring-honey',
}: {
    onClose: () => void;
    tone?: string;
}) {
    const { t } = useTranslation();

    return (
        <button
            type="button"
            onClick={onClose}
            aria-label={t('common.closeMenu')}
            className={`-mr-1 shrink-0 rounded-lg p-1 transition focus:outline-none focus:ring-2 ${tone}`}
        >
            <X className="h-4 w-4" />
        </button>
    );
}
