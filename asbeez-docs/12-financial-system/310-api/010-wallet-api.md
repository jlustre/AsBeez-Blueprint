# Wallet API

> **Document:** 12-financial-system/310-api/010-wallet-api.md

---

## Purpose

The Wallet API exposes typed wallet views and controlled requests for credits, debits, holds, reserves, transfers, redemptions, and statements.

## Queries

Retrieve wallet type, owner, country, entity, currency/unit, available/pending/held/reserved balances, limits, status, holds, reservations, movements, and statement projections. RP/ABC/AHC quantities are returned separately from monetary balances.

## Commands

Create wallet, request credit/debit, place/release hold, reserve/release, request transfer, request redemption, or request payout where permitted. Commands require idempotency, current version, policy, risk/compliance, balance, currency, country, and authorization checks.

## Rules

Clients cannot write balances, select unrestricted account mappings, bypass holds, or convert reward units by changing a request field. Responses distinguish requested, pending, applied, failed, reversed, and unknown outcomes.

## Related Documents

- [000-index.md](000-index.md)
- [005-idempotency.md](005-idempotency.md)
- [011-payment-api.md](011-payment-api.md)
- [../300-data-model/005-wallet-schema.md](../300-data-model/005-wallet-schema.md)
- [../050-member-wallets/017-wallet-api.md](../050-member-wallets/017-wallet-api.md)
