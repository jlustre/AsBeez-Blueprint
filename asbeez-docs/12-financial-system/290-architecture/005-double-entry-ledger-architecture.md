# Double Entry Ledger Architecture

> **Document:** 12-financial-system/290-architecture/005-double-entry-ledger-architecture.md

---

## Purpose

The double-entry ledger is the authoritative accounting architecture for posted monetary effects across AsBeez.

## Rules

- every posted journal balances debits and credits;
- entries and lines are immutable and corrected by reversal/compensation;
- source, account/chart version, entity, country, currency, dimensions, period, policy, actor, and idempotency are retained;
- wallet, reward, vendor, partner, tax, reserve, payment, payout, and treasury subledgers map to control accounts; and
- projections/reports never replace posted ledger truth.

## Cross-Currency

Cross-currency effects include source/target amounts, rate, source, timestamp, fee, spread, rounding, and gain/loss treatment while preserving original currency.

## Related Documents

- [000-index.md](000-index.md)
- [003-cqrs-architecture.md](003-cqrs-architecture.md)
- [006-financial-orchestration.md](006-financial-orchestration.md)
- [010-concurrency-control.md](010-concurrency-control.md)
