# Request Response Standards

> **Document:** 12-financial-system/310-api/004-request-response-standards.md

---

## Purpose

All financial APIs use consistent envelopes, identifiers, amount representation, timestamps, status semantics, correlation, pagination, errors, and version metadata.

## Request Standards

Requests include API version, correlation ID, actor context from authentication, idempotency key for effectful commands, request timestamp, locale/country where relevant, and schema-valid JSON. Amounts use integer minor units plus ISO currency; clients cannot override server-calculated financial allocations.

## Response Standards

Responses include resource ID, status, timestamps, operation/correlation ID, schema version, entity/country/currency scope, source or freshness metadata, and links/actions when applicable. Commands return accepted workflow state when processing is asynchronous.

## Consistency and Privacy

Responses identify pending, stale, uncertified, provider-evidence, and unknown states. Mask personal, payment, tax, and destination data by default. Never expose internal account mappings, secrets, unrestricted risk signals, or sensitive audit details to unauthorized callers.

## Related Documents

- [000-index.md](000-index.md)
- [005-idempotency.md](005-idempotency.md)
- [006-pagination-filtering-and-sorting.md](006-pagination-filtering-and-sorting.md)
- [007-error-handling.md](007-error-handling.md)
