# Wallet Schema

> **Document:** 12-financial-system/300-data-model/005-wallet-schema.md

---

## Purpose

Wallet data represents typed member, vendor, partner, platform, or operational balances and their holds, reserves, movements, and accounting links.

## Core Entities

`wallet`, `wallet_balance`, `wallet_transaction`, `wallet_hold`, `wallet_reservation`, and `wallet_limit`. Fields include owner/type, legal entity, country, currency, available/pending/held/reserved minor units, version, status, source reference, policy version, and ledger control account.

## Rules

Wallets are currency-specific and type-specific. Available balance is derived from approved movements and active holds, never trusted from client input. Debit, credit, transfer, hold, release, reserve, lock, and adjustment operations are idempotent and concurrency-controlled. RP, ABC, and AHC are not money unless an approved conversion creates a separate monetary effect.

## Accounting Link

Every monetary wallet movement maps to a subledger/control account and ultimately to a posted journal where required. Wallet projections may be rebuilt and reconciled to wallet transactions and ledger totals.

## Related Documents

- [000-index.md](000-index.md)
- [004-ledger-entries-schema.md](004-ledger-entries-schema.md)
- [../050-member-wallets/001-overview.md](../050-member-wallets/001-overview.md)
- [../060-reward-finance/001-overview.md](../060-reward-finance/001-overview.md)
