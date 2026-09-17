# Wallet Reconciliation

> **Document:** 12-financial-system/220-reconciliation/006-wallet-reconciliation.md

---

## Purpose

Wallet reconciliation proves that wallet movements, holds, reservations, credits, debits, statements, and available balances agree with wallet subledger, approved reward conversions, settlement/payout, and GL control accounts.

## Rules

Monetary wallet balances and RP/ABC/AHC quantities reconcile separately. Missing source, duplicate movement, stale projection, currency mismatch, or unauthorized conversion is an exception. Balance snapshots are never edited to hide differences.

## Evidence

Wallet reconciliation retains opening/closing balances, movement populations, holds, reservations, source events, currency/unit, owner, subledger/GL control totals, freshness, reviewer, approval, and resolution evidence.

## Related Documents

- [000-index.md](000-index.md)
- [003-ledger-to-subledger.md](003-ledger-to-subledger.md)
- [007-reward-reconciliation.md](007-reward-reconciliation.md)
- [015-discrepancy-resolution.md](015-discrepancy-resolution.md)
