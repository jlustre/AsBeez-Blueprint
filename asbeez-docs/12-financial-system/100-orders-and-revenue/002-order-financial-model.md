# Order Financial Model

> **Document:** 12-financial-system/100-orders-and-revenue/002-order-financial-model.md

---

## Purpose

The Order Financial Model decomposes an AsBeez order into customer consideration, tax, discounts, vendor entitlement, partner allocation, platform fees, reserves, reward effects, payment, settlement, and revenue recognition.

## Order Financial Components

| Component | Meaning |
| --- | --- |
| Gross customer consideration | amount charged before discounts, refunds, and tax treatment |
| Tax | amount collected or payable for an authority |
| Vendor entitlement | amount owed to the vendor under settlement rules |
| Partner allocation | approved referral or partner obligation |
| Platform fee | amount earned by AsBeez for an approved service |
| Reserve/hold | restricted amount protecting a defined exposure |
| Reward effect | RP/ABC/AHC event and any approved monetary treatment |
| Payment | funding state and provider evidence |
| Revenue | amount recognized as earned under policy |

## Lifecycle

```text
Order Created -> Priced -> Invoiced/Payment Requested -> Paid/Captured
-> Fulfilled/Completed -> Allocated -> Recognized/Settled
```

Refund, return, cancellation, chargeback, or dispute creates a linked correction path rather than rewriting the order.

## Rules

Order completion, payment capture, invoice issue, vendor settlement, reward qualification, and revenue recognition are separate decisions with explicit source events.

## Related Documents

- [000-index.md](000-index.md)
- [003-gross-merchandise-value.md](003-gross-merchandise-value.md)
- [004-net-revenue.md](004-net-revenue.md)
- [015-order-settlement.md](015-order-settlement.md)
