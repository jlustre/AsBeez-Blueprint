# Financial Close Testing

> **Document:** 12-financial-system/360-testing/011-financial-close-testing.md

---

## Purpose

Close tests verify calendar, period, posting, accrual, deferral, adjustment, reconciliation, trial balance, reporting, approval, lock, reopen, certification, and evidence controls.

## Required Cases

Test normal monthly/quarterly/year-end close, incomplete tasks, unresolved differences, late source data, locked period rejection, authorized reopen, unauthorized reopen, duplicate adjustment, correction/reversal, multi-entity/country, multi-currency, tax, and recovery during close.

## Assertions

Close cannot certify with unexplained critical exceptions or unbalanced trial balance. Reopen requires authority and produces auditable changes. Reports identify period/status/source/version, and all close decisions are separated, traceable, and reproducible.

## Related Documents

- [000-index.md](000-index.md)
- [010-reconciliation-testing.md](010-reconciliation-testing.md)
- [015-performance-testing.md](015-performance-testing.md)
- [../300-data-model/015-financial-period-schema.md](../300-data-model/015-financial-period-schema.md)
