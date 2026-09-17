# Correlation Ids

> **Document:** 12-financial-system/350-observability/007-correlation-ids.md

---

## Purpose

Correlation IDs connect a user/API request, command, saga, provider call, callback, event, journal source, reconciliation run, approval, report, and incident without exposing sensitive identifiers.

## Rules

Use a unique immutable correlation ID per business operation, causation ID for direct parent action, trace ID for technical flow, and idempotency key reference for duplicate protection. Propagate IDs across queues, outbox, webhooks, files, providers, and support/audit records.

## Controls

Validate format, scope, injection safety, and authorization before propagation. Do not use correlation IDs as secrets or expose them beyond need. Preserve mappings long enough for financial, dispute, audit, security, and incident investigation; retain hashed/reference forms where appropriate.

## Related Documents

- [000-index.md](000-index.md)
- [005-structured-logging.md](005-structured-logging.md)
- [006-distributed-tracing.md](006-distributed-tracing.md)
- [../290-architecture/009-idempotency.md](../290-architecture/009-idempotency.md)
