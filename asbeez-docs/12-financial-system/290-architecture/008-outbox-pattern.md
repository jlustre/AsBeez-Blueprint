# Outbox Pattern

> **Document:** 12-financial-system/290-architecture/008-outbox-pattern.md

---

## Purpose

The outbox pattern makes aggregate changes and event publication durable and recoverable without losing or duplicating financial facts.

## Rules

Within one transaction, persist aggregate change, outbox event, version, idempotency, and publication status. A dispatcher publishes safely with retry, backoff, deduplication, ordering where required, dead-letter handling, and observability. Consumers remain idempotent.

## Financial Use

Use for journal posted, payment captured, refund, payout, settlement, reward, tax, reserve, reconciliation, close, and audit events. Outbox delivery does not prove downstream processing or provider success.

## Monitoring

Track pending, published, retried, dead-lettered, duplicate, delayed, and failed events with aggregate, event, consumer, lag, and reconciliation evidence.

## Related Documents

- [000-index.md](000-index.md)
- [003-cqrs-architecture.md](003-cqrs-architecture.md)
- [007-saga-patterns.md](007-saga-patterns.md)
- [009-idempotency.md](009-idempotency.md)
