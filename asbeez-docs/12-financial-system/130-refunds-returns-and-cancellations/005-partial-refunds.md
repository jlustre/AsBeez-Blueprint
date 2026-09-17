# Partial Refunds

> **Document:** 12-financial-system/130-refunds-returns-and-cancellations/005-partial-refunds.md

---

## Purpose

A partial refund returns or credits a defined portion of an order, invoice, payment, or line scope while leaving the remaining obligation and history intact.

## Required Detail

Original line/item, quantity, price, tax, discount, fee, vendor/partner allocation, reward effect, requested/approved amount, currency, reason, method, prior refund total, and policy version.

## Rules

- cumulative refunds cannot exceed refundable line/payment amount;
- line and tax treatment are explicit;
- vendor, partner, reserve, reward, revenue, and payout effects are independently adjusted;
- multiple partial refunds are idempotent and linked; and
- the remaining invoice/payment/order status is recalculated from immutable events.

## Related Documents

- [000-index.md](000-index.md)
- [002-refund-domain-model.md](002-refund-domain-model.md)
- [004-full-refunds.md](004-full-refunds.md)
- [011-vendor-adjustments.md](011-vendor-adjustments.md)
