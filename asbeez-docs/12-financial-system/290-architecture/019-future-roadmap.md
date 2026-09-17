# Future Roadmap

> **Document:** 12-financial-system/290-architecture/019-future-roadmap.md

---

## Near Term

- implement modular bounded contexts, ledger authority, CQRS/read models, events/outbox, idempotency, and concurrency controls;
- connect orchestration, sagas, payments, payouts, wallets, rewards, vendors, partners, tax, treasury, reconciliation, reporting, and audit;
- establish country/entity isolation, partitioning, HA, DR, security, observability, performance, and capacity baselines; and
- test replay, failover, provider uncertainty, recovery, and financial reconciliation.

## Medium Term

- extract high-value contexts from the modular monolith where justified;
- improve multi-region operations, continuous reconciliation, report projections, provider resilience, and close automation; and
- strengthen performance, scaling, disaster exercises, and operational governance.

## Long Term

- support regional financial services and independent bounded-context deployment;
- provide high-volume event, ledger, analytics, and regulatory reporting platforms;
- improve policy-aware automation and governed AI; and
- preserve portable, auditable financial semantics across technology changes.

## Roadmap Gate

No architecture change may weaken ledger immutability, double-entry balance, idempotency, country/entity isolation, auditability, reconciliation, security, recovery, or policy versioning.

## Related Documents

- [000-index.md](000-index.md)
- [010-concurrency-control.md](010-concurrency-control.md)
- [016-disaster-recovery.md](016-disaster-recovery.md)
