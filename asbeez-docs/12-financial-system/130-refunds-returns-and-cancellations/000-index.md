# Refunds Returns And Cancellations

> **Document:** 12-financial-system/130-refunds-returns-and-cancellations/000-index.md

---

## Purpose

This section defines refund, return, and cancellation accounting, including eligibility, full and partial refunds, order cancellations, payment routing, wallet refunds, reward reversals, vendor adjustments, fees, reconciliation, fraud controls, APIs, events, and AI capabilities.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-refund-domain-model.md](002-refund-domain-model.md) - Refund Domain Model
- [003-refund-eligibility.md](003-refund-eligibility.md) - Refund Eligibility
- [004-full-refunds.md](004-full-refunds.md) - Full Refunds
- [005-partial-refunds.md](005-partial-refunds.md) - Partial Refunds
- [006-order-cancellations.md](006-order-cancellations.md) - Order Cancellations
- [007-return-accounting.md](007-return-accounting.md) - Return Accounting
- [008-refund-payment-routing.md](008-refund-payment-routing.md) - Refund Payment Routing
- [009-wallet-refunds.md](009-wallet-refunds.md) - Wallet Refunds
- [010-reward-reversals.md](010-reward-reversals.md) - Reward Reversals
- [011-vendor-adjustments.md](011-vendor-adjustments.md) - Vendor Adjustments
- [012-refund-fees.md](012-refund-fees.md) - Refund Fees
- [013-refund-reconciliation.md](013-refund-reconciliation.md) - Refund Reconciliation
- [014-refund-fraud-controls.md](014-refund-fraud-controls.md) - Refund Fraud Controls
- [015-refund-api.md](015-refund-api.md) - Refund API
- [016-refund-events.md](016-refund-events.md) - Refund Events
- [017-refund-ai-capabilities.md](017-refund-ai-capabilities.md) - Refund AI Capabilities
- [018-future-roadmap.md](018-future-roadmap.md) - Future Roadmap

## Design Authority

Orders and Invoicing provide commercial and amounts-due facts, Payments provide funding/execution evidence, Refund Finance owns refund decisions and corrections, Wallets own wallet credits, Rewards own reward status, Vendor/Partner Finance own downstream obligations, Tax owns tax adjustments, and the General Ledger records posted monetary effects.

## Implementation Sequence

1. Approve refund, return, cancellation, payment, tax, consumer, vendor, partner, reward, wallet, and country policies.
2. Implement typed requests, eligibility, approval, full/partial scope, return, cancellation, and payment routing.
3. Implement wallet/credit-note execution, reward reversals, vendor/partner adjustments, fees, fraud, and reconciliation.
4. Implement APIs, events, security, audit, reporting, support, and governed AI assistance.
