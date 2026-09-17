# Invoice Management

> **Document:** 12-financial-system/380-administration/009-invoice-management.md

---

## Purpose

Invoice administration manages drafts, numbering, lines, tax, discounts, issue/delivery, payment application, overdue state, credit/debit notes, voids, and document evidence.

## Permitted Actions

Review/create draft, calculate, issue, send/resend, apply payment, request note/adjustment, and investigate delivery or tax exceptions under entity/country and role scope.

## Rules

Issued invoices are immutable except through approved notes or adjustments. Administrators cannot change historical totals, tax decisions, legal entity, document hash, revenue recognition, or payment status directly. Numbering, snapshots, access, delivery, retention, and audit are mandatory.

## Related Documents

- [000-index.md](000-index.md)
- [007-payment-management.md](007-payment-management.md)
- [012-tax-management.md](012-tax-management.md)
- [../300-data-model/008-invoice-schema.md](../300-data-model/008-invoice-schema.md)
