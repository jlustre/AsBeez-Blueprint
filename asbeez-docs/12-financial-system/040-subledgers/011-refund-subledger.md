# Refund Subledger

> **Document:** 12-financial-system/040-subledgers/011-refund-subledger.md

---

## Purpose

The Refund Subledger records refund requests, approvals, provider execution, credits, reversals, order effects, vendor/partner adjustments, and reward consequences.

## Lifecycle

```text
Requested -> Reviewed -> Approved -> Submitted -> Completed
Requested -> Rejected | Cancelled
Submitted -> Failed -> Retrying | Failed
```

## Required Detail

Refund ID, original order/payment/invoice, requested and approved amount, reason, item/line scope, tax, currency, provider reference, customer, vendor, partner, reward and settlement impacts, approval, execution status, and GL reversal/compensation reference.

## Rules

A refund never deletes the original sale, payment, RP, ABC, matrix, AHC, vendor, partner, or commission event. Each downstream consequence is evaluated under its owning policy. Partial refunds must identify affected lines and must not exceed the refundable captured amount.

## Related Documents

- [000-index.md](000-index.md)
- [006-customer-subledger.md](006-customer-subledger.md)
- [010-payment-provider-subledger.md](010-payment-provider-subledger.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
