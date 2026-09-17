# Currency Conversion

> **Document:** 12-financial-system/170-multi-currency-and-fx/010-currency-conversion.md

---

## Purpose

Currency conversion transforms an approved amount from source currency to target currency using a selected rate, spread, fee, timestamp, and rounding policy.

## Required Output

Conversion ID, source/target amounts and currencies, rate, source/provider, rate time, lock/reference, spread, fee, rounding, payer/beneficiary, country/entity, purpose, policy version, and accounting/subledger links.

## Rules

- source amount and currency remain immutable;
- conversion requires approved rate, supported currencies, limits, and compliance;
- FX fee is separate from gain/loss, tax, platform revenue, vendor/partner amount, and reward value;
- conversion does not change original order, invoice, payment, settlement, or wallet history; and
- failed or uncertain conversion is reconciled before retry or release.

## Related Documents

- [000-index.md](000-index.md)
- [007-exchange-rates.md](007-exchange-rates.md)
- [009-rate-locking.md](009-rate-locking.md)
- [012-rounding-and-precision.md](012-rounding-and-precision.md)
