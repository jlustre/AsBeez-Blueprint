# Event Testing

> **Document:** 12-financial-system/360-testing/008-event-testing.md

---

## Purpose

Event tests verify immutable envelopes, schema/version, ownership, ordering where required, publication, delivery, consumer behavior, idempotency, replay, and failure handling.

## Required Cases

Test valid/invalid payloads, missing fields, entity/country/currency scope, correlation/causation, sequence gaps, duplicate delivery, out-of-order events, retries, poison events, provider evidence, dead letters, replay, projection rebuild, and retention/privacy behavior.

## Financial Assertions

Events must not duplicate wallet, payout, refund, reserve, tax, or ledger effects. `JournalPosted` is emitted only after balanced posting; provider observations remain evidence; event delivery does not prove downstream completion. Test audit, reconciliation, and control totals.

## Related Documents

- [000-index.md](000-index.md)
- [009-contract-testing.md](009-contract-testing.md)
- [014-replay-testing.md](014-replay-testing.md)
- [../320-events/002-event-contracts.md](../320-events/002-event-contracts.md)
