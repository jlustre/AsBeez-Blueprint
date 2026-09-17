# Refund API

> **Document:** 12-financial-system/310-api/014-refund-api.md

---

## Purpose

The Refund API exposes eligibility, approval, full or partial refund requests, return/cancellation references, provider status, reward reversal, vendor/partner impact, and reconciliation.

## Queries

Retrieve refundable amount, prior refunds, reason, tax/fee treatment, order/payment/invoice links, provider evidence, vendor/partner allocation, reward adjustment, and current workflow status.

## Commands

Request, approve, cancel before submission, retry/query an uncertain refund, or resolve an exception where authorized. The server calculates refundable amount, tax, fees, entitlements, reserves, and reward effects.

## Rules

Refunds are idempotent and cannot exceed the refundable amount. A refund does not delete the original sale or journal. Accounting, tax, vendor/partner, reward, reserve, and payment effects are linked through compensating records and reconciliation.

## Related Documents

- [000-index.md](000-index.md)
- [011-payment-api.md](011-payment-api.md)
- [005-idempotency.md](005-idempotency.md)
- [../300-data-model/009-refund-schema.md](../300-data-model/009-refund-schema.md)
- [../130-refunds-returns-and-cancellations/001-overview.md](../130-refunds-returns-and-cancellations/001-overview.md)
