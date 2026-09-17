# Currency Settings

> **Document:** 12-financial-system/390-configuration/004-currency-settings.md

---

## Purpose

Currency settings define supported currency, ISO code, minor-unit precision, base/reporting/settlement use, country/entity availability, rate source, quote validity, and FX policy.

## Rules

Original, settlement, and reporting currencies remain explicit. Unsupported currency, stale rate, source disagreement, and precision mismatch fail safely or create an exception. Locked rates cannot be silently replaced; all conversion settings retain source, timestamp, fee/spread, rounding, and gain/loss treatment.

## Change Control

Adding/disabling currency or changing precision/rate policy requires treasury, accounting, country/entity impact review, test cases, effective dating, approval, migration plan, and reconciliation of affected balances and reports.

## Related Documents

- [000-index.md](000-index.md)
- [003-country-financial-settings.md](003-country-financial-settings.md)
- [005-rounding-settings.md](005-rounding-settings.md)
- [../300-data-model/012-currency-schema.md](../300-data-model/012-currency-schema.md)
