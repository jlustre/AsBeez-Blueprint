# Future Roadmap

> **Document:** 12-financial-system/300-data-model/023-future-roadmap.md

---

## Near Term

- implement typed schemas, constraints, ownership, migrations, audit lineage, and ledger/subledger control relationships;
- establish idempotency, event/outbox, read-model rebuild, reconciliation, partition, retention, backup, and recovery operations; and
- verify payment, payout, refund, tax, FX, reserve, period, reporting, and audit data against real workflows.

## Medium Term

- add schema registry and compatibility checks for domain/events;
- improve country/entity partitioning, regional residency, report snapshots, continuous reconciliation, and operational observability; and
- extract high-volume read, event, reconciliation, and reporting workloads where justified.

## Long Term

- support independently deployable financial contexts with portable contracts;
- provide governed data products for analytics, forecasting, risk, compliance, and regulatory reporting; and
- preserve immutable financial lineage through migrations, technology changes, and regional expansion.

## Roadmap Gate

No data-model change may weaken double-entry balance, immutable posted facts, source lineage, idempotency, country/entity isolation, retention/legal holds, privacy, auditability, reconciliation, or recovery.

## Related Documents

- [000-index.md](000-index.md)
- [001-database-overview.md](001-database-overview.md)
- [020-indexing.md](020-indexing.md)
- [022-retention.md](022-retention.md)
