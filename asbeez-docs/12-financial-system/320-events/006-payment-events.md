# Payment Events

> **Document:** 12-financial-system/320-events/006-payment-events.md

---

## Purpose

Payment events communicate intent, method, authorization, capture, settlement, failure, provider evidence, refund, dispute, and reconciliation facts.

## Event Catalog

`PaymentIntentCreated`, `PaymentAuthorized`, `PaymentCaptureRequested`, `PaymentCaptured`, `PaymentVoided`, `PaymentFailed`, `PaymentSettled`, `PaymentProviderObserved`, `PaymentRefundRequested`, `PaymentDisputed`, and `PaymentReconciled`.

## Payload and Rules

Events include payment/order IDs, attempt/provider references, amount/currency, fee, tax reference, country/entity, risk/compliance state appropriate to audience, status, source time, idempotency, and reconciliation reference. Provider observations are evidence until mapped to an approved state. Capture does not itself mean revenue recognition.

## Related Documents

- [000-index.md](000-index.md)
- [005-wallet-events.md](005-wallet-events.md)
- [007-payout-events.md](007-payout-events.md)
- [../300-data-model/006-payment-schema.md](../300-data-model/006-payment-schema.md)
