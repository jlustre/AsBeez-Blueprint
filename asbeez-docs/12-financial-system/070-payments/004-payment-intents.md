# Payment Intents

> **Document:** 12-financial-system/070-payments/004-payment-intents.md

---

## Purpose

A Payment Intent represents the approved request to collect a declared amount for an AsBeez order or financial operation before provider authorization or capture.

## Required Fields

Intent ID, order/invoice reference, customer, amount, currency, country, legal entity, allowed method/provider, capture mode, expiration, risk/compliance state, idempotency key, and policy versions.

## Rules

- amount and currency are server-calculated from the order or approved invoice;
- clients cannot alter price, tax, vendor allocation, or reward outcome through the intent;
- one intent cannot span unrelated orders or currencies;
- an expired or cancelled intent cannot be authorized or captured; and
- creation does not imply payment, order completion, reward qualification, or revenue.

## State

```text
Created -> RequiresAction -> Ready -> Authorized -> Captured
Created -> Expired | Cancelled | Failed
```

## Related Documents

- [000-index.md](000-index.md)
- [003-payment-methods.md](003-payment-methods.md)
- [005-payment-authorization.md](005-payment-authorization.md)
- [020-payment-api.md](020-payment-api.md)
