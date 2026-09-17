# Partitioning

> **Document:** 12-financial-system/300-data-model/021-partitioning.md

---

## Purpose

Data partitioning separates high-volume and regulated financial records by legal entity, country, period, currency, context, workload, or operational shard.

## Candidate Data

Journal lines, events, outbox records, provider transactions, reconciliation runs, audit records, report snapshots, and time-bound operational histories may be partitioned after authority and relationship analysis.

## Rules

Partition keys are explicit and retained on every record. Posted journals and linked lines remain queryable as one accounting fact even when physically partitioned. Cross-partition operations use durable orchestration, idempotency, control totals, and reconciliation; no distributed write bypasses ledger authority.

## Lifecycle

Partition creation, migration, archival, restore, replay, split, merge, and deletion require approval, backup, integrity checks, retention/legal-hold review, access review, and rollback evidence.

## Related Documents

- [000-index.md](000-index.md)
- [020-indexing.md](020-indexing.md)
- [022-retention.md](022-retention.md)
- [../290-architecture/012-data-partitioning.md](../290-architecture/012-data-partitioning.md)
