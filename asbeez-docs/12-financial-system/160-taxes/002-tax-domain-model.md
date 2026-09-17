# Tax Domain Model

> **Document:** 12-financial-system/160-taxes/002-tax-domain-model.md

---

## Purpose

The Tax domain models jurisdictions, registrations, tax rules, assessments, exemptions, tax lines, withholding, filings, remittances, adjustments, and evidence.

## Entities

| Entity | Responsibility |
| --- | --- |
| Tax Jurisdiction | authority, geography, registration, and effective rules |
| Tax Registration | AsBeez/vendor/partner registration and status |
| Tax Rule | taxable basis, rate, category, place of supply, and dates |
| Tax Assessment | calculated amount, authority, evidence, and source |
| Tax Exemption | eligible party/transaction and proof |
| Withholding Assessment | amount withheld from approved payable |
| Filing | period, return, population, approval, and submission |
| Remittance | payment to authority and confirmation |

## Invariants

- every tax amount has authority, basis, rate, currency, source, and effective policy;
- tax collected/withheld is not AsBeez revenue;
- an exemption requires evidence and expiry/review;
- corrections reference original assessments and filings;
- tax payable maps to entity, country, currency, and GL control account; and
- stale or missing jurisdiction facts block or route the transaction to review.

## Related Documents

- [000-index.md](000-index.md)
- [003-tax-jurisdictions.md](003-tax-jurisdictions.md)
- [011-tax-calculation.md](011-tax-calculation.md)
- [016-tax-reconciliation.md](016-tax-reconciliation.md)
