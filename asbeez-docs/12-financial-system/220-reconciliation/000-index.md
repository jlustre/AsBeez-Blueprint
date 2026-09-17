# Reconciliation

> **Document:** 12-financial-system/220-reconciliation/000-index.md

---

## Purpose

This section defines reconciliation across ledgers, banks, payment providers, wallets, rewards, vendors, partners, tax, reserves, and countries, including rules, exceptions, discrepancy resolution, approvals, reporting, APIs, events, and AI capabilities.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-reconciliation-domain-model.md](002-reconciliation-domain-model.md) - Reconciliation Domain Model
- [003-ledger-to-subledger.md](003-ledger-to-subledger.md) - Ledger To Subledger
- [004-bank-reconciliation.md](004-bank-reconciliation.md) - Bank Reconciliation
- [005-payment-provider-reconciliation.md](005-payment-provider-reconciliation.md) - Payment Provider Reconciliation
- [006-wallet-reconciliation.md](006-wallet-reconciliation.md) - Wallet Reconciliation
- [007-reward-reconciliation.md](007-reward-reconciliation.md) - Reward Reconciliation
- [008-vendor-reconciliation.md](008-vendor-reconciliation.md) - Vendor Reconciliation
- [009-partner-reconciliation.md](009-partner-reconciliation.md) - Partner Reconciliation
- [010-tax-reconciliation.md](010-tax-reconciliation.md) - Tax Reconciliation
- [011-reserve-reconciliation.md](011-reserve-reconciliation.md) - Reserve Reconciliation
- [012-cross-country-reconciliation.md](012-cross-country-reconciliation.md) - Cross Country Reconciliation
- [013-reconciliation-rules.md](013-reconciliation-rules.md) - Reconciliation Rules
- [014-exceptions.md](014-exceptions.md) - Exceptions
- [015-discrepancy-resolution.md](015-discrepancy-resolution.md) - Discrepancy Resolution
- [016-reconciliation-approvals.md](016-reconciliation-approvals.md) - Reconciliation Approvals
- [017-reconciliation-reporting.md](017-reconciliation-reporting.md) - Reconciliation Reporting
- [018-reconciliation-api.md](018-reconciliation-api.md) - Reconciliation API
- [019-reconciliation-events.md](019-reconciliation-events.md) - Reconciliation Events
- [020-reconciliation-ai-capabilities.md](020-reconciliation-ai-capabilities.md) - Reconciliation AI Capabilities
- [021-future-roadmap.md](021-future-roadmap.md) - Future Roadmap

## Design Authority

Reconciliation owns matching, control totals, exceptions, discrepancy resolution, approvals, and certification. Source domains, external providers, subledgers, Treasury, Tax, Rewards, Vendor/Partner Finance, Reserves, and the General Ledger provide authoritative facts that reconciliation compares but does not rewrite.

## Implementation Sequence

1. Approve scopes, source/target systems, periods, currencies, entities, rules, tolerances, owners, and materiality.
2. Implement population imports, control totals, matching, timing differences, exceptions, resolution, and approval.
3. Connect GL/subledgers, providers, banks, wallets, rewards, vendors, partners, taxes, reserves, FX, treasury, budgets, and close.
4. Implement reporting, API, events, security, audit, continuous reconciliation, and governed AI.
