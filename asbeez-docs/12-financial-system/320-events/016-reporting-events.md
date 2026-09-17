# Reporting Events

> **Document:** 12-financial-system/320-events/016-reporting-events.md

---

## Purpose

Reporting events communicate report definition changes, run requests, snapshot generation, certification, delivery, freshness, withdrawal, and failure facts.

## Event Catalog

`ReportDefined`, `ReportRunRequested`, `ReportRunStarted`, `ReportSnapshotGenerated`, `ReportCertified`, `ReportCertificationWithdrawn`, `ReportDelivered`, `ReportDeliveryFailed`, and `ReportRefreshRequired`.

## Payload and Rules

Events include report/run/snapshot IDs, report type, actual/projection/forecast basis, source positions, query/schema version, filters, period, entity/country/currency/FX basis, freshness, certification, export hash, requester, and recipients. Reporting events never mutate ledger truth and distinguish certified actuals from estimates.

## Related Documents

- [000-index.md](000-index.md)
- [014-reconciliation-events.md](014-reconciliation-events.md)
- [015-close-events.md](015-close-events.md)
- [../300-data-model/016-reporting-schema.md](../300-data-model/016-reporting-schema.md)
