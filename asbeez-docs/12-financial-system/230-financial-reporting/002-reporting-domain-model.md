# Reporting Domain Model

> **Document:** 12-financial-system/230-financial-reporting/002-reporting-domain-model.md

---

## Purpose

The Reporting domain models report definitions, datasets, dimensions, periods, snapshots, certifications, schedules, exports, exceptions, and access.

## Entities

| Entity | Responsibility |
| --- | --- |
| Report Definition | metric, layout, source, filters, policy, and version |
| Report Dataset | reconciled records and control totals used by report |
| Report Snapshot | reproducible result at a point in time |
| Certification | reviewer, approver, scope, limitations, and status |
| Report Schedule | cadence, recipients, delivery, and failure handling |
| Export | format, query scope, access, integrity, and audit |
| Reporting Dimension | entity, country, currency, account, product, channel, program, and counterparty |

## Invariants

- certified reports use reconciled source and immutable ledger history;
- report definition and policy versions are retained;
- amounts identify currency, period, entity, country, and dimensions;
- provisional/estimated values are labeled; and
- report access/export is authorized and auditable.

## Related Documents

- [000-index.md](000-index.md)
- [003-trial-balance.md](003-trial-balance.md)
- [015-consolidated-financial-report.md](015-consolidated-financial-report.md)
- [017-regulatory-reporting.md](017-regulatory-reporting.md)
