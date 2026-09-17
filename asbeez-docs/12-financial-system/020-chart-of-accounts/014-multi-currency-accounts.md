# Multi Currency Accounts

> **Document:** 12-financial-system/020-chart-of-accounts/014-multi-currency-accounts.md

---

## Purpose

Multi-currency accounting preserves the original transaction currency while supporting settlement, functional, and reporting currencies.

## Account Model

An account declares whether it is single-currency, currency-parameterized, or multi-currency through controlled subaccounts. The legal entity, account code, currency, and reporting dimensions together identify a posting destination.

## Required Conversion Evidence

Every conversion records source amount and currency, target amount and currency, rate, rate source, rate timestamp, rate type, rounding policy, and the responsible policy version. Historical entries are not recalculated using current rates.

## Revaluation

Open monetary balances may be revalued at an approved period boundary. Revaluation entries identify unrealized gain or loss and remain separate from realized settlement differences. Rounding differences are posted to approved accounts, never discarded.

## Related Documents

- [000-index.md](000-index.md)
- [005-asset-accounts.md](005-asset-accounts.md)
- [013-country-specific-accounts.md](013-country-specific-accounts.md)
- [018-account-dimensions.md](018-account-dimensions.md)
