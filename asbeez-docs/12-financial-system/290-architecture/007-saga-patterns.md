# Saga Patterns

> **Document:** 12-financial-system/290-architecture/007-saga-patterns.md

---

## Purpose

Sagas coordinate long-running financial workflows across bounded contexts and external providers without distributed database transactions.

## Saga Requirements

State, step, command/event, timeout, retry, idempotency, compensation, owner, correlation, and terminal outcome are persisted. Examples include payment/refund, settlement/payout, dispute, tax/remittance, reserve release, and reconciliation resolution.

## Rules

Compensation creates new business facts; it does not undo or delete completed history. Sagas distinguish pending, uncertain, failed, compensated, and completed. An uncertain provider step pauses or reconciles before a new financial effect.

## Related Documents

- [000-index.md](000-index.md)
- [006-financial-orchestration.md](006-financial-orchestration.md)
- [008-outbox-pattern.md](008-outbox-pattern.md)
- [010-concurrency-control.md](010-concurrency-control.md)
