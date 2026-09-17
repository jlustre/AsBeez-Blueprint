# Vendor Holds

> **Document:** 12-financial-system/110-vendor-finance/007-vendor-holds.md

---

## Purpose

A vendor hold prevents settlement or payout of a defined amount while a refund, chargeback, fraud, compliance, fulfillment, tax, destination, or operational condition is reviewed.

## Required Data

Hold ID, vendor, order/population, amount, currency, reason, case, owner, scope, created/review/expiry time, release condition, policy version, and decision.

## Rules

Held entitlement remains attributable to the vendor and is not revenue, fee, or forfeited value. A hold does not alter the original earning. Release requires evidence and revalidation; release does not itself submit a payout.

## Lifecycle

```text
Placed -> Reviewed -> Partially Released -> Released
Placed -> Extended | Escalated | Converted to Reserve
```

Every extension or conversion records the new condition, authority, time, amount, and policy version. A hold may block settlement or payout while leaving the vendor statement and payable history transparent.

## Related Documents

- [000-index.md](000-index.md)
- [006-vendor-reserves.md](006-vendor-reserves.md)
- [008-vendor-settlement.md](008-vendor-settlement.md)
- [014-vendor-reconciliation.md](014-vendor-reconciliation.md)
