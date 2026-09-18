# API Standards

## Purpose

APIs provide stable, secure, versioned contracts for commands, queries, events, integrations, and user experiences.

## Request/Response

Require API version, authenticated actor context, authorization scope, correlation ID, idempotency for effects, schema validation, entity/country/currency context, and safe error envelope. Responses include resource/operation ID, status, timestamps, schema/source/freshness, pagination or links, and customer-safe details.

## Financial Rules

Use integer minor units plus ISO currency; server-side amount/tax/fee/account/allocation; explicit pending/failed/reversed/unknown states; no direct balance/journal/provider/account-mapping mutation; and audit/reconciliation references. Commands are idempotent, concurrency-aware, observable, and version-compatible.

## Security and Quality

Use TLS, secret-free URLs/logs, least privilege, rate limits, input/output validation, privacy masking, resource ownership, country/entity isolation, webhook verification, timeouts, retries, contract tests, deprecation, and backward compatibility.

## Related Documents

- [index.md](index.md)
- [002-naming-conventions.md](002-naming-conventions.md)
- [003-id-conventions.md](003-id-conventions.md)
- [../18-api/001-api-overview.md](../18-api/001-api-overview.md)
