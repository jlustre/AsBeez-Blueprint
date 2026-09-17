# Period Locking

> **Document:** 12-financial-system/210-financial-periods-and-close/005-period-locking.md

---

## Purpose

Period locking prevents ordinary posting or modification after a close boundary while allowing controlled adjustments, restatements, and evidence-preserving workflows.

## Lock Levels

- subledger operational lock;
- module or source cutoff;
- soft-close restriction;
- General Ledger period close; and
- archive/retention lock.

## Rules

Lock state, scope, owner, time, reason, and authority are recorded. Reopening a period requires approval, impact analysis, affected reports, adjustment/restatement treatment, and post-reopen close. No lock may be bypassed by API, administrator, provider callback, or AI.

## Evidence

Lock and reopen records include period, entity, country, currency, affected modules, user/service, approval, timestamps, reason, exceptions, and resulting adjustment entries.

## Related Documents

- [000-index.md](000-index.md)
- [003-accounting-periods.md](003-accounting-periods.md)
- [011-adjusting-entries.md](011-adjusting-entries.md)
- [015-close-approvals.md](015-close-approvals.md)
