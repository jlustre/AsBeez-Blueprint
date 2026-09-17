# API Versioning

> **Document:** 12-financial-system/310-api/023-api-versioning.md

---

## Purpose

API versioning preserves compatible financial contracts while allowing schema, policy, provider, security, and domain evolution.

## Version Rules

Version public paths or media types explicitly. Version request/response schemas, error codes, webhook event schemas, idempotency behavior, amount/currency semantics, authorization scopes, and pagination contracts where behavior changes. Additive fields remain optional and documented; destructive changes require a new version.

## Financial Compatibility

Never reinterpret a historical amount, currency, journal, tax decision, provider outcome, event, or report source under a new schema. Preserve original version references and use adapters/upcasters for old records. Version policy and chart mappings effective at financial posting.

## Lifecycle

Publish changelog, migration guide, deprecation date, support window, compatibility tests, consumer impact, rollback plan, and audit/change approval. Retire only after legal, provider, client, reporting, reconciliation, and data-retention review.

## Related Documents

- [000-index.md](000-index.md)
- [004-request-response-standards.md](004-request-response-standards.md)
- [021-webhooks.md](021-webhooks.md)
- [../300-data-model/018-event-store-schema.md](../300-data-model/018-event-store-schema.md)
