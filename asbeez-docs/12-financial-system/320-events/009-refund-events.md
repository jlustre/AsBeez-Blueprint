# Refund Events

> **Document:** 12-financial-system/320-events/009-refund-events.md

---

## Purpose

Refund events communicate eligibility, request, approval, submission, provider result, completion, failure, reversal, and related order, tax, reward, vendor, partner, reserve, and ledger effects.

## Event Catalog

`RefundRequested`, `RefundEligibilityDetermined`, `RefundApproved`, `RefundSubmitted`, `RefundProviderObserved`, `RefundCompleted`, `RefundPartiallyCompleted`, `RefundFailed`, `RefundReversed`, and `RefundReconciled`.

## Payload and Rules

Events include refund/order/payment/invoice IDs, reason, type, amount/currency, tax/fee/reward treatment references, provider ID, vendor/partner allocation, country/entity, approval, idempotency, and accounting/reconciliation references. A refund event does not delete the original sale or authorize an amount beyond refundable value.

## Related Documents

- [000-index.md](000-index.md)
- [006-payment-events.md](006-payment-events.md)
- [010-chargeback-events.md](010-chargeback-events.md)
- [../300-data-model/009-refund-schema.md](../300-data-model/009-refund-schema.md)
