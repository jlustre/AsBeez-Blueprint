# Ledger Partitioning

> **Document:** 12-financial-system/030-general-ledger/016-ledger-partitioning.md

---

## Purpose

Ledger partitioning organizes high-volume entries for performance, availability, jurisdiction, retention, and operational isolation without changing accounting meaning.

## Partition Dimensions

- legal entity and ledger;
- posting period or date range;
- country or regulatory region where required;
- currency or currency family; and
- controlled operational shard for scale.

## Rules

Partition keys are immutable for a posted line. Cross-partition entries retain one logical journal identity and a verifiable balanced relationship. Reports and trial balances must aggregate partitions consistently and identify the source partitions used.

## Operations

Partition creation, movement, archival, backup, restoration, and rebuild are governed changes. No partition may be dropped while it contains required legal, accounting, audit, tax, or dispute evidence.

## Related Documents

- [000-index.md](000-index.md)
- [002-ledger-architecture.md](002-ledger-architecture.md)
- [009-ledger-periods.md](009-ledger-periods.md)
- [017-ledger-retention.md](017-ledger-retention.md)
