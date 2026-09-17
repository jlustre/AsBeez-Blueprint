# Analytics Events

> **Document:** 12-financial-system/240-financial-analytics/019-analytics-events.md

---

## Purpose

Analytics events are immutable facts for metric definition, dataset refresh, snapshot, dashboard, forecast, anomaly, insight, export, and review workflows.

## Event Catalog

- MetricDefinitionCreated, MetricDefinitionVersioned, DatasetRefreshed;
- KPICalculated, AnalyticsSnapshotGenerated, DashboardPublished;
- ForecastAnalyticsGenerated, ScenarioAnalyticsGenerated;
- AnomalyDetected, AnomalyAcknowledged, AnomalyResolved;
- InsightGenerated, InsightReviewed, AnalyticsExportRequested/Completed; and
- AnalyticsExceptionOpened/Resolved.

## Contract

Events include ID/version, metric/dashboard/snapshot, source scope, period, entity/country/currency, dimensions, model/policy version, freshness, confidence, actor/system, occurred/effective time, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. Analytics events do not alter accounting sources, certify reports, close exceptions, or authorize funds.

## Related Documents

- [000-index.md](000-index.md)
- [002-financial-kpis.md](002-financial-kpis.md)
- [016-anomaly-detection.md](016-anomaly-detection.md)
- [018-analytics-api.md](018-analytics-api.md)
