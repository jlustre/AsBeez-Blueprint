# Tax Schema

> **Document:** 12-financial-system/300-data-model/011-tax-schema.md

---

## Purpose

Tax data records jurisdiction, registration, classification, calculation, collection, withholding, exemption, remittance, and reporting facts.

## Core Fields

`tax_transaction_id`, `source_type`, `source_id`, `entity_id`, `country_code`, `jurisdiction_id`, `tax_type`, `tax_code`, `registration_reference`, `taxable_minor`, `rate`, `tax_minor`, `currency`, `exemption_reference`, `withholding_party`, `provider_reference`, `calculation_version`, `effective_at`, and `status`.

## Rules

Tax decisions are versioned and retain input address, customer/vendor classification, product/service classification, nexus/registration, rate, rounding, exemption, and provider evidence. Tax collected or withheld is not AsBeez revenue. Tax amounts map to payable, receivable, or withholding accounts and reconcile to filings/remittance.

## Corrections

Tax changes use credit/debit notes, adjustments, or compensating financial effects. Historical tax calculations are never overwritten.

## Related Documents

- [000-index.md](000-index.md)
- [008-invoice-schema.md](008-invoice-schema.md)
- [009-refund-schema.md](009-refund-schema.md)
- [../160-taxes/001-overview.md](../160-taxes/001-overview.md)
