# Idempotency

> **Document:** 12-financial-system/310-api/005-idempotency.md

---

## Purpose

API idempotency prevents retries, duplicate submissions, network ambiguity, and provider callbacks from creating duplicate financial effects.

## Header and Scope

Effectful commands require an idempotency key scoped to actor/client, endpoint, operation, resource, entity/country, and applicable financial period. The server stores payload hash, first result, status, timestamps, and response reference.

## Rules

The same key and same payload returns the original result or current safe status. Reuse with a different payload is a conflict. A timeout or unknown provider result returns unknown/pending and requires query or reconciliation before a new effect. Idempotency records are retained for the applicable financial, dispute, provider, and audit period.

## Required Operations

Payment capture, refund, payout, wallet movement, reserve change, journal posting request, tax assessment, reconciliation resolution, and webhook processing use idempotency.

## Related Documents

- [000-index.md](000-index.md)
- [004-request-response-standards.md](004-request-response-standards.md)
- [007-error-handling.md](007-error-handling.md)
- [../290-architecture/009-idempotency.md](../290-architecture/009-idempotency.md)
