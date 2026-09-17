# Database Overview

> **Document:** 12-financial-system/300-data-model/001-database-overview.md

---

## Purpose

The financial database stores authoritative financial aggregates, immutable posted accounting, operational evidence, durable events, projections, controls, and audit history.

## Modeling Rules

- every record has a stable identifier, created/updated timestamps, schema version, and lifecycle status;
- monetary values use integer minor units plus ISO currency; no floating-point financial amounts;
- financial records carry legal entity, country, source, policy version, correlation, actor/service, and idempotency references;
- posted journal records are append-only; corrections use reversals or compensating entries; and
- private context data is accessed through contracts, not direct cross-context table writes.

## Integrity

Foreign keys, unique constraints, check constraints, optimistic versions, account/period validity, balanced journal controls, and reconciliation control totals protect data integrity. Soft deletion is prohibited for posted financial facts.

## Operational Separation

Transactional writes, outbox records, event history, read models, reporting snapshots, and audit evidence have distinct ownership and recovery procedures.

## Related Documents

- [000-index.md](000-index.md)
- [002-financial-accounts-schema.md](002-financial-accounts-schema.md)
- [003-journal-entries-schema.md](003-journal-entries-schema.md)
- [018-event-store-schema.md](018-event-store-schema.md)
- [021-partitioning.md](021-partitioning.md)
