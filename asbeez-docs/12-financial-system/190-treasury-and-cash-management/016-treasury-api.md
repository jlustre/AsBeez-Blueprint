# Treasury API

> **Document:** 12-financial-system/190-treasury-and-cash-management/016-treasury-api.md

---

## Purpose

The Treasury API exposes authenticated cash, account, position, liquidity, transfer, reconciliation, FX exposure, and forecast views without permitting uncontrolled movement.

## Read Operations

- retrieve bank/provider accounts, cash positions, restrictions, reserves, liquidity, transfers, FX exposure, forecasts, and reconciliation status;
- retrieve source freshness, currency/entity/country, policy, and exception evidence; and
- retrieve safe reports for Finance, Treasury, Operations, and auditors.

## Commands

Request transfer, approve, submit, cancel, concentrate, fund reserve, resolve reconciliation exception, and submit evidence. Commands require authorization, dual control, idempotency, source/destination validation, limits, compliance, and audit correlation.

## Rules

Clients cannot set balances, mark transfers complete, bypass restrictions, alter rates, release reserves, or fund payouts/obligations through API fields.

## Related Documents

- [000-index.md](000-index.md)
- [002-treasury-domain-model.md](002-treasury-domain-model.md)
- [008-fund-transfers.md](008-fund-transfers.md)
- [014-treasury-controls.md](014-treasury-controls.md)
