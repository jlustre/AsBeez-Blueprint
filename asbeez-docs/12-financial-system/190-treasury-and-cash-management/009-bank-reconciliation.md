# Bank Reconciliation

> **Document:** 12-financial-system/190-treasury-and-cash-management/009-bank-reconciliation.md

---

## Purpose

Bank reconciliation matches bank statements and transaction evidence to AsBeez cash accounts, fund transfers, payments, payouts, refunds, taxes, reserves, and General Ledger entries.

## Required Checks

- statement account, entity, currency, and period match;
- every bank line is matched, timing-differenced, or exceptioned;
- deposits, provider settlements, payouts, refunds, transfers, fees, taxes, and reserves agree;
- unknown, duplicate, returned, or short/over items are owned and aged; and
- GL control totals and cash positions agree after approved adjustments.

## Rules

Bank evidence is external source data and cannot be edited to force a match. Corrections use source correction, compensating entry, or approved suspense/clearing workflow. Completion records reviewer, approval, population, unmatched amount, source period, and evidence.

## Related Documents

- [000-index.md](000-index.md)
- [003-bank-accounts.md](003-bank-accounts.md)
- [008-fund-transfers.md](008-fund-transfers.md)
- [015-treasury-reporting.md](015-treasury-reporting.md)
