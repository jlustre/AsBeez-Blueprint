# Partial Payments

> **Document:** 12-financial-system/070-payments/010-partial-payments.md

---

## Purpose

Partial payments allow an AsBeez order or invoice to be funded by multiple approved captures or methods while preserving one declared total, allocation plan, and remaining balance.

## Rules

- each payment has its own intent/attempt/capture/provider references;
- aggregate captured amount cannot exceed the order or invoice amount;
- tax, vendor, partner, fee, and reward allocation waits for the applicable completion threshold or policy;
- a partial refund identifies the payment and order lines affected;
- currency conversion and rounding are recorded per payment; and
- incomplete orders do not automatically generate qualifying reward events.

## State

```text
Unfunded -> Partially Funded -> Fully Funded -> Allocated
```

## Related Documents

- [000-index.md](000-index.md)
- [004-payment-intents.md](004-payment-intents.md)
- [006-payment-capture.md](006-payment-capture.md)
- [011-split-payments.md](011-split-payments.md)
