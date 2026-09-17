# Transaction Currency

> **Document:** 12-financial-system/170-multi-currency-and-fx/005-transaction-currency.md

---

## Purpose

Transaction currency is the currency in which an order, invoice, payment, refund, fee, tax assessment, reward conversion, or other source event is denominated.

## Rules

Transaction currency is selected by product, country, customer, vendor, provider, and policy. It remains attached to the original source and is not changed because a provider settles or AsBeez reports in another currency. Any conversion is a new evidenced operation.

## Required Evidence

Amount, currency, precision, source, exchange context where applicable, tax/fee treatment, country/entity, effective time, and policy version.

## Reporting

Transaction-currency reports preserve original amounts and do not present converted values as if they were source amounts. Any base, settlement, wallet, or reporting view includes the conversion rate, rate date, rounding, and policy used.

## Related Documents

- [000-index.md](000-index.md)
- [003-supported-currencies.md](003-supported-currencies.md)
- [006-settlement-currency.md](006-settlement-currency.md)
- [010-currency-conversion.md](010-currency-conversion.md)
