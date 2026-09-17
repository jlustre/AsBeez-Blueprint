# Invoice Generation

> **Document:** 12-financial-system/090-invoicing/005-invoice-generation.md

---

## Purpose

Invoice generation transforms an approved order, subscription, service, settlement, or other source into a calculated draft and, after review, an issued invoice.

## Generation Steps

1. load source snapshot and contract/order references;
2. determine issuer, recipient, entity, country, currency, terms, and invoice type;
3. calculate lines, tax, discounts, fees, and adjustments;
4. validate totals, numbering, policy, and compliance;
5. assign issued number and immutable version;
6. create receivable and accounting instructions where policy requires; and
7. deliver and record delivery evidence.

## Rules

Invoice generation cannot accept client-supplied totals as authoritative. It does not capture payment, create RP/ABC/AHC, settle vendors/partners, or recognize revenue unless the relevant workflow publishes an approved accounting event.

## Related Documents

- [000-index.md](000-index.md)
- [004-invoice-numbering.md](004-invoice-numbering.md)
- [006-invoice-line-items.md](006-invoice-line-items.md)
- [012-invoice-payment-status.md](012-invoice-payment-status.md)
