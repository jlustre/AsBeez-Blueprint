# Ledger Balancing

> **Document:** 12-financial-system/030-general-ledger/008-ledger-balancing.md

---

## Purpose

Balancing proves that the ledger remains internally consistent at entry, batch, account, period, entity, currency, and consolidated reporting levels.

## Required Checks

- each journal entry has equal debits and credits;
- each posted batch agrees with its expected count and totals;
- account balances equal the sum of posted lines for the selected slice;
- opening balance plus activity equals closing balance;
- subledger and GL control totals agree;
- clearing, suspense, and intercompany balances have documented status; and
- foreign exchange and rounding differences use approved accounts.

## Trial Balance

A trial balance lists every reporting account with debit and credit totals and confirms that the aggregate debits equal aggregate credits. It is generated from posted lines, filtered by entity, currency, period, and chart version.

## Exception Handling

A failed balance check creates an exception with scope, detected time, affected accounts, source references, owner, severity, and resolution. Reports must not silently suppress an imbalance.

## Related Documents

- [000-index.md](000-index.md)
- [003-double-entry-accounting.md](003-double-entry-accounting.md)
- [009-ledger-periods.md](009-ledger-periods.md)
- [013-ledger-reconciliation.md](013-ledger-reconciliation.md)
