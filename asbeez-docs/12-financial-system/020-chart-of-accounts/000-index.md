# Chart Of Accounts

> **Document:** 12-financial-system/020-chart-of-accounts/000-index.md

---

## Purpose

This section defines the AsBeez chart of accounts, including classification, hierarchy, numbering, account types, country-specific and multi-currency accounts, lifecycle, and governance.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-account-classification.md](002-account-classification.md) - Account Classification
- [003-account-hierarchy.md](003-account-hierarchy.md) - Account Hierarchy
- [004-account-numbering.md](004-account-numbering.md) - Account Numbering
- [005-asset-accounts.md](005-asset-accounts.md) - Asset Accounts
- [006-liability-accounts.md](006-liability-accounts.md) - Liability Accounts
- [007-equity-accounts.md](007-equity-accounts.md) - Equity Accounts
- [008-revenue-accounts.md](008-revenue-accounts.md) - Revenue Accounts
- [009-expense-accounts.md](009-expense-accounts.md) - Expense Accounts
- [010-contra-accounts.md](010-contra-accounts.md) - Contra Accounts
- [011-clearing-accounts.md](011-clearing-accounts.md) - Clearing Accounts
- [012-suspense-accounts.md](012-suspense-accounts.md) - Suspense Accounts
- [013-country-specific-accounts.md](013-country-specific-accounts.md) - Country Specific Accounts
- [014-multi-currency-accounts.md](014-multi-currency-accounts.md) - Multi Currency Accounts
- [015-account-lifecycle.md](015-account-lifecycle.md) - Account Lifecycle
- [016-account-governance.md](016-account-governance.md) - Account Governance
- [017-future-roadmap.md](017-future-roadmap.md) - Future Roadmap
- [018-account-dimensions.md](018-account-dimensions.md) - Account Dimensions

## Design Authority

The chart of accounts is governed by the Financial Domain Model. Account definitions classify monetary meaning; reporting dimensions carry legal entity, country, currency, product, channel, program, and counterparty context. The General Ledger remains the authority for posted entries, while this folder governs the account vocabulary and lifecycle.

## Implementation Sequence

1. Approve legal entities, jurisdictions, currencies, and reporting requirements.
2. Define account classes, families, hierarchy, and numbering.
3. Define required dimensions and validation by account family.
4. Publish the initial account register and mappings.
5. Configure lifecycle, governance, migration, and period-close controls.
6. Connect posting rules to payments, billing, settlement, tax, rewards, and reconciliation.
