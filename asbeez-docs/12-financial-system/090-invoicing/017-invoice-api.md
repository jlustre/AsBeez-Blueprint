# Invoice API

> **Document:** 12-financial-system/090-invoicing/017-invoice-api.md

---

## Purpose

The Invoice API exposes authenticated invoice views and controlled commands without allowing clients to write totals, issue numbers, tax, payment status, or accounting mappings directly.

## Read Operations

- retrieve draft/issued invoice, lines, taxes, discounts, notes, payment allocation, delivery, and compliance status;
- retrieve localized representations and statement history; and
- retrieve customer/vendor/partner-safe balances and source references.

## Commands

Create draft, review, issue, void, generate credit/debit note, allocate confirmed payment, request delivery, cancel schedule, and submit correction. Commands require authorization, idempotency, server-side calculation, entity/country policy, and audit correlation.

## Rules

Clients cannot alter issued invoices, supply final totals, bypass tax/numbering, mark payment confirmed, or create reward/vendor/partner effects through invoice fields. API responses distinguish draft, issued, delivered, partially paid, paid, overdue, void, disputed, and uncollectible.

## Related Documents

- [000-index.md](000-index.md)
- [002-invoice-domain-model.md](002-invoice-domain-model.md)
- [005-invoice-generation.md](005-invoice-generation.md)
- [016-invoice-compliance.md](016-invoice-compliance.md)
