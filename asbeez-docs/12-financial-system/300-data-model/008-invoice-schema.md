# Invoice Schema

> **Document:** 12-financial-system/300-data-model/008-invoice-schema.md

---

## Purpose

Invoice data records a legally and operationally meaningful request for payment, its lines, tax, discounts, adjustments, delivery, and settlement status.

## Core Fields

`invoice_id`, `invoice_number`, `invoice_type`, `issuer_entity_id`, `customer_id`, `vendor_id`, `partner_id`, `order_id`, `currency`, `issue_date`, `due_date`, `status`, `subtotal_minor`, `discount_minor`, `tax_minor`, `total_minor`, `amount_paid_minor`, `amount_due_minor`, `country_code`, `tax_jurisdiction`, `billing_address_snapshot`, `template_version`, and `legal_document_hash`.

## Invoice Lines

Each line stores description, product/service reference, quantity, unit minor amount, net amount, discount allocation, tax code/rate, tax amount, revenue classification, vendor/partner allocation, and source order reference. Historical descriptions, prices, addresses, and tax decisions are snapshots.

## Rules

Issued invoices are immutable except through credit notes, debit notes, voiding, or approved adjustments. Invoice status does not itself recognize revenue or prove payment. Numbering is unique within legal entity and document series.

## Related Documents

- [000-index.md](000-index.md)
- [006-payment-schema.md](006-payment-schema.md)
- [011-tax-schema.md](011-tax-schema.md)
- [../090-invoicing/001-overview.md](../090-invoicing/001-overview.md)
