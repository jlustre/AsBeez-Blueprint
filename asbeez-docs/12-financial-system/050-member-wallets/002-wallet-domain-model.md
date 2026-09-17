# Wallet Domain Model

> **Document:** 12-financial-system/050-member-wallets/002-wallet-domain-model.md

---

## Purpose

The wallet domain models the member-owned program view, wallet state, balance components, movements, holds, reservations, limits, and statements. The wallet owns availability behavior; the General Ledger owns posted monetary accounting.

## Core Entities

| Entity | Responsibility |
| --- | --- |
| Wallet | identity, owner, type, country, currency, status |
| Wallet Balance | ledger-backed, pending, held, reserved, restricted, available totals |
| Wallet Movement | approved credit/debit with source and reversal links |
| Hold | temporary restriction and release condition |
| Reservation | commitment against available value |
| Wallet Statement | ordered member-facing movement and balance view |
| Wallet Limit | country, risk, program, and operational threshold |

## Invariants

- a wallet has one owner, type, currency policy, country scope, and lifecycle;
- available value cannot exceed supported ledger/subledger value;
- a movement is not posted twice for one idempotency scope;
- a hold or reservation cannot be released twice;
- a frozen wallet cannot initiate restricted operations; and
- RP, ABC, and AHC quantities cannot be silently represented as monetary amounts.

## Lifecycle

```text
Pending -> Active -> Restricted -> Frozen -> Closed
```

## Related Documents

- [000-index.md](000-index.md)
- [003-wallet-types.md](003-wallet-types.md)
- [005-wallet-balances.md](005-wallet-balances.md)
- [018-wallet-events.md](018-wallet-events.md)
