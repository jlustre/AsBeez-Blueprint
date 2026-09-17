# Rounding And Precision

> **Document:** 12-financial-system/170-multi-currency-and-fx/012-rounding-and-precision.md

---

## Purpose

Rounding and precision define how monetary and FX values are represented, calculated, displayed, settled, reported, and posted without losing or inventing value.

## Rules

- currency exponent and minor unit are explicit;
- calculations use decimal/integer-safe arithmetic, never binary floating point;
- rounding mode and boundary are policy-controlled;
- line, invoice, settlement, payout, tax, and reporting residuals are recorded; and
- historical values retain the precision and rounding policy used at the time.

## Reconciliation

Rounding differences reconcile among source transactions, conversions, tax lines, settlements, provider evidence, and GL accounts. Differences outside permitted tolerance create an exception rather than being discarded.

## Related Documents

- [000-index.md](000-index.md)
- [010-currency-conversion.md](010-currency-conversion.md)
- [013-cross-border-settlement.md](013-cross-border-settlement.md)
- [014-fx-reconciliation.md](014-fx-reconciliation.md)
