# Wallet Debits

> **Document:** 12-financial-system/050-member-wallets/007-wallet-debits.md

---

## Purpose

A wallet debit reduces an approved wallet balance for a permitted spend, redemption, transfer, payout, fee, expiration, or correction.

## Debit Preconditions

- wallet is active and the operation is permitted for its type;
- available balance covers the debit and applicable fee;
- holds, reserves, limits, country, compliance, and payout rules pass;
- source command is authorized and idempotent; and
- the destination, beneficiary, or settlement reference is known.

## Rules

Pending debits may be reserved before final debit. A debit cannot exceed available value or be applied to a reward display wallet as if it were cash. A failed provider operation does not prove that the wallet debit succeeded; provider and wallet states are reconciled explicitly.

## Corrections

An incorrect debit is reversed or compensated with a new event referencing the original. Historical statements retain both movements.

## Related Documents

- [000-index.md](000-index.md)
- [005-wallet-balances.md](005-wallet-balances.md)
- [009-wallet-holds.md](009-wallet-holds.md)
- [012-wallet-reconciliation.md](012-wallet-reconciliation.md)
