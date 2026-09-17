# Invoice Discounts

> **Document:** 12-financial-system/090-invoicing/008-invoice-discounts.md

---

## Purpose

Invoice discounts reduce a line or invoice amount under an approved commercial, vendor, promotion, subscription, or customer policy.

## Required Data

Discount ID, source campaign/program, beneficiary, scope, amount or rate, eligibility, funding owner, tax treatment, currency, validity, stacking rule, and approval.

## AsBeez Rules

Vendor-funded, platform-funded, partner-funded, and reward-funded promotions are distinct. RP, ABC, and AHC are not invoice discounts unless an approved conversion makes them a monetary tender or credit. A discount cannot conceal vendor entitlement, tax collected, partner obligation, or reward liability.

## Controls

Discounts are calculated server-side, visible on invoice lines, bounded by policy, and retained after issuance. Refunds and credit notes reverse the relevant discount treatment under the applicable tax and funding rules.

## Related Documents

- [000-index.md](000-index.md)
- [006-invoice-line-items.md](006-invoice-line-items.md)
- [007-invoice-tax-calculation.md](007-invoice-tax-calculation.md)
- [009-invoice-adjustments.md](009-invoice-adjustments.md)
