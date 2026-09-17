# Order Settlement

> **Document:** 12-financial-system/100-orders-and-revenue/015-order-settlement.md

---

## Purpose

Order settlement calculates and approves what each vendor, partner, platform fund, tax authority, or other participant is owed from an order or batch after payment, fees, tax, refunds, disputes, reserves, holds, and approved reward effects.

## Settlement Components

Gross customer consideration, tax, vendor entitlement, platform fee, partner commission, refund/chargeback, reserve, hold, reward financial effect, payout fee, and net payable are separately identified.

## Lifecycle

```text
Calculated -> Reviewed -> Approved -> Payable -> Paid/Settled
Calculated -> Held | Rejected | Adjusted
```

## Rules

Settlement is not revenue recognition and payout is not settlement calculation. A cancelled, returned, disputed, or refunded order creates linked adjustments. The order allocation must reconcile to captured/invoiced source amount, with residual clearing explicitly owned.

## Related Documents

- [000-index.md](000-index.md)
- [002-order-financial-model.md](002-order-financial-model.md)
- [006-vendor-revenue.md](006-vendor-revenue.md)
- [016-revenue-reconciliation.md](016-revenue-reconciliation.md)
