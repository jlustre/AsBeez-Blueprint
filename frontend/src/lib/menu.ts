import type { KeyboardEvent } from 'react';

/**
 * Roving keyboard navigation for a dropdown panel.
 *
 * Attach to the element carrying `role="menu"`; it moves focus between the
 * descendants marked `role="menuitem"`. A panel that advertises menu semantics
 * to assistive tech is expected to support these keys, so every dropdown in the
 * dashboards shares this one implementation rather than each rolling its own.
 */
export function handleMenuKeys(event: KeyboardEvent<HTMLElement>): void {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'));

    if (items.length === 0) {
        return;
    }

    const current = items.indexOf(document.activeElement as HTMLElement);
    let next: number;

    switch (event.key) {
        case 'ArrowDown':
            next = current < 0 ? 0 : (current + 1) % items.length;
            break;
        case 'ArrowUp':
            next = current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length;
            break;
        case 'Home':
            next = 0;
            break;
        case 'End':
            next = items.length - 1;
            break;
        default:
            return;
    }

    event.preventDefault();
    items[next].focus();
}
