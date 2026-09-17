# Credit Notes

> **Document:** 12-financial-system/090-invoicing/010-credit-notes.md

---

## Purpose

A credit note reduces an issued invoice or records an approved credit due to a customer, vendor, partner, member, or other recipient.

## Required Data

Credit note ID/number, original invoice and lines, reason, amount, currency, tax treatment, recipient, refund/payment allocation, issuer, approval, issue date, and delivery evidence.

## Rules

Credit notes are immutable after issue and cannot exceed the original collectible scope unless a documented correction policy permits it. A credit note does not itself prove a cash refund; payment/refund execution remains separate. Reward, vendor, partner, tax, and revenue consequences are evaluated independently.

## Accounting and Allocation

The note references the affected receivable, payment allocation, tax assessment, vendor/partner settlement, reward effect, and General Ledger adjustment where applicable. A credit may reduce an amount due, create a customer credit, or support a refund workflow; the resulting state is reconciled separately from document issuance.

## Related Documents

- [000-index.md](000-index.md)
- [009-invoice-adjustments.md](009-invoice-adjustments.md)
- [011-debit-notes.md](011-debit-notes.md)
- [012-invoice-payment-status.md](012-invoice-payment-status.md)
