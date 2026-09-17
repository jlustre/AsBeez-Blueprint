# Report API

> **Document:** 12-financial-system/230-financial-reporting/020-report-api.md

---

## Purpose

The Reporting API exposes authenticated report definitions, datasets, snapshots, schedules, exports, certifications, exceptions, and access controls without allowing clients to alter source accounting data.

## Read Operations

- retrieve reports, dimensions, source freshness, period, entity/country/currency, certification, exceptions, and schedules;
- retrieve certified/provisional snapshots and export status; and
- retrieve authorized operational, management, statutory, and regulatory views.

## Commands

Create report definition, run snapshot, schedule, certify, request export, acknowledge exception, and amend report. Commands require role scope, policy/version, period status, reconciliation status, idempotency, and audit correlation.

## Rules

Clients cannot alter ledger, source, report actuals, certification, reconciliation, or regulatory submission state through arbitrary fields.

## Related Documents

- [000-index.md](000-index.md)
- [002-reporting-domain-model.md](002-reporting-domain-model.md)
- [018-report-scheduling.md](018-report-scheduling.md)
- [021-report-events.md](021-report-events.md)
