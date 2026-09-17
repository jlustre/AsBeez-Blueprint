# Reward Reconciliation

> **Document:** 12-financial-system/220-reconciliation/007-reward-reconciliation.md

---

## Purpose

Reward reconciliation matches qualifying orders to RP, ABC, matrix, AHC, referral, liability, expense, reserve, wallet, payout, and General Ledger effects.

## Required Checks

- order/payment/refund/chargeback population to RP events;
- RP consumption to ABC eligibility/creation;
- ABC/matrix events to AHC quantities;
- AHC and reward events to approved monetary classification or no-effect outcome;
- reward liabilities, expenses, reserves, redemptions, wallet credits, and payouts; and
- country, program, policy, member, vendor, partner, and currency attribution.

## Rules

Balanced monetary totals do not prove correct reward lineage. Duplicate, missing, unclassified, reversed, expired, or unauthorized reward events are exceptions.

## Related Documents

- [000-index.md](000-index.md)
- [003-ledger-to-subledger.md](003-ledger-to-subledger.md)
- [008-vendor-reconciliation.md](008-vendor-reconciliation.md)
- [014-exceptions.md](014-exceptions.md)
