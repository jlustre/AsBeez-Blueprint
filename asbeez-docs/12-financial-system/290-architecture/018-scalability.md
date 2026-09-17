# Scalability

> **Document:** 12-financial-system/290-architecture/018-scalability.md

---

## Purpose

Scalability allows AsBeez financial workloads to grow across orders, providers, vendors, partners, rewards, countries, currencies, reports, and events while preserving financial guarantees.

## Scaling Strategies

Modular bounded contexts, horizontal workers, partitioned data, read projections, batch processing, rate-aware providers, archival, regional deployment, queue backpressure, and controlled report workloads.

## Rules

Scaling cannot duplicate journal/payout/reward effects, violate ordering or ownership, cross country/entity isolation, or use eventual projections as authorization. Partition/replay/rebuild operations are versioned, observable, and reconciled.

## Related Documents

- [000-index.md](000-index.md)
- [012-data-partitioning.md](012-data-partitioning.md)
- [014-multi-region-architecture.md](014-multi-region-architecture.md)
- [017-performance.md](017-performance.md)
