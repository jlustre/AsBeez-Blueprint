# Recurring Invoices

> **Document:** 12-financial-system/090-invoicing/014-recurring-invoices.md

---

## Purpose

Recurring invoices are generated from an approved subscription or service schedule with defined period, price, tax, discount, renewal, payment, and cancellation rules.

## Required Schedule

Schedule ID, contract/subscription, customer/vendor, issuer/entity, country, currency, product/service, billing interval, service period, price version, tax policy, discount, payment terms, retry, renewal, pause, and cancellation.

## Rules

Each cycle creates a distinct invoice and source snapshot. A failed payment does not silently extend service or create rewards. Price, tax, country, or policy changes apply from their effective cycle and do not rewrite prior invoices. Cancellation and proration use explicit adjustments or credit/debit notes.

## Related Documents

- [000-index.md](000-index.md)
- [005-invoice-generation.md](005-invoice-generation.md)
- [012-invoice-payment-status.md](012-invoice-payment-status.md)
- [016-invoice-compliance.md](016-invoice-compliance.md)
