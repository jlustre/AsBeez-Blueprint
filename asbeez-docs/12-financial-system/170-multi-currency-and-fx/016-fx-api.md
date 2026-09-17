# FX API

> **Document:** 12-financial-system/170-multi-currency-and-fx/016-fx-api.md

---

## Purpose

The FX API exposes authenticated currency, rate, lock, conversion, revaluation, risk, and reconciliation views without allowing clients to write rates or accounting effects directly.

## Read Operations

- retrieve supported currencies, rate quotes, provider/source, locks, conversions, fees, gains/losses, and reconciliation status;
- retrieve original and converted amounts with timestamps and policy; and
- retrieve corridor, risk, and exception status.

## Commands

Request quote/lock, convert approved amount, revalue open balance, submit provider evidence, and resolve exception. Commands require supported currencies, rate freshness, scope, idempotency, authorization, compliance, and audit correlation.

## Rules

Clients cannot supply arbitrary rates, alter historical conversion, hide fees/gains/losses, or create tax/vendor/partner/reward/GL effects through API fields.

## Related Documents

- [000-index.md](000-index.md)
- [007-exchange-rates.md](007-exchange-rates.md)
- [009-rate-locking.md](009-rate-locking.md)
- [017-fx-events.md](017-fx-events.md)
