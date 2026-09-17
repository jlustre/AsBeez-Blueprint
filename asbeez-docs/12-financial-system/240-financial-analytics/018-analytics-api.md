# Analytics API

> **Document:** 12-financial-system/240-financial-analytics/018-analytics-api.md

---

## Purpose

The Analytics API exposes authorized KPI, metric, dimension, dashboard, snapshot, forecast, anomaly, and insight data without permitting clients to alter source or certified reporting records.

## Read Operations

- retrieve metric definitions, values, dimensions, source freshness, certification, assumptions, and exceptions;
- query dashboards, cohorts, trends, scenarios, forecasts, anomalies, and reports; and
- retrieve evidence-linked explanations and export status.

## Commands

Create metric definition, run analysis, create snapshot, schedule dashboard, acknowledge anomaly, request export, and submit insight review. Commands require scope, role, version, idempotency, data policy, and audit correlation.

## Rules

Clients cannot alter actuals, ledger/subledger data, report certification, anomaly outcomes, or financial source definitions through API fields.

## Related Documents

- [000-index.md](000-index.md)
- [002-financial-kpis.md](002-financial-kpis.md)
- [017-financial-dashboards.md](017-financial-dashboards.md)
- [019-analytics-events.md](019-analytics-events.md)
