# Order Cancellations

> **Document:** 12-financial-system/130-refunds-returns-and-cancellations/006-order-cancellations.md

---

## Purpose

Order cancellation stops or changes an order before the applicable fulfillment, service, payment, settlement, or recognition milestone. It is not automatically a refund, although it may trigger one.

## Rules

- cancellation scope and actor/reason are recorded;
- payment authorization, capture, invoice, tax, vendor, partner, reserve, reward, and revenue effects are evaluated separately;
- captured funds require refund, credit, or approved alternative treatment;
- unfulfilled vendor/partner obligations are cancelled or adjusted through settlement workflow; and
- RP, ABC, matrix, and AHC events are not deleted and are evaluated for reversal/hold under reward policy.

## States

```text
Requested -> Approved -> Cancelled -> Reconciled
Requested -> Rejected | Requires Review
```

## Related Documents

- [000-index.md](000-index.md)
- [003-refund-eligibility.md](003-refund-eligibility.md)
- [007-return-accounting.md](007-return-accounting.md)
- [013-refund-reconciliation.md](013-refund-reconciliation.md)
