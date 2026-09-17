# Invoice Payment Status

> **Document:** 12-financial-system/090-invoicing/012-invoice-payment-status.md

---

## Purpose

Invoice payment status describes how much of an invoice has been allocated to confirmed payments, credits, refunds, disputes, or unapplied funds.

## States

```text
Issued -> Partially Paid -> Paid
Issued -> Overdue -> Paid
Issued -> Disputed | Written Off | Void
```

## Rules

- payment allocation references payment/capture/provider evidence;
- authorization or payment intent is not payment allocation;
- pending, failed, disputed, or unknown payments do not become confirmed paid;
- credit notes and refunds reduce collectible or paid amounts according to policy;
- payment status does not itself recognize revenue, vendor settlement, or rewards; and
- unapplied cash remains separately identified until allocated.

## Related Documents

- [000-index.md](000-index.md)
- [004-invoice-numbering.md](004-invoice-numbering.md)
- [012-invoice-payment-status.md](012-invoice-payment-status.md)
- [013-invoice-delivery.md](013-invoice-delivery.md)
