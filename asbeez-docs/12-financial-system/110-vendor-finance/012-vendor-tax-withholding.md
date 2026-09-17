# Vendor Tax Withholding

> **Document:** 12-financial-system/110-vendor-finance/012-vendor-tax-withholding.md

---

## Purpose

Vendor tax withholding records amounts withheld from an approved vendor payable under country, entity, vendor status, tax residency, and authority rules.

## Required Data

Vendor, tax ID/residency, jurisdiction, authority, tax type, taxable basis, rate, amount, currency, exemption/evidence, settlement/payout, filing period, remittance, and policy version.

## Rules

Withholding is not AsBeez revenue and is not an arbitrary vendor fee. It is calculated from approved tax policy, disclosed where required, withheld from settlement/payout, posted to tax payable, and reconciled to filings and remittance evidence.

## Corrections

Incorrect withholding uses an amended assessment, credit/debit adjustment, or controlled correction referencing the original settlement. Historical withholding and filing evidence remain immutable.

## Related Documents

- [000-index.md](000-index.md)
- [008-vendor-settlement.md](008-vendor-settlement.md)
- [014-vendor-reconciliation.md](014-vendor-reconciliation.md)
- [015-vendor-financial-reporting.md](015-vendor-financial-reporting.md)
