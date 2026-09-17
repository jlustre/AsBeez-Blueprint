# Future Roadmap

> **Document:** 12-financial-system/320-events/022-future-roadmap.md

---

## Near Term

- publish stable event envelopes, ownership, schema registry, version compatibility, outbox delivery, consumer idempotency, observability, and access controls;
- implement account, ledger, wallet, payment, payout, invoice, refund, dispute, tax, FX, reserve, reconciliation, close, reporting, compliance, and security event catalogs; and
- test provider uncertainty, replay, dead letters, projection rebuild, ledger lineage, and reconciliation control totals.

## Medium Term

- add regional/country event routing, contract testing, consumer inventory, delivery SLOs, event analytics, and operational replay tooling;
- improve event retention, privacy minimization, encryption, schema evolution, and disaster recovery; and
- extract high-volume event consumers where ownership and scale justify it.

## Long Term

- support independently deployable contexts with durable event contracts;
- provide governed event products for reporting, risk, compliance, and forecasting; and
- maintain portable, auditable event lineage across countries, providers, and technology changes.

## Roadmap Gate

No event change may weaken immutability, versioning, idempotency, ledger authority, privacy, country/entity isolation, auditability, reconciliation, or recovery.

## Related Documents

- [000-index.md](000-index.md)
- [001-event-overview.md](001-event-overview.md)
- [019-event-versioning.md](019-event-versioning.md)
- [021-dead-letter-queues.md](021-dead-letter-queues.md)
