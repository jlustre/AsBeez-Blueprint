# Currency Management

> **Document:** 12-financial-system/380-administration/013-currency-management.md

---

## Purpose

Currency administration manages supported currencies, precision, base/reporting currency, FX sources, rate policies, quotes, locks, settlement currency, rounding, and gain/loss treatment.

## Permitted Actions

Enable/disable currency under policy, review rates, approve source/fallback, lock quote, investigate stale/conflicting rate, and request controlled conversion or reconciliation.

## Rules

Original transaction and settlement currencies remain immutable evidence. Administrators cannot silently replace a locked rate, change precision, erase rounding, or rewrite gain/loss. Changes require country/entity impact, effective date, treasury/finance approval, and reconciliation.

## Related Documents

- [000-index.md](000-index.md)
- [012-tax-management.md](012-tax-management.md)
- [018-configuration-management.md](018-configuration-management.md)
- [../300-data-model/012-currency-schema.md](../300-data-model/012-currency-schema.md)
