# Event Store Schema

> **Document:** 12-financial-system/300-data-model/018-event-store-schema.md

---

## Purpose

The event store preserves immutable domain and integration facts used for lifecycle history, projections, workflow coordination, audit lineage, and controlled replay.

## Core Fields

`event_id`, `event_type`, `schema_version`, `aggregate_type`, `aggregate_id`, `sequence`, `payload`, `metadata`, `source_context`, `actor`, `occurred_at`, `recorded_at`, `entity_id`, `country_code`, `currency`, `correlation_id`, `causation_id`, `idempotency_key`, and `publication_status`.

## Rules

Events are append-only and immutable. Aggregate sequence is monotonic within its authority. Event schemas are versioned and upcast or transformed without changing original evidence. Events do not independently authorize ledger posting; approved commands and accounting rules do.

## Operations

Consumers track checkpoints, retries, dead letters, poison events, replay scope, projection version, and reconciliation result. Sensitive payloads use encryption, minimization, access control, and retention/legal-hold policy.

## Related Documents

- [000-index.md](000-index.md)
- [017-audit-schema.md](017-audit-schema.md)
- [019-read-models.md](019-read-models.md)
- [../290-architecture/004-event-sourcing.md](../290-architecture/004-event-sourcing.md)
