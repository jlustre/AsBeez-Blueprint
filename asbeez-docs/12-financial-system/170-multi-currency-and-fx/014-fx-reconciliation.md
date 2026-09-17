# FX Reconciliation

> **Document:** 12-financial-system/170-multi-currency-and-fx/014-fx-reconciliation.md

---

## Purpose

FX reconciliation proves that rates, conversions, fees, rounding, settlements, provider/bank evidence, revaluation, gains/losses, tax, wallets, payouts, and General Ledger entries agree.

## Required Checks

- source and target amounts/currencies agree;
- rate, source, timestamp, lock, spread, fee, and rounding match;
- provider/bank settlement agrees to conversion and payout evidence;
- realized/unrealized gain/loss and revaluation agree to policy;
- tax, vendor/partner, reserve, reward, wallet, and payout links are complete; and
- unsupported, stale, duplicate, missing, or outlier rates are exceptions.

## Outcomes

Matched, timing difference, rate difference, fee difference, rounding difference, provider mismatch, missing source, duplicate conversion, unsupported corridor, or approved adjustment. Every exception has owner, age, evidence, severity, and resolution.

## Related Documents

- [000-index.md](000-index.md)
- [010-currency-conversion.md](010-currency-conversion.md)
- [011-fx-gains-and-losses.md](011-fx-gains-and-losses.md)
- [015-fx-risk-management.md](015-fx-risk-management.md)
