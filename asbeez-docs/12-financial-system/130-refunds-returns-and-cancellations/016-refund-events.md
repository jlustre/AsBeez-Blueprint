# Refund Events

> **Document:** 12-financial-system/130-refunds-returns-and-cancellations/016-refund-events.md

---

## Purpose

Refund events are immutable facts for request, eligibility, approval, return, cancellation, execution, downstream adjustment, reconciliation, and fraud review.

## Event Catalog

- RefundRequested, RefundEligible, RefundRejected, RefundHeld;
- RefundApproved, RefundCancelled, RefundSubmitted, RefundPending, RefundCompleted;
- RefundFailed, RefundRetryScheduled, RefundReturned;
- ReturnRequested, ReturnReceived, ReturnAccepted, ReturnRejected;
- OrderCancellationRequested, OrderCancelled, OrderCancellationRejected;
- RewardReversalRequested, VendorAdjustmentCreated, WalletRefundCredited;
- CreditNoteIssued, RefundReconciled, RefundExceptionOpened/Resolved; and
- RefundFraudReviewOpened/Resolved.

## Contract

Events include ID/version, refund/return/order/invoice/payment/line IDs, customer/vendor/partner, amount/currency/tax/fee, destination/provider, country/entity, reward and settlement references, policy versions, occurred/effective times, actor/system, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. Events do not delete original records or imply downstream completion; each provider, wallet, vendor, reward, tax, revenue, and GL effect follows its own validated workflow.

## Related Documents

- [000-index.md](000-index.md)
- [002-refund-domain-model.md](002-refund-domain-model.md)
- [007-return-accounting.md](007-return-accounting.md)
- [013-refund-reconciliation.md](013-refund-reconciliation.md)
