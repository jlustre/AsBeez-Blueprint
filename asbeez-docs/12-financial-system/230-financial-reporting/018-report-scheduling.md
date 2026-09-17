# Report Scheduling

> **Document:** 12-financial-system/230-financial-reporting/018-report-scheduling.md

---

## Purpose

Report scheduling controls when certified, management, operational, regulatory, or provisional reports are generated, reviewed, delivered, and archived.

## Required Data

Report definition/version, scope, period, timezone, cadence, trigger, recipients/roles, delivery channel, format, data freshness, approval, retry, failure, and retention.

## Rules

Certified and regulatory reports schedule only after required period close/reconciliation status. A failed schedule does not imply report certification. Recipients receive only authorized data, and every delivery/export is logged.

## Monitoring

Schedules report pending, running, succeeded, failed, retried, delivered, acknowledged, expired, and access-revoked states with report version, data freshness, recipient scope, and failure evidence.

## Related Documents

- [000-index.md](000-index.md)
- [002-reporting-domain-model.md](002-reporting-domain-model.md)
- [019-report-export.md](019-report-export.md)
- [017-regulatory-reporting.md](017-regulatory-reporting.md)
