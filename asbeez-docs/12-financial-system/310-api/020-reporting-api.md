# Reporting API

> **Document:** 12-financial-system/310-api/020-reporting-api.md

---

## Purpose

The Reporting API exposes certified and management reports, statements, trial balances, financial schedules, report runs, snapshots, exports, and delivery status.

## Queries

Retrieve report definitions, actual/projection/forecast basis, entity/country/currency/period filters, source versions, freshness, certification, statements, trial balance, GL, wallet, vendor, partner, tax, reserve, reconciliation, and management metrics.

## Commands

Request report run, schedule, export, delivery, certify, withdraw certification, or resolve report exception where authorized. Large or expensive reports may run asynchronously and return operation status.

## Rules

Reports distinguish posted actuals from estimates, budgets, forecasts, provider evidence, and analytics. Every output carries lineage, query/schema version, period, currency/FX basis, filters, rounding, freshness, and certification. Reports cannot mutate ledger or source records.

## Related Documents

- [000-index.md](000-index.md)
- [006-pagination-filtering-and-sorting.md](006-pagination-filtering-and-sorting.md)
- [019-reconciliation-api.md](019-reconciliation-api.md)
- [../300-data-model/016-reporting-schema.md](../300-data-model/016-reporting-schema.md)
- [../230-financial-reporting/001-overview.md](../230-financial-reporting/001-overview.md)
