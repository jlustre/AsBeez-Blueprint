# Idempotency

> **Document:** 12-financial-system/290-architecture/009-idempotency.md

---

## Purpose

Idempotency ensures retries, duplicate callbacks, repeated commands, event replay, and provider uncertainty do not create duplicate financial effects.

## Required Key

Key scope, operation, actor/client, source reference, payload hash, first result, status, timestamps, expiry, and conflict behavior.

## Rules

Payment capture, refund, payout, transfer, journal posting, wallet movement, reward conversion, settlement, tax assessment, reserve release, reconciliation resolution, and event handling require idempotency. Reusing a key for a different payload is a conflict; unknown outcome is reconciled before retry.

## Retention

Idempotency records retain original request/result, payload hash, status, timestamps, actor/client, source reference, and conflict outcome for the applicable financial, dispute, audit, and provider period.

## Related Documents

- [000-index.md](000-index.md)
- [006-financial-orchestration.md](006-financial-orchestration.md)
- [008-outbox-pattern.md](008-outbox-pattern.md)
- [010-concurrency-control.md](010-concurrency-control.md)
