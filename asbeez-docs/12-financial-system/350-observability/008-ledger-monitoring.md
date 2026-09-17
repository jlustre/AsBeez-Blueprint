# Ledger Monitoring

> **Document:** 12-financial-system/350-observability/008-ledger-monitoring.md

---

## Purpose

Ledger monitoring detects imbalance, posting failure, duplicate or missing journal effects, stale projections, invalid account/period use, unexpected volume, and reconciliation drift.

## Signals

Track debit/credit equality, journal status/age, posting latency, rejected/duplicate/idempotency conflicts, reversal/compensation links, account activity, period blocks, dimension completeness, control-account balances, projection lag, event/outbox lag, and ledger-to-subledger/report control totals by entity/country/currency/period.

## Response

Critical integrity signals pause affected workflows and page ledger/control owners. Operators investigate source, policy, version, concurrency, mapping, and provider evidence; they do not edit posted lines or suppress imbalance. Corrections use approved reversals/compensating entries and reconciliation.

## Related Documents

- [000-index.md](000-index.md)
- [002-financial-metrics.md](002-financial-metrics.md)
- [013-alerting.md](013-alerting.md)
- [../300-data-model/003-journal-entries-schema.md](../300-data-model/003-journal-entries-schema.md)
