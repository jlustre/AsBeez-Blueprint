# Replay Testing

> **Document:** 12-financial-system/360-testing/014-replay-testing.md

---

## Purpose

Replay tests prove that events, outbox records, projections, workflows, and recovery processes can be replayed deterministically without changing original evidence or duplicating financial effects.

## Required Cases

Test full and scoped replay, snapshot boundary, schema upcaster, version change, duplicate/out-of-order events, dead letters, failed consumer, provider callback, projection rebuild, ledger-derived view rebuild, partial replay, cancellation, and control-total comparison.

## Rules

Ledger postings are not recreated by projection replay. External effects are not resent blindly; reconcile first. Replay records scope, source position, consumer/version, actor/approval, counts, errors, outputs, idempotency, control totals, and release decision.

## Related Documents

- [000-index.md](000-index.md)
- [008-event-testing.md](008-event-testing.md)
- [009-contract-testing.md](009-contract-testing.md)
- [../320-events/020-event-replay.md](../320-events/020-event-replay.md)
