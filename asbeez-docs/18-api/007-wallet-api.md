# Wallet API

## Purpose

The Wallet API exposes typed wallet views and controlled requests for monetary credits/debits, holds, reserves, transfers, redemptions, payouts, statements, limits, and reconciliation status.

## Queries

Return owner/type, entity/country, currency/unit, available/pending/held/reserved components, status, limits, movements, source, freshness, and ledger/control references. RP/ABC/AHC are displayed separately from monetary balances.

## Commands

Create/activate/lock wallet, request credit/debit/transfer, place/release hold/reserve, request redemption or payout where permitted, and submit investigation/support. Commands require current version, authorization, policy, balance, limits, risk/compliance, country/currency, idempotency, and reconciliation.

## Rules

Clients cannot write balances, bypass holds, choose unrestricted mappings, or create monetary value by changing a field. Unknown provider results remain pending/reconciled; corrections use compensating records. Wallet projections cannot replace wallet movements or ledger authority.

## Related Documents

- [index.md](index.md)
- [006-rewards-api.md](006-rewards-api.md)
- [008-admin-api.md](008-admin-api.md)
- [../12-financial-system/310-api/010-wallet-api.md](../12-financial-system/310-api/010-wallet-api.md)
