# Refund Reserve

> **Document:** 12-financial-system/180-reserves-and-funds/004-refund-reserve.md

---

## Purpose

The Refund Reserve protects against expected customer refunds, returns, cancellations, credits, and timing differences between customer obligation and cash recovery.

## Required Data

Exposure population, order/payment/invoice, expected refund rate/amount, currency, country/entity, funding account, review period, release/use condition, owner, and policy version.

## Rules

Refund reserve is not a customer wallet balance, revenue, refund itself, or realized loss. It is measured against eligible exposure and released or utilized only after refund and reconciliation evidence. It cannot be used for unrelated chargebacks, rewards, vendors, partners, or promotions.

## Related Documents

- [000-index.md](000-index.md)
- [002-reserve-domain-model.md](002-reserve-domain-model.md)
- [015-reserve-release.md](015-reserve-release.md)
- [016-reserve-reconciliation.md](016-reserve-reconciliation.md)
