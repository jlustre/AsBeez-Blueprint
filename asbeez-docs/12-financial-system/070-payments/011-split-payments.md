# Split Payments

> **Document:** 12-financial-system/070-payments/011-split-payments.md

---

## Purpose

Split payments allocate one customer order across multiple approved payment methods or providers. They are not the same as allocating captured funds among vendors, partners, tax authorities, or AsBeez revenue.

## Required Allocation

Each split declares payment method/provider, amount, currency, order/line scope, authorization/capture state, fee treatment, failure behavior, and idempotency key. The sum of splits cannot exceed the order total.

## Rules

- all splits must pass customer, country, currency, risk, and provider policy;
- partial success remains explicit and does not silently complete the order;
- refund and chargeback allocation identifies the affected split(s);
- vendor/partner/tax/reward allocations occur after order policy determines completion; and
- split totals reconcile to customer payment, provider subledger, and GL clearing.

## Related Documents

- [000-index.md](000-index.md)
- [006-payment-capture.md](006-payment-capture.md)
- [010-partial-payments.md](010-partial-payments.md)
- [018-payment-reconciliation.md](018-payment-reconciliation.md)
