# Accounting Periods

> **Document:** 12-financial-system/210-financial-periods-and-close/003-accounting-periods.md

---

## Purpose

Accounting periods define the posting and reporting boundary for a legal entity, ledger, country, and currency context.

## States

```text
Planned -> Open -> Soft Close -> Closed -> Archived
```

## Required Data

Period ID, calendar, entity, country, start/end, timezone, currency/reporting scope, status, close owner, adjustment policy, checklist, and version.

## Rules

Open periods accept ordinary approved postings. Soft close permits only controlled late or close activity. Closed periods reject ordinary postings; adjustments require authority and explicit posting period. Archived periods remain reportable and immutable.

## Period Reporting

Every period reports posted activity, adjustments, accruals, deferrals, trial balance, reconciliations, exceptions, approvals, and close status by account, entity, country, currency, and reporting dimensions.

## Related Documents

- [000-index.md](000-index.md)
- [002-fiscal-calendars.md](002-fiscal-calendars.md)
- [004-period-opening.md](004-period-opening.md)
- [005-period-locking.md](005-period-locking.md)
