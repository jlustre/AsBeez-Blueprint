# Overview

> **Document:** 12-financial-system/170-multi-currency-and-fx/001-overview.md

---

## Purpose

Multi-Currency and FX governs currencies, exchange rates, conversion, settlement, revaluation, gains/losses, rounding, cross-border obligations, reconciliation, and risk across AsBeez entities and countries.

## AsBeez Boundary

Orders, invoices, payments, wallets, vendor/partner settlements, payouts, taxes, fees, rewards, and ledger entries preserve their original currency. Transaction, settlement, wallet, functional, base, and reporting currencies are separate contexts and cannot be silently substituted.

## Principles

- every monetary amount carries currency, precision, and policy;
- conversions preserve source amount, target amount, rate, source, timestamp, spread, fee, and rounding;
- historical transactions are not recalculated using current rates;
- FX fees are separate from realized/unrealized gain/loss and platform revenue;
- cross-border tax, vendor, partner, reward, payout, and settlement obligations retain local evidence; and
- rates, locks, revaluation, and exceptions reconcile to providers and the General Ledger.

## Related Documents

- [000-index.md](000-index.md)
- [002-currency-domain-model.md](002-currency-domain-model.md)
- [007-exchange-rates.md](007-exchange-rates.md)
- [014-fx-reconciliation.md](014-fx-reconciliation.md)
