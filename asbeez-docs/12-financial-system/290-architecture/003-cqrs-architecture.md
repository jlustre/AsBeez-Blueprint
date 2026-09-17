# CQRS Architecture

> **Document:** 12-financial-system/290-architecture/003-cqrs-architecture.md

---

## Purpose

CQRS separates financial commands that validate and mutate authoritative aggregates from queries that read projections, reports, statements, analytics, and dashboards.

## Command Side

Commands validate authorization, policy, idempotency, currency, account, period, risk, tax, and invariants before persisting aggregate state and durable events. Examples include post journal, approve payout, assess tax, place hold, release reserve, issue refund, and resolve exception.

## Query Side

Read models serve wallets, statements, vendor/partner reports, trial balances, dashboards, reconciliation, risk, and management analytics. They are labeled with freshness, source version, period, currency, entity, country, and certification state.

## Rules

Queries never mutate financial truth. Projections rebuild from immutable source/events and reconcile to control totals before certification.

## Related Documents

- [000-index.md](000-index.md)
- [005-double-entry-ledger-architecture.md](005-double-entry-ledger-architecture.md)
- [008-outbox-pattern.md](008-outbox-pattern.md)
- [011-consistency-model.md](011-consistency-model.md)
