# Data Partitioning

> **Document:** 12-financial-system/290-architecture/012-data-partitioning.md

---

## Purpose

Data partitioning organizes financial data for performance, country/entity isolation, currency, period, retention, security, and operational scale without changing business meaning.

## Partition Dimensions

Legal entity, country/region, currency, period, domain/context, workload, and controlled operational shard.

## Rules

Partition keys and cross-partition journal relationships are immutable for posted facts. Reports aggregate partitions with source identification. No partition may be dropped while legal, tax, dispute, audit, or financial evidence is retained.

## Operations

Partition creation, migration, backup, restore, replay, archival, and deletion require change approval, data-integrity verification, control-total comparison, access review, retention/legal-hold review, and rollback evidence.

## Related Documents

- [000-index.md](000-index.md)
- [013-country-isolation.md](013-country-isolation.md)
- [014-multi-region-architecture.md](014-multi-region-architecture.md)
- [016-disaster-recovery.md](016-disaster-recovery.md)
