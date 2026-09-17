# Error Handling

> **Document:** 12-financial-system/310-api/007-error-handling.md

---

## Purpose

Financial API errors are deterministic, customer-safe, actionable, correlated, and explicit about whether an operation was rejected, pending, failed, or unknown.

## Error Envelope

Return HTTP status, stable error code, title, safe detail, correlation ID, request ID, retryability, retry-after where applicable, field violations, and operation/resource reference. Internal stack traces, secrets, provider credentials, and sensitive fraud/compliance signals are excluded.

## Categories

Authentication, authorization, validation, conflict, duplicate/idempotency, rate limit, unavailable, timeout/unknown, provider, compliance hold, period lock, insufficient balance, not found, and internal control failure.

## Financial Rules

A timeout never means financial failure or success. Clients query operation status or await reconciliation. Validation failures create no financial effect; partial workflows return explicit status and compensation/reconciliation references. All material errors are observable and audit-correlated.

## Related Documents

- [000-index.md](000-index.md)
- [002-authentication.md](002-authentication.md)
- [005-idempotency.md](005-idempotency.md)
- [021-webhooks.md](021-webhooks.md)
