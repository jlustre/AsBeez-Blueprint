# Wallet Holds

> **Document:** 12-financial-system/050-member-wallets/009-wallet-holds.md

---

## Purpose

A wallet hold restricts use of value while preserving the underlying movement and ownership. Holds support refunds, chargebacks, fraud review, compliance, dispute, settlement, payout, and operational risk controls.

## Hold Data

Hold ID, wallet, amount/unit, currency, reason, source case/event, owner, created time, expiry/review time, release conditions, partial release amount, and policy version.

## Lifecycle

```text
Placed -> Partially Released -> Released
Placed -> Expired
Placed -> Escalated/Frozen
```

## Rules

Held value is not available for ordinary spend or payout. A hold cannot exceed the eligible balance, be released twice, or be removed without evidence. Expiry requires policy evaluation; it is not an automatic deletion of value or liability.

## Related Documents

- [000-index.md](000-index.md)
- [005-wallet-balances.md](005-wallet-balances.md)
- [010-wallet-reserves.md](010-wallet-reserves.md)
- [016-wallet-compliance.md](016-wallet-compliance.md)
