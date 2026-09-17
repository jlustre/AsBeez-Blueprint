# Data Warehouse

> **Document:** 12-financial-system/340-integrations/013-data-warehouse.md

---

## Purpose

The data warehouse receives governed financial facts, events, read models, snapshots, dimensions, and certified reports for analytics, forecasting, risk, compliance, audit, and management reporting.

## Pipeline Contract

Each load identifies source context, extraction position/time, schema version, entity/country/currency/period, data classification, transformation, row/count and monetary control totals, freshness, certification, and replay/rejection status. Raw evidence and curated models remain distinguishable.

## Rules

Warehouse data is read-only relative to financial authority. Pipelines are encrypted, access-controlled, minimized, idempotent, replayable, partition-aware, retention-aware, and reconciled to source control totals. Late, corrected, deleted/anonymized, or legally held data follows explicit policy; reports label estimates and stale data.

## Related Documents

- [000-index.md](000-index.md)
- [009-business-intelligence.md](009-business-intelligence.md)
- [015-integration-security.md](015-integration-security.md)
- [../300-data-model/021-partitioning.md](../300-data-model/021-partitioning.md)
