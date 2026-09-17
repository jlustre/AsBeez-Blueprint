# Base Currency

> **Document:** 12-financial-system/170-multi-currency-and-fx/004-base-currency.md

---

## Purpose

Base currency is the controlled currency used for consolidated management, treasury, or reporting views. It does not replace transaction or settlement currency.

## Rules

Base currency is assigned by legal entity or reporting scope with effective dates. Conversion uses approved historical rates and records source amount, target amount, rate, source, timestamp, spread, fee, and rounding. A base-currency report must retain the original currency and conversion evidence.

## Changes

Changing base currency creates a new reporting configuration or restatement policy; it does not rewrite historical transaction amounts or ledger lines.

## Reporting

Reports show original currency totals, converted base-currency totals, rate source/date, conversion policy, rounding differences, and whether values are transaction, settlement, functional, or management views.

## Related Documents

- [000-index.md](000-index.md)
- [002-currency-domain-model.md](002-currency-domain-model.md)
- [006-settlement-currency.md](006-settlement-currency.md)
- [011-fx-gains-and-losses.md](011-fx-gains-and-losses.md)
