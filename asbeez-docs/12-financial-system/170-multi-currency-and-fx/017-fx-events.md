# FX Events

> **Document:** 12-financial-system/170-multi-currency-and-fx/017-fx-events.md

---

## Purpose

FX events are immutable facts for currency support, rate publication, locking, conversion, settlement, revaluation, gains/losses, risk, and reconciliation.

## Event Catalog

- CurrencyEnabled, CurrencySuspended, CurrencyPolicyPublished;
- ExchangeRatePublished, ExchangeRateRejected, RateLockCreated, RateLockExpired;
- ConversionQuoted, ConversionApproved, ConversionCompleted, ConversionFailed;
- FXFeeRecorded, RealizedGainLossRecorded, RevaluationPosted;
- CrossBorderSettlementInitiated, CrossBorderSettlementCompleted;
- FXReconciliationMatched, FXExceptionOpened/Resolved; and
- FXRiskLimitBreached.

## Contract

Events include ID/version, source/target currencies and amounts, rate/source/timestamp, lock, spread/fee, rounding, transaction/settlement/provider references, country/entity, policy version, occurred/effective time, actor/system, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. FX events do not alter original transaction currency or silently post accounting; conversion, settlement, revaluation, and GL workflows validate and reconcile independently.

## Related Documents

- [000-index.md](000-index.md)
- [007-exchange-rates.md](007-exchange-rates.md)
- [010-currency-conversion.md](010-currency-conversion.md)
- [014-fx-reconciliation.md](014-fx-reconciliation.md)
