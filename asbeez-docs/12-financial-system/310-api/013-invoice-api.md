# Invoice API

> **Document:** 12-financial-system/310-api/013-invoice-api.md

---

## Purpose

The Invoice API exposes invoice creation requests, drafts, issued documents, lines, tax, discounts, notes, delivery, payment status, and legally controlled adjustments.

## Queries

Retrieve invoice by scoped number/ID, lines, totals, tax, discount, due status, delivery, payment allocation, credit/debit notes, and source order/customer/vendor/partner references.

## Commands

Create draft, calculate, issue, send, resend, void before legal lock, request credit/debit note, apply payment, or dispute an invoice. Server controls numbering, tax, totals, currency, legal entity, document version, and customer data.

## Rules

Issued invoices are immutable except through approved notes or adjustments. Invoice status does not independently recognize revenue or prove payment. Access is scoped by entity, country, relationship, and authorization.

## Related Documents

- [000-index.md](000-index.md)
- [004-request-response-standards.md](004-request-response-standards.md)
- [016-tax-api.md](016-tax-api.md)
- [../300-data-model/008-invoice-schema.md](../300-data-model/008-invoice-schema.md)
- [../090-invoicing/001-overview.md](../090-invoicing/001-overview.md)
