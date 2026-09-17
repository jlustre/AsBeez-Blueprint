# Wallet Transfers

> **Document:** 12-financial-system/050-member-wallets/008-wallet-transfers.md

---

## Purpose

A wallet transfer moves an approved unit between compatible wallets or a wallet and an approved payout/settlement destination. It is a linked debit and credit workflow, not a balance rewrite.

## Rules

- source and destination wallets have compatible type, unit, country, and currency rules;
- both sides share one transfer ID and idempotency scope;
- source reservation precedes final debit and destination credit;
- compliance, ownership, limits, holds, and sanctions checks pass;
- cross-currency transfers record rate, source, timestamp, and rounding; and
- partial or failed transfers remain visible and are reconciled.

RP, ABC, and AHC cannot be transferred as money unless an approved conversion event explicitly creates a monetary unit. Member-to-member transfers are disabled by default until the applicable legal and program rules permit them.

## Related Documents

- [000-index.md](000-index.md)
- [006-wallet-credits.md](006-wallet-credits.md)
- [007-wallet-debits.md](007-wallet-debits.md)
- [011-wallet-locking.md](011-wallet-locking.md)
