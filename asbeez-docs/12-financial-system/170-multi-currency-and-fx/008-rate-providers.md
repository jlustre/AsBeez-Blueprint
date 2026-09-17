# Rate Providers

> **Document:** 12-financial-system/170-multi-currency-and-fx/008-rate-providers.md

---

## Purpose

Rate providers supply market, provider, treasury, tax, or accounting rates used by AsBeez workflows.

## Provider Data

Provider ID, source type, base/quote currencies, timestamp, rate, precision, availability, SLA, licensing, fallback rank, quality score, and effective policy.

## Rules

Provider rates are validated for freshness, completeness, outliers, and currency support. Fallbacks are deterministic and recorded. A provider outage cannot silently substitute a current or estimated rate into a historical transaction.

## Governance

Rate sources, credentials, licensing, fallback hierarchy, and approval ownership are controlled by Finance/Treasury. Provider changes are versioned and monitored against settlement and reconciliation differences.

## Related Documents

- [000-index.md](000-index.md)
- [007-exchange-rates.md](007-exchange-rates.md)
- [009-rate-locking.md](009-rate-locking.md)
- [015-fx-risk-management.md](015-fx-risk-management.md)
