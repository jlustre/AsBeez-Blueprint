# Currency Events

> **Document:** 12-financial-system/320-events/012-currency-events.md

---

## Purpose

Currency events communicate supported-currency policy, rate observation, quote, lock, conversion, rounding, settlement, and FX reconciliation facts.

## Event Catalog

`CurrencyEnabled`, `CurrencyDisabled`, `FXRateObserved`, `FXQuoteCreated`, `FXRateLocked`, `CurrencyConverted`, `RoundingAdjusted`, `FXGainRecognized`, `FXLossRecognized`, and `FXReconciled`.

## Payload and Rules

Events include source/target currency, original and converted amounts, minor-unit scales, rate, source/provider, quote/lock time, validity, fee/spread, rounding, entity/country, policy version, and gain/loss reference. Original transaction and settlement currencies remain available. Stale or conflicting rates become exceptions.

## Related Documents

- [000-index.md](000-index.md)
- [006-payment-events.md](006-payment-events.md)
- [011-tax-events.md](011-tax-events.md)
- [../300-data-model/012-currency-schema.md](../300-data-model/012-currency-schema.md)
