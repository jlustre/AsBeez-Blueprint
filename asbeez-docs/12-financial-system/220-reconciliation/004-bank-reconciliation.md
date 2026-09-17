# Bank Reconciliation

> **Document:** 12-financial-system/220-reconciliation/004-bank-reconciliation.md

---

## Purpose

Bank reconciliation matches bank statements and transaction evidence to AsBeez bank/cash accounts, fund transfers, payments, payouts, refunds, taxes, reserves, and General Ledger entries.

## Required Checks

- statement account, entity, country, currency, and period;
- deposits, provider settlements, transfers, payouts, refunds, fees, tax, and reserve movements;
- every statement line matched, timing-differenced, or exceptioned;
- returned, duplicate, unknown, short/over, and restricted items; and
- GL cash control totals and position reports.

## Rules

Bank evidence is not edited to force a match. Corrections use source correction, clearing/suspense, or compensating entry with owner, evidence, approval, and audit trail.

## Related Documents

- [000-index.md](000-index.md)
- [003-ledger-to-subledger.md](003-ledger-to-subledger.md)
- [015-discrepancy-resolution.md](015-discrepancy-resolution.md)
- [017-reconciliation-reporting.md](017-reconciliation-reporting.md)
