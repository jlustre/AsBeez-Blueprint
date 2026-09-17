# Wallet Creation

> **Document:** 12-financial-system/050-member-wallets/004-wallet-creation.md

---

## Purpose

Wallet creation establishes a typed wallet for an eligible member or approved participant. Creation creates an identity and control boundary; it does not create a balance, income, or payout entitlement.

## Required Inputs

Member/owner reference, wallet type, country and jurisdiction, legal entity where monetary, currency policy, program eligibility, identity/compliance status, terms acceptance, effective time, and idempotency key.

## Rules

- one active wallet exists per owner, type, country, and currency scope unless an approved exception applies;
- duplicate creation requests return the existing wallet;
- restricted jurisdictions, members, programs, and wallet types are blocked;
- reward display wallets may be created without monetary recognition; and
- monetary wallets require the applicable accounting, custody, and payout classification before activation.

## Initial State

New wallets begin with zero available balance and an auditable creation event. Opening balances require a separate approved migration, transfer, refund, settlement, or reward-recognition event.

## Related Documents

- [000-index.md](000-index.md)
- [003-wallet-types.md](003-wallet-types.md)
- [015-wallet-security.md](015-wallet-security.md)
- [016-wallet-compliance.md](016-wallet-compliance.md)
