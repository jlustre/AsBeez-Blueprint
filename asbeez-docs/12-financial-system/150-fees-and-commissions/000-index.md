# Fees And Commissions

> **Document:** 12-financial-system/150-fees-and-commissions/000-index.md

---

## Purpose

This section defines platform fees and commissions, including transaction, subscription, listing, service, payment processing, withdrawal, FX, partner, vendor, and referral commissions, plus calculation, allocation, reconciliation, and reporting.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-fee-domain-model.md](002-fee-domain-model.md) - Fee Domain Model
- [003-platform-fees.md](003-platform-fees.md) - Platform Fees
- [004-transaction-fees.md](004-transaction-fees.md) - Transaction Fees
- [005-subscription-fees.md](005-subscription-fees.md) - Subscription Fees
- [006-listing-fees.md](006-listing-fees.md) - Listing Fees
- [007-service-fees.md](007-service-fees.md) - Service Fees
- [008-payment-processing-fees.md](008-payment-processing-fees.md) - Payment Processing Fees
- [009-withdrawal-fees.md](009-withdrawal-fees.md) - Withdrawal Fees
- [010-foreign-exchange-fees.md](010-foreign-exchange-fees.md) - Foreign Exchange Fees
- [011-partner-commissions.md](011-partner-commissions.md) - Partner Commissions
- [012-vendor-commissions.md](012-vendor-commissions.md) - Vendor Commissions
- [013-referral-commissions.md](013-referral-commissions.md) - Referral Commissions
- [014-fee-calculation.md](014-fee-calculation.md) - Fee Calculation
- [015-fee-allocation.md](015-fee-allocation.md) - Fee Allocation
- [016-fee-reconciliation.md](016-fee-reconciliation.md) - Fee Reconciliation
- [017-fee-reporting.md](017-fee-reporting.md) - Fee Reporting
- [018-future-roadmap.md](018-future-roadmap.md) - Future Roadmap

## Design Authority

Orders, Payments, Subscriptions, Vendors, Partners, and Rewards provide source events. Fees and Commissions own calculation and allocation policy; Invoicing owns formal amounts due; Settlement owns obligations; Payouts execute approved transfers; Tax owns tax effects; and the General Ledger records posted monetary results.

## Implementation Sequence

1. Approve fee/commission types, plans, payers, beneficiaries, countries, entities, currencies, tax, funding, and recognition rules.
2. Implement deterministic calculation, allocation, disclosure, invoicing, and correction.
3. Connect vendors, partners, referrals, payments, subscriptions, rewards, reserves, wallets, settlement, and GL.
4. Implement reconciliation, reporting, APIs, events, security, audit, and governed AI assistance.
