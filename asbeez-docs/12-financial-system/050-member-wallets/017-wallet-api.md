# Wallet API

> **Document:** 12-financial-system/050-member-wallets/017-wallet-api.md

---

## Purpose

The Wallet API exposes authenticated wallet views and commands without allowing clients to write balances directly.

## Read Operations

- retrieve wallet type, country, currency/unit, status, and balance components;
- retrieve paginated statements and movement details;
- retrieve holds, reservations, limits, compliance status, and pending operations; and
- retrieve RP/AHC display quantities separately from monetary balances.

## Commands

Create wallet, request credit/debit, reserve/release, request transfer, request redemption or payout where permitted, acknowledge statement, and submit dispute/support case. Commands require idempotency keys and return workflow status, not an assumed final provider result.

## API Rules

Clients cannot supply account balances, bypass policy, choose unrestricted account mappings, or convert RP/ABC/AHC by changing a request field. Authorization, country, wallet type, currency, limits, compliance, and source-event checks occur server-side. Sensitive data is minimized and audit-correlated.

## Related Documents

- [000-index.md](000-index.md)
- [002-wallet-domain-model.md](002-wallet-domain-model.md)
- [005-wallet-balances.md](005-wallet-balances.md)
- [018-wallet-events.md](018-wallet-events.md)
