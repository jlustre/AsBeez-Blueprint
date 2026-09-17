# Wallet Credits

> **Document:** 12-financial-system/050-member-wallets/006-wallet-credits.md

---

## Purpose

A wallet credit increases a wallet balance only after an approved source event authorizes the increase.

## Approved Credit Sources

- completed marketplace refund or customer credit;
- approved vendor, partner, or member settlement;
- redemption of a classified reward benefit;
- approved transfer from another monetary wallet; or
- controlled migration or administrative correction.

RP issuance, ABC creation, matrix placement, or AHC distribution does not create a monetary wallet credit by itself.

## Required Data

Credit ID, wallet, amount/unit and currency, source event, source owner, reason, policy version, country, legal entity, idempotency key, approval, effective time, GL/subledger reference, and reversal link.

## Controls

Credits are validated against wallet type, status, limits, holds, compliance, available funding, and duplicate source events. A failed or uncertain credit is resolved by source and idempotency lookup, not by issuing a second credit.

## Related Documents

- [000-index.md](000-index.md)
- [005-wallet-balances.md](005-wallet-balances.md)
- [007-wallet-debits.md](007-wallet-debits.md)
- [018-wallet-events.md](018-wallet-events.md)
