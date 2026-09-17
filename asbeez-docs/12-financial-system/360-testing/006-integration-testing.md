# Integration Testing

> **Document:** 12-financial-system/360-testing/006-integration-testing.md

---

## Purpose

Integration tests verify collaboration among bounded contexts, databases, queues, outbox, providers, banks, tax/FX services, reporting, risk, identity, and warehouse pipelines.

## Required Cases

Test happy path, timeout, retry, duplicate callback, provider unknown, malformed response, schema drift, rate limit, credential failure, partial completion, compensation, replay, reconciliation, country/entity/currency mismatch, and data residency behavior.

## Rules

Use provider sandboxes, simulators, deterministic fixtures, fault injection, and isolated test accounts. Assert stored evidence, events, idempotency, workflow state, audit, and ledger/reconciliation outcomes, not only HTTP success. No test may send real money or sensitive production data.

## Related Documents

- [000-index.md](000-index.md)
- [008-event-testing.md](008-event-testing.md)
- [009-contract-testing.md](009-contract-testing.md)
- [../340-integrations/001-overview.md](../340-integrations/001-overview.md)
