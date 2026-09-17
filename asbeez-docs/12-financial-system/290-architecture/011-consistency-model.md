# Consistency Model

> **Document:** 12-financial-system/290-architecture/011-consistency-model.md

---

## Purpose

Consistency rules define where AsBeez requires atomic strong consistency and where eventual consistency is acceptable with freshness, reconciliation, and user-visible state.

## Strong Consistency

Journal posting, aggregate invariants, idempotency, wallet reservation/debit, period state, approval state, account mapping, and critical authorization use transactional consistency.

## Eventual Consistency

Dashboards, statements, analytics, notifications, search, forecasts, and non-authoritative projections may update asynchronously but disclose freshness and rebuild/reconciliation status.

## Rules

No eventual projection may authorize a financial effect or replace ledger/subledger truth. Uncertainty is represented as pending/unknown/exception, not silently treated as success.

## Related Documents

- [000-index.md](000-index.md)
- [003-cqrs-architecture.md](003-cqrs-architecture.md)
- [006-financial-orchestration.md](006-financial-orchestration.md)
- [010-concurrency-control.md](010-concurrency-control.md)
