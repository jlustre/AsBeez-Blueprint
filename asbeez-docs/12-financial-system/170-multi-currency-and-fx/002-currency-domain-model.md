# Currency Domain Model

> **Document:** 12-financial-system/170-multi-currency-and-fx/002-currency-domain-model.md

---

## Purpose

The Currency domain models supported currencies, monetary amounts, exchange rates, conversions, currency contexts, locks, revaluation, FX fees, and gains/losses.

## Entities and Value Objects

| Concept | Responsibility |
| --- | --- |
| Currency | code, exponent, status, jurisdiction, effective dates |
| Money | amount, currency, scale, and rounding |
| Exchange Rate | base/quote, rate, source, timestamp, type, confidence |
| Rate Lock | rate, scope, expiry, source, and approval |
| Conversion | source/target amounts, rate, spread, fee, and evidence |
| Revaluation | open balance, valuation rate, gain/loss, period |
| Currency Context | transaction, settlement, wallet, functional, base, reporting |

## Invariants

- addition/subtraction requires matching currency;
- conversion requires an approved rate and complete evidence;
- rates and conversions are immutable once used in a posted transaction;
- rounding differences are observable and mapped; and
- cross-currency journal entries remain balanced with explicit conversion evidence.

## Related Documents

- [000-index.md](000-index.md)
- [003-supported-currencies.md](003-supported-currencies.md)
- [007-exchange-rates.md](007-exchange-rates.md)
- [010-currency-conversion.md](010-currency-conversion.md)
