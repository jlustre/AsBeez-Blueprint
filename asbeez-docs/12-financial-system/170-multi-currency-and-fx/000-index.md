# Multi Currency And FX

> **Document:** 12-financial-system/170-multi-currency-and-fx/000-index.md

---

## Purpose

This section defines multi-currency and foreign-exchange capabilities, including supported currencies, base and settlement currencies, exchange rates, conversion, gains and losses, rounding, cross-border settlement, reconciliation, risk management, APIs, events, and AI capabilities.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-currency-domain-model.md](002-currency-domain-model.md) - Currency Domain Model
- [003-supported-currencies.md](003-supported-currencies.md) - Supported Currencies
- [004-base-currency.md](004-base-currency.md) - Base Currency
- [005-transaction-currency.md](005-transaction-currency.md) - Transaction Currency
- [006-settlement-currency.md](006-settlement-currency.md) - Settlement Currency
- [007-exchange-rates.md](007-exchange-rates.md) - Exchange Rates
- [008-rate-providers.md](008-rate-providers.md) - Rate Providers
- [009-rate-locking.md](009-rate-locking.md) - Rate Locking
- [010-currency-conversion.md](010-currency-conversion.md) - Currency Conversion
- [011-fx-gains-and-losses.md](011-fx-gains-and-losses.md) - FX Gains And Losses
- [012-rounding-and-precision.md](012-rounding-and-precision.md) - Rounding And Precision
- [013-cross-border-settlement.md](013-cross-border-settlement.md) - Cross Border Settlement
- [014-fx-reconciliation.md](014-fx-reconciliation.md) - FX Reconciliation
- [015-fx-risk-management.md](015-fx-risk-management.md) - FX Risk Management
- [016-fx-api.md](016-fx-api.md) - FX API
- [017-fx-events.md](017-fx-events.md) - FX Events
- [018-fx-ai-capabilities.md](018-fx-ai-capabilities.md) - FX AI Capabilities
- [019-future-roadmap.md](019-future-roadmap.md) - Future Roadmap

## Design Authority

Currency and FX owns supported currencies, rates, locks, conversions, revaluation, gains/losses, fees, and FX evidence. Payments, Invoicing, Vendor/Partner Finance, Payouts, Tax, Rewards, Treasury, and the General Ledger provide or consume currency facts through controlled contracts.

## Implementation Sequence

1. Approve currencies, entities, countries, providers, base/functional/reporting contexts, and rate policies.
2. Implement currency value objects, rate sourcing, locks, conversion, fees, precision, and rounding.
3. Connect payments, invoices, settlements, payouts, wallets, tax, rewards, reserves, and GL mappings.
4. Implement gains/losses, revaluation, cross-border settlement, reconciliation, risk, APIs, events, audit, and governed AI.
