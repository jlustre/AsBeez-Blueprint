# Currency Schema

> **Document:** 12-financial-system/300-data-model/012-currency-schema.md

---

## Purpose

Currency data defines supported currencies, precision, rates, conversion evidence, settlement currencies, and foreign-exchange accounting.

## Core Entities

`currency`, `currency_policy`, `fx_rate`, `fx_quote`, `conversion`, and `rounding_adjustment`. Fields include ISO code, minor-unit scale, base currency, source, quote time, bid/ask or applied rate, fee/spread, rate version, validity window, source currency, target currency, and policy.

## Rules

Amounts retain original transaction, settlement, and reporting currencies. Rates are locked at the policy-defined point and cannot be silently replaced. Rounding is deterministic and recorded. Unsupported currencies, stale rates, and rate-source disagreement become exceptions.

## Accounting

Cross-currency postings retain both sides, rate, timestamp, fees, spread, rounding, entity, country, and realized/unrealized gain or loss treatment. FX conversion does not erase original currency evidence.

## Related Documents

- [000-index.md](000-index.md)
- [004-ledger-entries-schema.md](004-ledger-entries-schema.md)
- [020-indexing.md](020-indexing.md)
- [../170-multi-currency-and-fx/001-overview.md](../170-multi-currency-and-fx/001-overview.md)
