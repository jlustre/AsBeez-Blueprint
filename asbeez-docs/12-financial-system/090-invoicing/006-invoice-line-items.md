# Invoice Line Items

> **Document:** 12-financial-system/090-invoicing/006-invoice-line-items.md

---

## Purpose

Invoice lines are the auditable components of an invoice total and must preserve the commercial source and financial treatment of each item.

## Required Fields

Line ID, source order/contract/subscription, product or service, vendor where applicable, description, quantity, unit, unit price, gross extension, discount, taxable basis, tax, fee, net amount, currency, revenue/receivable mapping, and reporting dimensions.

## AsBeez Allocation

Marketplace lines distinguish customer charge, vendor entitlement, platform fee, partner allocation, tax, reserve, and approved reward financial effect. RP, ABC, AHC, matrix, or referral display values are not invoice monetary lines unless an approved conversion or billable service creates that amount.

## Rules

Line totals are calculated server-side, rounded under currency policy, and preserved after issuance. Partial refund, credit, or debit references specific lines and cannot exceed the eligible line amount.

## Related Documents

- [000-index.md](000-index.md)
- [005-invoice-generation.md](005-invoice-generation.md)
- [007-invoice-tax-calculation.md](007-invoice-tax-calculation.md)
- [008-invoice-discounts.md](008-invoice-discounts.md)
