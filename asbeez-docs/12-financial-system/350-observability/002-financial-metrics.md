# Financial Metrics

> **Document:** 12-financial-system/350-observability/002-financial-metrics.md

---

## Purpose

Financial metrics monitor the integrity, volume, aging, exposure, and control status of monetary operations and accounting outputs.

## Metric Families

Posted debit/credit totals and balance, trial-balance equality, wallet available/held/reserved value, payment capture/settlement, payout obligations, refunds, disputes, tax payable/collected/withheld, reserves, FX exposure, vendor/partner liabilities, revenue recognition, reconciliation differences, close progress, and reporting freshness.

## Dimensions and Rules

Measure by entity, country, currency, period, account, context, provider, source, status, and policy version. Separate count, amount, rate, age, latency, pending, unknown, failed, reversed, and certified metrics. Metrics are derived views and never substitute for ledger, subledger, or reconciliation records.

## Related Documents

- [000-index.md](000-index.md)
- [008-ledger-monitoring.md](008-ledger-monitoring.md)
- [011-reconciliation-monitoring.md](011-reconciliation-monitoring.md)
- [../300-data-model/014-reconciliation-schema.md](../300-data-model/014-reconciliation-schema.md)
