# Partner Financial Account

> **Document:** 12-financial-system/120-partner-finance/002-partner-financial-account.md

---

## Purpose

The Partner Financial Account is the controlled identity and payable view for an approved partner within a legal entity, country, currency, program, or agreement scope.

## Required Data

Partner ID/type, legal/business identity, agreement/program, tax status, country, entity, settlement currency, verified destination, account status, compliance status, fee/reserve plan, statement scope, and policy versions.

## Rules

- account creation does not create earnings, commission, payable, revenue, or payout;
- partner types and programs define permitted earning sources and methods;
- destination changes require verification and cooling-off controls;
- suspended or non-compliant partners may be held from payout; and
- partner identity and financial references are separated from customer payment credentials.

## Lifecycle

```text
Pending -> Approved -> Active -> Restricted -> Suspended -> Closed
```

## Related Documents

- [000-index.md](000-index.md)
- [003-partner-earnings.md](003-partner-earnings.md)
- [009-partner-settlement.md](009-partner-settlement.md)
- [015-partner-api.md](015-partner-api.md)
