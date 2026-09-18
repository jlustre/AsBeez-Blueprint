# Event-Driven Architecture

## Purpose

Event-driven architecture communicates accepted facts across contexts, integrations, projections, workflows, notifications, audit, and reconciliation without creating hidden coupling.

## Event Rules

Events are immutable, versioned, scoped, correlated, causally linked, idempotently published/consumed, and delivered through durable outbox. Commands express intent; events express accepted facts; provider callbacks are evidence until mapped and reconciled.

## Reliability

Consumers tolerate at-least-once delivery, retries, duplicates, ordering gaps, schema evolution, poison events, and dead letters. Replay is scoped, approved, deterministic, and reconciled. Events must not contain secrets or unnecessary sensitive data.

## Financial Safety

An event does not independently authorize a journal, wallet movement, payout, reserve release, or report certification. Financial effects re-enter domain validation, authorization, idempotency, ledger, and reconciliation controls.

## Change Control
Event type/schema ownership, compatibility, retention, security, consumer inventory, and migration impact are reviewed and approved before breaking changes.

## Related Documents

- [index.md](index.md)
- [004-bounded-contexts.md](004-bounded-contexts.md)
- [../12-financial-system/320-events/002-event-contracts.md](../12-financial-system/320-events/002-event-contracts.md)
- [../12-financial-system/290-architecture/008-outbox-pattern.md](../12-financial-system/290-architecture/008-outbox-pattern.md)

