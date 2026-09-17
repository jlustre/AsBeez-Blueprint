# Wallet Reconciliation

> **Document:** 12-financial-system/050-member-wallets/012-wallet-reconciliation.md

---

## Purpose

Wallet reconciliation proves that member-facing balances agree with wallet movements, subledger records, approved reward conversions, settlement/payout records, and General Ledger control accounts.

## Required Checks

- opening balance plus movements equals closing balance;
- available equals supported balance less pending, held, reserved, and restricted value;
- monetary wallet totals agree with wallet subledger and GL control accounts;
- reward display quantities agree with RP/AHC subledgers without being treated as money;
- credits and debits have one source and no duplicate idempotency effect;
- payout and transfer states agree with provider or destination evidence; and
- country, currency, member, and wallet type scopes match.

## Exceptions

Any mismatch creates an owned exception with wallet, movement, source, amount/unit, currency, policy version, detected time, severity, and resolution. Balances are not fixed by editing snapshots; the underlying event or a compensating movement is corrected.

## Related Documents

- [000-index.md](000-index.md)
- [005-wallet-balances.md](005-wallet-balances.md)
- [013-wallet-statements.md](013-wallet-statements.md)
- [018-wallet-events.md](018-wallet-events.md)
