# Financial Period Schema

> **Document:** 12-financial-system/300-data-model/015-financial-period-schema.md

---

## Purpose

Financial-period data defines accounting calendars, period status, close controls, posting windows, and statutory/reporting boundaries.

## Core Fields

`period_id`, `calendar_id`, `entity_id`, `country_code`, `period_type`, `period_name`, `start_date`, `end_date`, `status`, `opened_at`, `locked_at`, `closed_at`, `close_owner`, `approval_id`, `reopen_reason`, and `policy_version`.

## Lifecycle

Planned, open, soft-closed, locked, closed, reopened under authority, or superseded. A journal may post only to an open period with valid entity, country, currency, account, and policy scope.

## Close Rules

Close preserves trial balance, accruals, deferrals, adjustments, reconciliations, unresolved exceptions, approvals, and evidence. Reopening a locked/closed period requires recorded authority and produces an auditable adjustment or correction.

## Related Documents

- [000-index.md](000-index.md)
- [003-journal-entries-schema.md](003-journal-entries-schema.md)
- [014-reconciliation-schema.md](014-reconciliation-schema.md)
- [../210-financial-periods-and-close/001-overview.md](../210-financial-periods-and-close/001-overview.md)
