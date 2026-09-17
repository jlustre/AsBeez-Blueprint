# Report Events

> **Document:** 12-financial-system/230-financial-reporting/021-report-events.md

---

## Purpose

Report events are immutable facts for definition, dataset refresh, snapshot, certification, scheduling, export, amendment, and exception workflows.

## Event Catalog

- ReportDefinitionCreated, ReportDefinitionVersioned, DatasetRefreshed;
- ReportSnapshotGenerated, ReportCertified, ReportCertificationRevoked;
- ReportScheduled, ReportDelivered, ReportDeliveryFailed;
- ReportExportRequested, ReportExportCompleted, ReportExportExpired;
- ReportAmendmentCreated, ReportExceptionOpened/Resolved; and
- RegulatoryReportSubmitted, RegulatoryReportAmended.

## Contract

Events include ID/version, report/snapshot/export/schedule, scope, period, entity/country/currency, source/reconciliation/certification, actor/system, occurred/effective time, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. Report events do not alter source/ledger records or imply certification without required approvals and reconciliation.

## Related Documents

- [000-index.md](000-index.md)
- [002-reporting-domain-model.md](002-reporting-domain-model.md)
- [018-report-scheduling.md](018-report-scheduling.md)
- [019-report-export.md](019-report-export.md)
