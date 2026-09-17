# Refund Domain Model

> **Document:** 12-financial-system/130-refunds-returns-and-cancellations/002-refund-domain-model.md

---

## Purpose

The Refund domain models refund request, eligibility, approval, line scope, payment execution, credit note, wallet credit, reward reversal, vendor/partner adjustment, tax, fraud review, and reconciliation.

## Entities

| Entity | Responsibility |
| --- | --- |
| Refund Request | customer or operator request and reason |
| Refund Decision | eligibility, amount, method, approval, and policy evidence |
| Refund Line | affected order/invoice line and amount |
| Refund Execution | provider, wallet, credit-note, or manual payment result |
| Return | physical/service fulfillment and condition result |
| Downstream Adjustment | vendor, partner, tax, reward, reserve, revenue, or payout effect |

## Invariants

- refund references one original order/payment/invoice scope;
- refunded amount cannot exceed refundable captured or payable value;
- each execution is idempotent;
- original records are never edited or deleted;
- tax, vendor, partner, reward, wallet, reserve, and revenue effects are separately evaluated; and
- a failed or unknown provider result remains unresolved until reconciled.

## Lifecycle

```text
Requested -> Eligible -> Approved -> Submitted -> Completed
Requested -> Rejected | Cancelled | Held
Submitted -> Failed -> Retrying | Failed
```

## Related Documents

- [000-index.md](000-index.md)
- [003-refund-eligibility.md](003-refund-eligibility.md)
- [005-partial-refunds.md](005-partial-refunds.md)
- [016-refund-events.md](016-refund-events.md)
