# Design System

## Purpose

The design system provides reusable visual, interaction, content, accessibility, responsive, and state patterns for consistent AsBeez experiences.

## Foundations

Define typography, color contrast, spacing, grid, breakpoints, icons, elevation, motion, focus, touch targets, localization, date/time, currency, number, and error presentation. Use semantic tokens so country, brand, status, and accessibility changes do not alter meaning.

## Technology Baseline

Use Tailwind CSS as the implementation layer for responsive layout, semantic tokens, states, focus, contrast, and reduced motion. Build shared React + TypeScript components for customer/member/vendor/partner experiences. Build Livewire components with Alpine.js for server-driven admin, support, operations, reconciliation, close, and configuration workflows.

## Components

Buttons, links, forms, selects, tables, cards, tabs, navigation, modals, alerts, notifications, progress, timelines, charts, statements, money/amount displays, status badges, confirmation, empty/loading/error/unknown states, and accessible data export.

## Financial Patterns

Always pair amount with currency; identify tax/fees and whether value is estimated or final; distinguish wallet money from RP/ABC/AHC; show pending/held/failed/reversed/unknown; prevent double submission; and provide source/freshness or reconciliation context for projections.

## Accessibility and Governance

Meet applicable accessibility requirements, keyboard/screen-reader semantics, focus management, reduced motion, readable errors, and sufficient contrast. Components are versioned, documented, tested, localized, and reviewed for privacy, legal, security, and financial accuracy.

## Related Documents

- [index.md](index.md)
- [001-ui-ux-overview.md](001-ui-ux-overview.md)
- [006-admin-portal.md](006-admin-portal.md)
- [../15-product-requirements/005-non-functional-requirements.md](../15-product-requirements/005-non-functional-requirements.md)
