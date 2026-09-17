# Close Events

> **Document:** 12-financial-system/320-events/015-close-events.md

---

## Purpose

Close events communicate financial-calendar opening, posting restrictions, close tasks, accruals, deferrals, adjustments, approvals, lock, reopen, and certification facts.

## Event Catalog

`PeriodOpened`, `CloseChecklistCreated`, `AccrualRecorded`, `DeferralRecorded`, `CloseAdjustmentPosted`, `ReconciliationRequired`, `CloseTaskCompleted`, `PeriodSoftClosed`, `PeriodLocked`, `PeriodClosed`, `PeriodReopened`, and `CloseCertified`.

## Payload and Rules

Events include period/calendar/entity/country, status, accounting date, task/control, journal/reference, owner, reviewer, approval, exception, policy, and certification evidence. A locked/closed period cannot accept ordinary posting. Reopening requires recorded authority and creates auditable adjustment or correction facts.

## Related Documents

- [000-index.md](000-index.md)
- [004-ledger-events.md](004-ledger-events.md)
- [014-reconciliation-events.md](014-reconciliation-events.md)
- [../300-data-model/015-financial-period-schema.md](../300-data-model/015-financial-period-schema.md)
