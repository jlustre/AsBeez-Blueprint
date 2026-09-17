# Event Versioning

> **Document:** 12-financial-system/320-events/019-event-versioning.md

---

## Purpose

Event versioning preserves producer/consumer compatibility while allowing financial schemas, policies, providers, countries, and workflows to evolve without rewriting history.

## Rules

Every event declares type and schema version. Additive optional fields are preferred; breaking changes create a new version/type or a versioned adapter. Original payloads and versions remain immutable. Upcasters transform old facts for consumers without altering evidence.

## Financial Compatibility

Never reinterpret historical amount, currency, account, tax, FX, provider status, period, entity, country, or recognition meaning under a new schema. Consumers validate version, required fields, policy, and source context before processing.

## Governance

Schema owners publish changelog, compatibility matrix, migration/upcaster, deprecation window, replay impact, contract tests, consumer inventory, security/privacy review, and rollback plan. Version changes are auditable and approved.

## Related Documents

- [000-index.md](000-index.md)
- [002-event-contracts.md](002-event-contracts.md)
- [020-event-replay.md](020-event-replay.md)
- [../290-architecture/004-event-sourcing.md](../290-architecture/004-event-sourcing.md)
