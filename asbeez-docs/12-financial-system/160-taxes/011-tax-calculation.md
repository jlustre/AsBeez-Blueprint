# Tax Calculation

> **Document:** 12-financial-system/160-taxes/011-tax-calculation.md

---

## Purpose

Tax calculation determines taxable basis, jurisdiction, tax type, rate, exemption, collection/withholding, rounding, and authority for each applicable source line.

## Inputs

Issuer/entity, customer/vendor/partner/payee, locations, product/service category, order/invoice/settlement, price/discount/fee, registration, exemption, currency, authority, and effective rule/provider version.

## Rules

- calculate per line and authority where required;
- preserve basis, rate, amount, currency, rule, evidence, and effective time;
- tax is not AsBeez revenue or reward value;
- refunds, returns, chargebacks, discounts, cancellations, notes, and withholding create explicit recalculations; and
- missing facts block or route to tax review rather than silently guessing.

## Related Documents

- [000-index.md](000-index.md)
- [003-tax-jurisdictions.md](003-tax-jurisdictions.md)
- [009-tax-exemptions.md](009-tax-exemptions.md)
- [012-tax-rounding.md](012-tax-rounding.md)
