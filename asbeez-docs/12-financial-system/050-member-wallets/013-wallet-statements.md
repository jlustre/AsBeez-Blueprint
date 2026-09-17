# Wallet Statements

> **Document:** 12-financial-system/050-member-wallets/013-wallet-statements.md

---

## Purpose

Wallet statements provide an ordered, reproducible view of wallet activity and balances for members, support, operations, and audit.

## Statement Contents

Wallet ID and type, owner reference, country, currency/unit, period, opening balance, credits, debits, holds, releases, reservations, refunds, transfers, payouts, closing balance, available balance, pending/restricted totals, source references, and freshness.

## Rules

Statements distinguish monetary balances from RP, ABC, and AHC quantities. Pending, held, reserved, disputed, and restricted amounts are visible but not presented as available. A statement line is never removed because its source was reversed; the reversal appears as a new line.

## Certification

Certified statements are generated from reconciled subledger and GL-backed projections. A member-facing statement may be near-real-time, but it must show pending status or freshness when reconciliation or provider confirmation is incomplete.

## Related Documents

- [000-index.md](000-index.md)
- [005-wallet-balances.md](005-wallet-balances.md)
- [012-wallet-reconciliation.md](012-wallet-reconciliation.md)
- [018-wallet-events.md](018-wallet-events.md)
