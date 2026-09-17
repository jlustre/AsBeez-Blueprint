# Event Sourcing

> **Document:** 12-financial-system/290-architecture/004-event-sourcing.md

---

## Purpose

Event sourcing is used selectively for financial and operational lifecycles where immutable history, replay, audit, and derived projections provide real value. It is not a license to replace the General Ledger with an unverified event stream.

## Rules

Events are facts with schema/version, aggregate, source, actor/system, time, currency/unit, entity/country, policy, correlation, causation, and idempotency. Events are append-only. Projections rebuild deterministically and reconcile to posted ledger/control totals.

## Suitable Uses

Payments, refunds, disputes, wallets, payouts, rewards, reserves, reconciliation, approvals, and risk cases. Posted journals remain the accounting authority; event history supports lineage and derived views.

## Related Documents

- [000-index.md](000-index.md)
- [003-cqrs-architecture.md](003-cqrs-architecture.md)
- [008-outbox-pattern.md](008-outbox-pattern.md)
- [009-idempotency.md](009-idempotency.md)
