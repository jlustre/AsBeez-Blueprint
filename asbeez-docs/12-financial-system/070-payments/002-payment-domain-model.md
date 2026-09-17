# Payment Domain Model

> **Document:** 12-financial-system/070-payments/002-payment-domain-model.md

---

## Purpose

The Payment domain models payment intent, attempt, method reference, authorization, capture, provider settlement, refund, dispute, failure, and reconciliation without owning order fulfillment, revenue recognition, vendor settlement, or rewards qualification.

## Entities

| Entity | Responsibility |
| --- | --- |
| Payment Intent | requested amount, currency, order, customer, and allowed methods |
| Payment Attempt | provider attempt, status, idempotency, and response |
| Authorization | provider approval and expiry |
| Capture | captured amount, provider reference, and source allocation |
| Refund | requested, approved, submitted, and completed return of funds |
| Dispute | chargeback/issuer case and outcome |
| Provider Settlement | external movement and fee evidence |

## Invariants

- one intent has one declared currency and order scope;
- captures cannot exceed authorized or permitted amount;
- refunds cannot exceed captured refundable amount;
- provider callbacks cannot create duplicate effects;
- payment state cannot imply order completion or reward qualification; and
- every monetary effect maps to a customer/order/provider/subledger/GL reference.

## Lifecycle

```text
Created -> RequiresAction -> Authorized -> Partially Captured -> Captured
Created -> Failed | Cancelled
Captured -> Partially Refunded -> Refunded
Captured -> Disputed -> Won | Lost
```

## Related Documents

- [000-index.md](000-index.md)
- [004-payment-intents.md](004-payment-intents.md)
- [005-payment-authorization.md](005-payment-authorization.md)
- [021-payment-events.md](021-payment-events.md)
