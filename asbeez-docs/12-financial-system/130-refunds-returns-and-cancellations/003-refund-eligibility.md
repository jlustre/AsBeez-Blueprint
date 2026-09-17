# Refund Eligibility

> **Document:** 12-financial-system/130-refunds-returns-and-cancellations/003-refund-eligibility.md

---

## Purpose

Refund eligibility determines whether an order, invoice, payment, or line may be refunded under contract, consumer, product, fulfillment, payment, tax, vendor, partner, and country policy.

## Inputs

Order/invoice/payment status, line scope, delivery/return evidence, reason, customer/recipient, dates, prior refunds/credits, disputes/chargebacks, vendor/partner terms, tax, reward effects, fraud/compliance state, and jurisdiction.

## Rules

- eligibility is evaluated server-side and policy-versioned;
- a refund cannot exceed captured/refundable amount or be duplicated;
- lawful consumer or contractual rights cannot be overridden by an abuse score alone;
- suspicious or uncertain cases become review/hold outcomes; and
- eligibility does not prove provider execution or determine every downstream adjustment.

## Decision

Return eligible, partially eligible, not eligible, requires review, or held with reason, evidence, actor/system, policy version, and expiry/dispute path.

## Related Documents

- [000-index.md](000-index.md)
- [002-refund-domain-model.md](002-refund-domain-model.md)
- [005-partial-refunds.md](005-partial-refunds.md)
- [014-refund-fraud-controls.md](014-refund-fraud-controls.md)
