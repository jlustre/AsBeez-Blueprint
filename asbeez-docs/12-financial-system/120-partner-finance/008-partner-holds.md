# Partner Holds

> **Document:** 12-financial-system/120-partner-finance/008-partner-holds.md

---

## Purpose

A partner hold prevents settlement or payout of a defined amount while a refund, chargeback, attribution, fraud, compliance, tax, service, or operational condition is reviewed.

## Required Data

Hold ID, partner/program, source activity, amount, currency, reason, case, owner, scope, created/review/expiry time, release condition, policy version, and decision.

## Rules

Held entitlement remains attributable to the partner and does not become revenue, fee, or forfeited value. Release requires evidence and revalidation; it does not itself approve or submit a payout.

## Lifecycle

```text
Placed -> Reviewed -> Partially Released -> Released
Placed -> Extended | Escalated | Converted to Reserve
```

## Related Documents

- [000-index.md](000-index.md)
- [007-partner-reserves.md](007-partner-reserves.md)
- [009-partner-settlement.md](009-partner-settlement.md)
- [013-partner-reconciliation.md](013-partner-reconciliation.md)
