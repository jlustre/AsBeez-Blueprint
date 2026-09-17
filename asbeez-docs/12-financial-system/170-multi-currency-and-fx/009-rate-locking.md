# Rate Locking

> **Document:** 12-financial-system/170-multi-currency-and-fx/009-rate-locking.md

---

## Purpose

Rate locking fixes an approved FX rate for a defined order, payment, payout, settlement, wallet conversion, or reporting operation for a specified scope and duration.

## Required Data

Lock ID, source/target currencies, rate, provider/source, timestamp, expiry, operation scope, amount limit, spread/fee, rounding, customer/beneficiary, country/entity, and policy version.

## Rules

A lock cannot be reused outside its scope, amount, currency, or expiry. Expired or partially used locks are explicit outcomes. Rate lock does not guarantee payment, settlement, payout, or revenue recognition; those workflows remain separate.

## Lifecycle

```text
Requested -> Quoted -> Locked -> Used
Requested -> Rejected | Expired | Cancelled
Locked -> Partially Used -> Closed
```

Every state records the rate, source, amount remaining, expiry, reason, actor/system, and policy version.

## Related Documents

- [000-index.md](000-index.md)
- [007-exchange-rates.md](007-exchange-rates.md)
- [010-currency-conversion.md](010-currency-conversion.md)
- [013-cross-border-settlement.md](013-cross-border-settlement.md)
