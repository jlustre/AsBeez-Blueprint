# Event Replay

> **Document:** 12-financial-system/320-events/020-event-replay.md

---

## Purpose

Event replay rebuilds projections, reprocesses approved workflows, supports recovery, and investigates lineage without duplicating financial effects or changing original evidence.

## Replay Controls

Define event range, aggregate/scope, version/upcaster, consumer, snapshot, cutoff, actor, purpose, dry-run, output destination, idempotency, and reconciliation plan. Replay is isolated from live side effects unless explicitly approved and controlled.

## Rules

Posted journals are not recreated by replay. Rebuild ledger-derived projections from authoritative posted records; reprocess commands only with idempotency and compensation controls. Provider callbacks and external effects are not resent blindly; reconcile evidence first.

## Evidence

Record replay request, approval, input position, versions, consumer, counts, errors, dead letters, output version, control-total comparison, exceptions, and release decision. Failed or partial replay remains visible and recoverable.

## Related Documents

- [000-index.md](000-index.md)
- [019-event-versioning.md](019-event-versioning.md)
- [021-dead-letter-queues.md](021-dead-letter-queues.md)
- [../300-data-model/019-read-models.md](../300-data-model/019-read-models.md)
