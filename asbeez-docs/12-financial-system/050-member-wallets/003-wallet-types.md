# Wallet Types

> **Document:** 12-financial-system/050-member-wallets/003-wallet-types.md

---

## Purpose

Wallet type determines the kind of value displayed, permitted operations, accounting treatment, and payout eligibility. Type must be explicit and cannot be inferred from a label shown in the UI.

## Types

| Type | Value | Permitted use |
| --- | --- | --- |
| Monetary wallet | approved monetary balance | policy-approved spend, redemption, transfer, or payout |
| Refund wallet | approved customer refund/credit balance | order or marketplace redemption under refund policy |
| Settlement wallet | approved member/vendor/partner payable view | statement and payout workflow |
| Reward display wallet | RP, ABC, or AHC quantity | program display and approved non-monetary actions |
| Restricted wallet | monetary or program value under hold/review | no ordinary spend or payout |
| Operational wallet | internal system balance or clearing view | controlled administration only |

## Rules

Reward display wallets are not cash wallets. A conversion between wallet types is a new approved event with source, destination, rate or rule, country, currency, policy version, and audit evidence. One wallet cannot mix currencies or monetary and non-monetary units without explicit typed balances.

## Related Documents

- [000-index.md](000-index.md)
- [002-wallet-domain-model.md](002-wallet-domain-model.md)
- [006-wallet-credits.md](006-wallet-credits.md)
- [016-wallet-compliance.md](016-wallet-compliance.md)
