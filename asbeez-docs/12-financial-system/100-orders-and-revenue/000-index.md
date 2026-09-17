# Orders And Revenue

> **Document:** 12-financial-system/100-orders-and-revenue/000-index.md

---

## Purpose

This section defines order financial models and revenue concepts, including GMV, net revenue, platform fees, vendor and partner revenue, subscription and service revenue, recognition, deferred and accrued revenue, settlement, reconciliation, and reporting.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-order-financial-model.md](002-order-financial-model.md) - Order Financial Model
- [003-gross-merchandise-value.md](003-gross-merchandise-value.md) - Gross Merchandise Value
- [004-net-revenue.md](004-net-revenue.md) - Net Revenue
- [005-platform-fees.md](005-platform-fees.md) - Platform Fees
- [006-vendor-revenue.md](006-vendor-revenue.md) - Vendor Revenue
- [007-partner-revenue.md](007-partner-revenue.md) - Partner Revenue
- [008-subscription-revenue.md](008-subscription-revenue.md) - Subscription Revenue
- [009-service-revenue.md](009-service-revenue.md) - Service Revenue
- [010-advertising-revenue.md](010-advertising-revenue.md) - Advertising Revenue
- [011-revenue-recognition.md](011-revenue-recognition.md) - Revenue Recognition
- [012-deferred-revenue.md](012-deferred-revenue.md) - Deferred Revenue
- [013-accrued-revenue.md](013-accrued-revenue.md) - Accrued Revenue
- [014-unearned-revenue.md](014-unearned-revenue.md) - Unearned Revenue
- [015-order-settlement.md](015-order-settlement.md) - Order Settlement
- [016-revenue-reconciliation.md](016-revenue-reconciliation.md) - Revenue Reconciliation
- [017-revenue-reporting.md](017-revenue-reporting.md) - Revenue Reporting
- [018-future-roadmap.md](018-future-roadmap.md) - Future Roadmap

## Design Authority

Orders provide commercial source facts, Invoicing provides formal amounts due, Payments provide funding evidence, Tax provides assessments, Vendor/Partner and Customer subledgers provide obligations, Reward Finance provides reward treatment, Settlement calculates amounts owed, and the General Ledger records posted monetary effects. GMV and operational order measures are not automatically AsBeez revenue.

## Implementation Sequence

1. Approve revenue streams, entities, countries, currencies, principal/agent treatment, and policies.
2. Implement order financial components, GMV definitions, fees, vendor/partner allocations, tax, and reward boundaries.
3. Implement invoice/payment links, revenue recognition, deferred/accrued/unearned schedules, and adjustments.
4. Implement settlement, reconciliation, reporting, period close, and audit evidence.
5. Add recurring, advertising, localization, forecasting, and governed partner integrations.
