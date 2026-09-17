# Idempotency Testing

> **Document:** 12-financial-system/360-testing/012-idempotency-testing.md

---

## Purpose

Idempotency tests prove that retries, duplicate commands, callbacks, events, files, and replay do not create duplicate financial effects.

## Required Cases

Repeat the same request, retry after timeout, duplicate provider callback, same key/different payload, concurrent same key, lost response, outbox redelivery, event replay, batch rerun, partial completion, and expired/retained key scenarios across payment, refund, payout, wallet, reserve, tax, reconciliation, and journal workflows.

## Assertions

Same key/same payload returns the original result or safe current status; same key/different payload conflicts; unknown provider state is queried/reconciled before a new effect; and one monetary effect maps to one authoritative source/idempotency scope.

## Related Documents

- [000-index.md](000-index.md)
- [007-api-testing.md](007-api-testing.md)
- [013-concurrency-testing.md](013-concurrency-testing.md)
- [../290-architecture/009-idempotency.md](../290-architecture/009-idempotency.md)
