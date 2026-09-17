# FX Rate Providers

> **Document:** 12-financial-system/340-integrations/006-fx-rate-providers.md

---

## Purpose

FX-rate integrations provide market/reference rates, quotes, validity, spreads, fees, conversion evidence, and country/entity settlement support.

## Adapter Contract

Map source/target currency, rate type, bid/ask or applied rate, timestamp, validity window, source/provider, quote/lock ID, fee/spread, precision, market status, and fallback source. Preserve raw rate evidence and normalized rates separately.

## Rules

Rates are accepted only under currency and treasury policy, freshness, source quality, and country/entity rules. Locked rates cannot be silently replaced. Rounding is deterministic and recorded; stale/conflicting rates become exceptions. FX results retain original amounts and gain/loss treatment.

## Related Documents

- [000-index.md](000-index.md)
- [005-tax-providers.md](005-tax-providers.md)
- [016-integration-monitoring.md](016-integration-monitoring.md)
- [../170-multi-currency-and-fx/001-overview.md](../170-multi-currency-and-fx/001-overview.md)
