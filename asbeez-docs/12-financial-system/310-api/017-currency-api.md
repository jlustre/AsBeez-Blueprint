# Currency API

> **Document:** 12-financial-system/310-api/017-currency-api.md

---

## Purpose

The Currency API exposes supported currencies, precision, country/entity policies, FX quotes, locked rates, conversions, settlement currency, and gain/loss evidence.

## Queries

Retrieve supported currencies, minor-unit scale, base/reporting currency, provider rates, quote validity, conversion status, fees/spread, and source/target amounts within authorized scope.

## Commands

Request quote, lock rate, convert, approve exception, or submit FX reconciliation. Commands validate currency support, rate freshness, country/entity policy, source funds, rounding, limits, and idempotency.

## Rules

Original transaction and settlement currencies are retained. Rates cannot be silently substituted. Responses expose applied rate, timestamp, source, fees, spread, rounding, and realized/unrealized treatment where relevant. Unsupported or stale rates produce explicit exceptions.

## Related Documents

- [000-index.md](000-index.md)
- [004-request-response-standards.md](004-request-response-standards.md)
- [016-tax-api.md](016-tax-api.md)
- [../300-data-model/012-currency-schema.md](../300-data-model/012-currency-schema.md)
- [../170-multi-currency-and-fx/001-overview.md](../170-multi-currency-and-fx/001-overview.md)
