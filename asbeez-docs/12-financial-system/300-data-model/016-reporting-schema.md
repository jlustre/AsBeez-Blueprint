# Reporting Schema

> **Document:** 12-financial-system/300-data-model/016-reporting-schema.md

---

## Purpose

Reporting data defines certified and management-facing statements, report definitions, schedules, snapshots, filters, lineage, and delivery records.

## Core Entities

`report_definition`, `report_run`, `report_snapshot`, `report_dataset`, `report_filter`, `report_delivery`, and `certification`. Fields include report type, source versions, entity/country/currency scope, period, accounting basis, generated time, freshness, status, preparer, reviewer, certification, and export hash.

## Rules

Reports distinguish posted actuals, projections, forecasts, budgets, provider evidence, and management estimates. Trial balance, balance sheet, income statement, cash flow, wallet, vendor, partner, tax, country, and consolidated reports identify their source and certification status. Reports cannot mutate accounting truth.

## Lineage

Every report preserves query version, chart/account mappings, dimensions, period, FX policy, tax basis, source snapshots, exclusions, rounding, and delivery recipients.

## Related Documents

- [000-index.md](000-index.md)
- [015-financial-period-schema.md](015-financial-period-schema.md)
- [019-read-models.md](019-read-models.md)
- [../230-financial-reporting/001-overview.md](../230-financial-reporting/001-overview.md)
