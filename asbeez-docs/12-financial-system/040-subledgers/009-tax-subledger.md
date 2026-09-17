# Tax Subledger

> **Document:** 12-financial-system/040-subledgers/009-tax-subledger.md

---

## Purpose

The Tax Subledger records tax determinations, collected amounts, recoverable amounts, withholding, exemptions, adjustments, filings, and remittances by transaction and jurisdiction.

## Required Detail

Assessment ID, transaction/order/invoice, legal entity, seller and customer jurisdiction, tax authority, tax type, taxable basis, rate, amount, currency, exemption evidence, rule version, collection status, remittance period, and adjustment history.

## Rules

Tax collected for an authority is not AsBeez revenue. Tax treatment is determined by approved jurisdictional policy and may differ by product, vendor, customer location, marketplace role, and transaction type. Corrections reference the original assessment and never overwrite filed or posted evidence.

## Reconciliation

Tax totals reconcile among invoice/order lines, payment and settlement allocations, tax payable accounts, filings, and remittance confirmations. Unfiled, unpaid, disputed, or unmatched tax remains explicitly classified.

## Related Documents

- [000-index.md](000-index.md)
- [006-customer-subledger.md](006-customer-subledger.md)
- [015-country-subledger.md](015-country-subledger.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
