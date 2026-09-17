# Performance Testing

> **Document:** 12-financial-system/360-testing/015-performance-testing.md

---

## Purpose

Performance tests verify predictable latency, throughput, queue freshness, database behavior, provider interaction, reconciliation, reporting, and control execution under representative financial workloads.

## Required Measures

Measure command/query latency, journal posting, wallet movement, payment/payout, event/outbox, projection, reconciliation, report, close, API, provider, lock/contention, error/retry, and resource usage by entity/country/currency/provider/workload.

## Assertions

Performance improvements cannot weaken validation, authorization, idempotency, ledger serialization, audit, privacy, reconciliation, or safe pending/unknown state. Test cold/warm cache, provider latency, rate limits, database contention, failures, recovery, and peak close/settlement windows.

## Related Documents

- [000-index.md](000-index.md)
- [016-load-testing.md](016-load-testing.md)
- [013-concurrency-testing.md](013-concurrency-testing.md)
- [../290-architecture/017-performance.md](../290-architecture/017-performance.md)
