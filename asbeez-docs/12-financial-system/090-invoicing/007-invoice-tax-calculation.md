# Invoice Tax Calculation

> **Document:** 12-financial-system/090-invoicing/007-invoice-tax-calculation.md

---

## Purpose

Invoice tax calculation determines tax basis, jurisdiction, rate, exemptions, collection, and disclosure for each taxable invoice line under effective policy.

## Inputs

Issuer and customer location, vendor/platform role, product/service category, place of supply, tax registration, exemption evidence, price/discount, currency, invoice type, tax authority, and rule/version.

## Rules

- tax is calculated per applicable line and authority;
- tax collected for an authority is not AsBeez revenue;
- discounts and refunds affect tax only according to jurisdictional policy;
- tax result stores basis, rate, amount, authority, evidence, and effective date; and
- missing or stale jurisdiction facts block issuance or mark the invoice for review.

## Corrections

Issued tax errors use credit/debit notes, amended invoices, or approved adjustments. Original assessment and invoice evidence remain immutable and reconcile to tax subledger and payable accounts.

## Related Documents

- [000-index.md](000-index.md)
- [006-invoice-line-items.md](006-invoice-line-items.md)
- [008-invoice-discounts.md](008-invoice-discounts.md)
- [016-invoice-compliance.md](016-invoice-compliance.md)
