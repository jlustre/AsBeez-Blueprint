# Event Overview

> **Document:** 12-financial-system/320-events/001-event-overview.md

---

## Purpose

Financial events communicate immutable domain and integration facts across AsBeez financial contexts, projections, workflows, audit, reconciliation, and approved external consumers.

## Event Categories

Domain events describe an accepted state change; integration events communicate a published contract; provider evidence records an external observation; commands request an action but are not events. Events do not replace the General Ledger or authorize a posting without command-side validation and accounting policy.

## Guarantees

Events are append-only, versioned, correlated, causally linked, idempotently published/consumed, scoped by entity/country/currency, and retained according to financial and legal policy. Delivery is at least once unless a stronger contract is explicitly documented.

## Operational States

Consumers expose pending, processed, duplicate, retried, dead-lettered, replayed, and reconciled status. A delivered event is not proof that a downstream financial effect completed.

## Related Documents

- [000-index.md](000-index.md)
- [002-event-contracts.md](002-event-contracts.md)
- [019-event-versioning.md](019-event-versioning.md)
- [020-event-replay.md](020-event-replay.md)
- [../290-architecture/004-event-sourcing.md](../290-architecture/004-event-sourcing.md)
