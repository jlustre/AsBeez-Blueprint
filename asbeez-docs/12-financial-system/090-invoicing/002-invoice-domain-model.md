# Invoice Domain Model

> **Document:** 12-financial-system/090-invoicing/002-invoice-domain-model.md

---

## Purpose

The Invoice domain models formal amounts due, lines, taxes, discounts, adjustments, notes, payment allocations, delivery, status, and compliance evidence.

## Entities

| Entity | Responsibility |
| --- | --- |
| Invoice | issuer, recipient, total, currency, status, due terms |
| Invoice Line | product/service, quantity, price, tax, discount, source |
| Tax Line | jurisdiction, basis, rate, amount, rule evidence |
| Payment Allocation | link between invoice amount and payment/credit |
| Credit Note | reduction or return applied to an invoice |
| Debit Note | approved increase or additional amount due |
| Delivery Record | channel, recipient, timestamp, delivery outcome |

## Invariants

- invoice total equals line extensions plus tax, fees, discounts, and adjustments;
- issued invoices cannot be edited or deleted;
- credit/debit notes reference the original invoice;
- payment allocation cannot exceed collectible amount;
- amount, currency, entity, country, tax, and numbering are explicit; and
- an invoice does not imply payment, revenue, settlement, or reward qualification.

## Lifecycle

```text
Draft -> Reviewed -> Issued -> Partially Paid -> Paid
Draft -> Cancelled
Issued -> Void | Uncollectible
```

## Related Documents

- [000-index.md](000-index.md)
- [003-invoice-types.md](003-invoice-types.md)
- [006-invoice-line-items.md](006-invoice-line-items.md)
- [012-invoice-payment-status.md](012-invoice-payment-status.md)
