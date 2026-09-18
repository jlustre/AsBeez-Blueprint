# Mobile Experience

## Purpose

The mobile experience provides responsive, accessible, secure access to discovery, orders, member activity, vendor tasks, wallet/status views, support, notifications, and approved administrative workflows.

## Mobile Requirements

Support responsive layouts, touch targets, keyboard/screen readers where applicable, reduced motion, offline/poor-network handling, localization, time zones, secure storage, session expiry, deep links, push consent, and accessible error recovery.

## Financial Safety

Never infer financial success from a lost response, optimistic UI, push notification, or local cache. Show operation ID and pending/processing/failed/unknown state; allow safe status refresh using the same idempotency context. Sensitive amounts, payment data, identity, risk, and compliance data are masked and protected.

## Notifications and Recovery

Push/email/in-app notifications are projections, not proof of payment, payout, refund, or ledger posting. Offline commands queue only where explicitly supported; replay and duplicate submission are prevented; recovery returns the authoritative server state and support path.

## Related Documents

- [index.md](index.md)
- [002-design-system.md](002-design-system.md)
- [003-customer-website.md](003-customer-website.md)
- [../18-api/001-api-overview.md](../18-api/001-api-overview.md)
