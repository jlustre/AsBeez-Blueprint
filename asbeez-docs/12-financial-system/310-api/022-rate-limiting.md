# Rate Limiting

> **Document:** 12-financial-system/310-api/022-rate-limiting.md

---

## Purpose

Rate limiting protects financial APIs, providers, data stores, and users from abuse, accidental overload, denial of service, duplicate retries, and unsafe automation.

## Policy Dimensions

Apply limits by actor, client, endpoint, operation, resource, entity/country, provider, IP/device risk context where permitted, concurrency, request cost, and financial sensitivity. Commands that can create value or liability receive stricter quotas and concurrency limits than read operations.

## Rules

Return stable rate-limit error, retry-after, limit, remaining, and reset metadata without exposing enforcement internals. Do not retry effectful commands blindly after throttling; reuse idempotency keys. Emergency or operational bypass requires time-bound authorization, monitoring, and audit.

## Capacity

Coordinate API limits with provider limits, queue backpressure, reconciliation/close peaks, payout batches, reports, webhooks, and disaster recovery. Rate limiting must fail closed for unsafe financial effects and degrade reads transparently where possible.

## Related Documents

- [000-index.md](000-index.md)
- [003-authorization.md](003-authorization.md)
- [005-idempotency.md](005-idempotency.md)
- [007-error-handling.md](007-error-handling.md)
