# Tax Jurisdictions

> **Document:** 12-financial-system/160-taxes/003-tax-jurisdictions.md

---

## Purpose

Tax jurisdictions identify the authority and geographic/legal context used to determine, collect, withhold, file, and remit tax.

## Required Data

Jurisdiction ID, country/region, authority, tax types, registration thresholds, rates/rules, filing periods, currency, entity scope, place-of-supply rules, effective dates, provider, and policy owner.

## Rules

Country alone does not always determine jurisdiction. Customer, vendor, partner, issuer, fulfillment, service location, product category, registration, and legal entity facts may apply. A jurisdiction configuration is versioned and cannot be changed for historical assessments.

## Launch Gate

No country or tax type is enabled for production invoicing, settlement, withholding, or reporting until Tax, Legal, Finance, and Compliance approve registration, rules, evidence, filing, remittance, and retention requirements.

## Related Documents

- [000-index.md](000-index.md)
- [010-tax-registration.md](010-tax-registration.md)
- [011-tax-calculation.md](011-tax-calculation.md)
- [015-tax-reporting.md](015-tax-reporting.md)
