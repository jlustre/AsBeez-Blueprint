# Event Contracts

> **Document:** 12-financial-system/320-events/002-event-contracts.md

---

## Purpose

Event contracts define the stable envelope, payload semantics, compatibility rules, ownership, publication, consumption, and evidence requirements for financial events.

## Required Envelope

`event_id`, `event_type`, `schema_version`, `aggregate_type`, `aggregate_id`, `aggregate_sequence`, `occurred_at`, `recorded_at`, `source_context`, `actor`, `entity_id`, `country_code`, `currency`, `correlation_id`, `causation_id`, `idempotency_key`, `payload`, and `security/retention metadata`.

## Payload Rules

Use stable identifiers, integer minor-unit amounts plus ISO currency, explicit status, policy version, source references, and effective timestamps. Never publish secrets, payment credentials, unnecessary personal data, unrestricted risk signals, or mutable balance assertions without source/version context.

## Ownership and Delivery

The context owning the aggregate owns event meaning and schema. Producers publish through durable outbox; consumers validate version, authorization boundary, scope, and idempotency. Consumers cannot alter original events.

## Related Documents

- [000-index.md](000-index.md)
- [001-event-overview.md](001-event-overview.md)
- [019-event-versioning.md](019-event-versioning.md)
- [../300-data-model/018-event-store-schema.md](../300-data-model/018-event-store-schema.md)
