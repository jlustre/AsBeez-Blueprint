# Business Intelligence

> **Document:** 12-financial-system/340-integrations/009-business-intelligence.md

---

## Purpose

BI integrations consume approved financial datasets, metrics, projections, reports, and certified snapshots for dashboards, analysis, forecasting, and management decisions.

## Contract

Publish dataset owner, source position/snapshot, schema version, entity/country/currency/period, accounting basis, FX/tax basis, freshness, certification, filters, dimensions, and data classification. Distinguish GMV, recognized revenue, liabilities, cash, estimates, and provider evidence.

## Rules

BI systems are read-only consumers and cannot mutate financial truth or authorize actions. Exports are scoped, minimized, access-controlled, encrypted, lineage-preserving, and revocable. Metric changes are versioned and communicated; stale or uncertified data is labeled.

## Related Documents

- [000-index.md](000-index.md)
- [013-data-warehouse.md](013-data-warehouse.md)
- [016-integration-monitoring.md](016-integration-monitoring.md)
- [../300-data-model/016-reporting-schema.md](../300-data-model/016-reporting-schema.md)
