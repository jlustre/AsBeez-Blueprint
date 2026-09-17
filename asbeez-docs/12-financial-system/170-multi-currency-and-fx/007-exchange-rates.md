# Exchange Rates

> **Document:** 12-financial-system/170-multi-currency-and-fx/007-exchange-rates.md

---

## Purpose

Exchange rates define the approved relationship between a base and quote currency for pricing, conversion, settlement, reporting, or revaluation.

## Required Data

Base/quote currency, rate, inverse where applicable, source/provider, rate type, timestamp, effective period, confidence/quality, spread, fee, rounding, and approval/status.

## Rules

Rates are versioned, time-stamped, sourced, and immutable once used in a posted transaction. Stale, missing, conflicting, or outlier rates block conversion or route to review. Historical transactions use the rate selected at the event/lock time, not the current rate.

## Reporting

Rate reports retain provider comparison, fallback selection, freshness, quality, spread, fee, rejected/outlier values, and every transaction or revaluation that used the rate.

## Related Documents

- [000-index.md](000-index.md)
- [008-rate-providers.md](008-rate-providers.md)
- [009-rate-locking.md](009-rate-locking.md)
- [010-currency-conversion.md](010-currency-conversion.md)
