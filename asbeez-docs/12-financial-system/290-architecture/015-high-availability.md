# High Availability

> **Document:** 12-financial-system/290-architecture/015-high-availability.md

---

## Purpose

High availability keeps critical AsBeez financial services usable while preserving correctness, authorization, idempotency, auditability, and safe degradation.

## Critical Capabilities

Ledger posting, payments, refunds, payouts, wallets, settlement, tax, reconciliation, treasury, authentication, and control/audit services have defined availability, recovery, dependency, and degraded-mode objectives.

## Rules

Availability cannot bypass balance, period, compliance, risk, approval, or ledger controls. During provider/database/region failure, operations become pending, held, queued, read-only, or unavailable rather than silently succeeding. Failover is tested and reconciled.

## Related Documents

- [000-index.md](000-index.md)
- [014-multi-region-architecture.md](014-multi-region-architecture.md)
- [016-disaster-recovery.md](016-disaster-recovery.md)
- [018-scalability.md](018-scalability.md)
