# Tax Events

> **Document:** 12-financial-system/320-events/011-tax-events.md

---

## Purpose

Tax events communicate jurisdiction, registration, classification, calculation, exemption, collection, withholding, adjustment, filing, remittance, and reconciliation facts.

## Event Catalog

`TaxCalculationRequested`, `TaxCalculated`, `TaxExemptionValidated`, `TaxCollected`, `TaxWithheld`, `TaxAdjusted`, `TaxFilingPrepared`, `TaxRemitted`, `TaxProviderObserved`, and `TaxReconciled`.

## Payload and Rules

Events include source, taxable amount/currency, tax amount, type/code/rate, jurisdiction, entity/country, address/classification snapshot, registration, exemption, calculation/policy version, rounding, provider reference, and ledger/tax payable reference. Tax collected or withheld is not revenue. Historical tax decisions are not overwritten.

## Related Documents

- [000-index.md](000-index.md)
- [008-invoice-events.md](008-invoice-events.md)
- [009-refund-events.md](009-refund-events.md)
- [../300-data-model/011-tax-schema.md](../300-data-model/011-tax-schema.md)
