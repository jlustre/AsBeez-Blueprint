# Refund Schema

> **Document:** 12-financial-system/300-data-model/009-refund-schema.md

---

## Purpose

Refund data records a return of customer or member value caused by cancellation, return, adjustment, service failure, dispute resolution, or approved goodwill policy.

## Core Fields

`refund_id`, `order_id`, `payment_id`, `invoice_id`, `requester_id`, `reason_code`, `refund_type`, `amount_minor`, `currency`, `tax_refund_minor`, `fee_refund_minor`, `reward_reversal_reference`, `vendor_reference`, `status`, `provider_refund_id`, `idempotency_key`, `approval_id`, `created_at`, and `completed_at`.

## Lifecycle

Requested, eligible, approved, queued, submitted, processing, completed, partially completed, failed, cancelled, or reversed. Full and partial refunds are independently identified and cannot exceed the refundable amount.

## Accounting Rules

Refund effects link payment, invoice, tax, vendor/partner entitlement, rewards, fees, reserves, and ledger journals. A refund is not a deleted sale; recognized revenue, liability, tax, commission, and reserve effects are reversed or adjusted under policy.

## Related Documents

- [000-index.md](000-index.md)
- [006-payment-schema.md](006-payment-schema.md)
- [008-invoice-schema.md](008-invoice-schema.md)
- [../130-refunds-returns-and-cancellations/001-overview.md](../130-refunds-returns-and-cancellations/001-overview.md)
