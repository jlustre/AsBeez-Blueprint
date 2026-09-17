# Distributed Tracing

> **Document:** 12-financial-system/350-observability/006-distributed-tracing.md

---

## Purpose

Distributed tracing follows a financial operation across API, bounded contexts, database, queues, outbox, providers, event consumers, projections, reconciliation, and reporting.

## Trace Requirements

Carry trace/span IDs, correlation/causation, operation, actor/service, aggregate/resource, entity/country/currency, provider, idempotency reference, event/journal/payment/payout source, status, timing, retry, and error attributes. Sample safely while retaining complete evidence for material incidents and controls.

## Rules

Traces must not contain secrets, full payment data, sensitive identity evidence, or unrestricted compliance/risk details. Trace success is technical evidence only; financial state is determined by authoritative records and reconciliation. Cross-region/provider traces preserve residency and access controls.

## Related Documents

- [000-index.md](000-index.md)
- [005-structured-logging.md](005-structured-logging.md)
- [007-correlation-ids.md](007-correlation-ids.md)
- [../290-architecture/006-financial-orchestration.md](../290-architecture/006-financial-orchestration.md)
