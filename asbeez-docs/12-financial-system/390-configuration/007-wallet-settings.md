# Wallet Settings

> **Document:** 12-financial-system/390-configuration/007-wallet-settings.md

---

## Purpose

Wallet settings define wallet types, units/currencies, balance components, limits, holds, reserves, transfers, locks, statement behavior, conversion policy, and control-account mappings.

## Rules

Settings are owner/type/currency/entity/country scoped and versioned. They cannot allow negative/unauthorized balance, bypass holds/reserves, convert RP/ABC/AHC by field edit, or write a monetary wallet effect without idempotency, concurrency, ledger, and reconciliation controls.

## Change Control

Changes assess existing wallets, balances, limits, compliance, reward treatment, account mappings, reports, and reconciliation. Effective-date changes, test boundary cases, approve with separation of duties, monitor, and preserve historical settings.

## Related Documents

- [000-index.md](000-index.md)
- [006-ledger-settings.md](006-ledger-settings.md)
- [008-payment-settings.md](008-payment-settings.md)
- [../300-data-model/005-wallet-schema.md](../300-data-model/005-wallet-schema.md)
