# Treasury Domain Model

> **Document:** 12-financial-system/190-treasury-and-cash-management/002-treasury-domain-model.md

---

## Purpose

The Treasury domain models bank and provider accounts, cash positions, balances, liquidity, transfers, reserves, concentration, forecasts, FX exposure, controls, and reconciliation.

## Entities

| Entity | Responsibility |
| --- | --- |
| Bank Account | institution, entity, currency, country, status, restrictions |
| Provider Cash Account | processor/wallet balance and settlement evidence |
| Cash Position | available, restricted, pending, expected, and projected cash |
| Fund Transfer | approved movement between accounts or entities |
| Liquidity Forecast | expected inflows, outflows, timing, currency, and confidence |
| FX Exposure | open currency position and risk |
| Reconciliation Session | statement matching and exceptions |

## Invariants

- cash account belongs to one entity/currency scope;
- transfer source and destination are authorized and compatible;
- restricted/reserved cash is not available cash;
- provider/bank balance is evidence until reconciled;
- cross-entity transfers have intercompany and tax treatment; and
- treasury movements are idempotent, approved, and audit-traceable.

## Related Documents

- [000-index.md](000-index.md)
- [003-bank-accounts.md](003-bank-accounts.md)
- [006-liquidity-management.md](006-liquidity-management.md)
- [008-fund-transfers.md](008-fund-transfers.md)
