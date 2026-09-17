# Reward Finance

> **Document:** 12-financial-system/060-reward-finance/000-index.md

---

## Purpose

This section defines financial accounting for Reward Points, AHC, ABC creation, matrix distribution, referral rewards, liabilities, expense recognition, reserves, unclaimed and forfeited rewards, adjustments, reconciliation, reporting, and audit.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-reward-financial-model.md](002-reward-financial-model.md) - Reward Financial Model
- [003-reward-point-accounting.md](003-reward-point-accounting.md) - Reward Point Accounting
- [004-ahc-accounting.md](004-ahc-accounting.md) - AHC Accounting
- [005-abc-creation-accounting.md](005-abc-creation-accounting.md) - ABC Creation Accounting
- [006-matrix-distribution-accounting.md](006-matrix-distribution-accounting.md) - Matrix Distribution Accounting
- [007-referral-reward-accounting.md](007-referral-reward-accounting.md) - Referral Reward Accounting
- [008-reward-liabilities.md](008-reward-liabilities.md) - Reward Liabilities
- [009-reward-expense-recognition.md](009-reward-expense-recognition.md) - Reward Expense Recognition
- [010-reward-reserves.md](010-reward-reserves.md) - Reward Reserves
- [011-unclaimed-rewards.md](011-unclaimed-rewards.md) - Unclaimed Rewards
- [012-expired-or-forfeited-rewards.md](012-expired-or-forfeited-rewards.md) - Expired Or Forfeited Rewards
- [013-reward-adjustments.md](013-reward-adjustments.md) - Reward Adjustments
- [014-reward-reconciliation.md](014-reward-reconciliation.md) - Reward Reconciliation
- [015-reward-reporting.md](015-reward-reporting.md) - Reward Reporting
- [016-reward-audit.md](016-reward-audit.md) - Reward Audit
- [017-future-roadmap.md](017-future-roadmap.md) - Future Roadmap

## Design Authority

Reward Finance owns the financial classification, measurement, funding, liability, expense, reserve, reconciliation, reporting, and audit treatment of approved reward events. Rewards owns RP rules and ABC creation; the Beehive Matrix owns placement and distribution; Marketplace owns qualifying commerce. The General Ledger owns posted monetary effects.

## Implementation Sequence

1. Approve reward terms, country availability, legal classification, funding, and liability ceilings.
2. Capture immutable RP, ABC, matrix, AHC, referral, and source-commerce events.
3. Define recognition, liability, expense, reserve, redemption, wallet, and payout outcomes.
4. Map approved monetary effects to Chart of Accounts and General Ledger control accounts.
5. Implement refund, chargeback, fraud, expiry, forfeiture, and adjustment propagation.
6. Reconcile program quantities, financial amounts, wallets, settlements, reports, and audit evidence.
