# Dead Letter Queues

> **Document:** 12-financial-system/320-events/021-dead-letter-queues.md

---

## Purpose

Dead-letter queues isolate events that cannot be processed after defined retries, protecting the live event flow while preserving financial evidence and operational visibility.

## Required Metadata

Retain event ID/type/version, aggregate and sequence, source, consumer, attempt count, first/last failure, error class, payload hash/reference, correlation/causation, entity/country/currency, policy, and original timestamps.

## Operations

Classify transient, validation, compatibility, authorization, data, provider, poison, and systemic failures. Operators may inspect, quarantine, repair through an approved new command, replay, route to a new consumer, or permanently reject under authority. Original events are never edited or deleted to make processing succeed.

## Financial Safety

Consumers are idempotent. Reprocessing a financial event verifies aggregate version, source state, period, authorization, and prior effect. Uncertain provider events go to reconciliation rather than blind retry. Queue health, age, volume, replay, and unresolved risk are reported and audited.

## Related Documents

- [000-index.md](000-index.md)
- [002-event-contracts.md](002-event-contracts.md)
- [020-event-replay.md](020-event-replay.md)
- [../290-architecture/008-outbox-pattern.md](../290-architecture/008-outbox-pattern.md)
