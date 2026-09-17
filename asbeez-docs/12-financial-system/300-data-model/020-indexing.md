# Indexing

> **Document:** 12-financial-system/300-data-model/020-indexing.md

---

## Purpose

Indexing supports safe lookup, reconciliation, idempotency, workflow recovery, authorization, and reporting without compromising financial integrity.

## Index Families

Index immutable identifiers, source/context references, entity/country/currency/period, account and journal relationships, wallet owner/type, provider references, status transitions, idempotency keys, event aggregate sequence, outbox publication state, reconciliation exceptions, and audit resources.

## Rules

Unique indexes enforce account codes, journal numbers, provider references within scope, idempotency scope, event sequence, and payout/refund/provider identities. Composite indexes match access scope and include tenant/entity/country boundaries. Indexes never replace constraints or authorization checks.

## Operations

Index creation, replacement, removal, reindexing, and online migration require workload analysis, query review, lock/latency assessment, backup/recovery consideration, and post-change reconciliation. Sensitive values are not indexed in plaintext unless explicitly approved.

## Related Documents

- [000-index.md](000-index.md)
- [001-database-overview.md](001-database-overview.md)
- [021-partitioning.md](021-partitioning.md)
- [022-retention.md](022-retention.md)
