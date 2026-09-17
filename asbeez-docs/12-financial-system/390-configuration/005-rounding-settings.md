# Rounding Settings

> **Document:** 12-financial-system/390-configuration/005-rounding-settings.md

---

## Purpose

Rounding settings define decimal precision, minor-unit scale, rounding mode, allocation remainder, tax/fee/commission treatment, and cross-currency behavior.

## Rules

Rounding is deterministic, policy/version aware, currency/entity/country scoped, and recorded at the point of calculation. Allocation remainders use a documented stable rule and never disappear. Historical calculations retain the settings used; changing rounding creates a new effective policy and requires regression/reconciliation testing.

## Controls

Test half-up/half-even or other approved mode, negative/zero amounts, split allocations, tax, discounts, fees, FX, refunds, partial payments, and multi-line totals. A rounding difference is explicit evidence, not an untracked balance adjustment.

## Related Documents

- [000-index.md](000-index.md)
- [004-currency-settings.md](004-currency-settings.md)
- [014-tax-settings.md](014-tax-settings.md)
- [../360-testing/005-double-entry-validation.md](../360-testing/005-double-entry-validation.md)
