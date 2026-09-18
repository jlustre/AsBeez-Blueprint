# Vendor API

## Purpose

The Vendor API supports onboarding, verification, storefront, products/services, pricing, promotions, orders, fulfillment, customer support, earnings, fees, tax, reserves, statements, settlement, and payout requests.

## Scope and Controls

Vendor resources are scoped to vendor, organization, legal entity, country, currency, role, agreement, and status. KYB/compliance, prohibited-product, tax, payout destination, reserve, risk, and agreement controls apply before activation or disbursement.

## Financial Boundary

Vendor APIs expose pending/available/held/reserved/settled earnings, fees, tax, statements, and payout status from authorized projections. Vendors cannot write balances, mark orders settled, change fee/tax/accounting treatment, release reserves, or mark payouts paid. Financial commands use idempotency and reconciliation.

## Related Documents

- [index.md](index.md)
- [003-commerce-api.md](003-commerce-api.md)
- [008-admin-api.md](008-admin-api.md)
- [../14-legal-compliance/008-vendor-agreement.md](../14-legal-compliance/008-vendor-agreement.md)
