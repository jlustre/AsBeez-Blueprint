# Wallet Balances

> **Document:** 12-financial-system/050-member-wallets/005-wallet-balances.md

---

## Purpose

Wallet balances expose distinct components so members and operations can see what is available, pending, held, reserved, restricted, disputed, or program-only.

## Balance Components

```text
Ledger-backed or approved program balance
- pending debits
- holds
- reservations
- restricted/disputed value
= available balance
```

The formula is typed by wallet and policy. RP, ABC, and AHC quantities are not included in a monetary available balance unless an approved conversion has occurred.

## Rules

- balance projections derive from immutable movements and control records;
- available balance cannot be negative unless an approved overdraft policy exists;
- pending and held amounts remain visible but unavailable;
- currency and country are part of balance identity;
- balance snapshots carry source position and freshness; and
- any mismatch with the subledger or GL creates an exception, not a manual balance edit.

## Member Display

Statements show opening, movement, hold/release, reservation, closing, available, pending, and restricted totals with clear unit and currency labels.

## Related Documents

- [000-index.md](000-index.md)
- [006-wallet-credits.md](006-wallet-credits.md)
- [007-wallet-debits.md](007-wallet-debits.md)
- [009-wallet-holds.md](009-wallet-holds.md)
