# Refund Operations

> **Document:** 12-financial-system/370-operations/006-refund-operations.md

---

## Purpose

Refund operations manage eligibility, cancellation/return evidence, approvals, full/partial requests, provider status, tax/fee/reward/vendor/partner effects, exceptions, and reconciliation.

## Procedures

Validate order/payment/invoice, refundable amount, prior refunds, reason, customer/vendor/partner allocation, tax, fees, rewards, reserves, risk, authorization, and provider status. Track pending/unknown refunds and reconcile before retrying.

## Rules

Refunds cannot exceed refundable value or delete the original sale/journal. Operators cannot alter financial treatment directly. Corrections use approved compensating records, linked source/correlation/idempotency, communication, and audit evidence.

## Related Documents

- [000-index.md](000-index.md)
- [004-payment-operations.md](004-payment-operations.md)
- [007-dispute-operations.md](007-dispute-operations.md)
- [../300-data-model/009-refund-schema.md](../300-data-model/009-refund-schema.md)
