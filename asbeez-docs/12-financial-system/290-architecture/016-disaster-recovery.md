# Disaster Recovery

> **Document:** 12-financial-system/290-architecture/016-disaster-recovery.md

---

## Purpose

Disaster recovery restores AsBeez financial operations, records, evidence, integrations, projections, and controls after infrastructure, provider, security, data, or regional failure.

## Recovery Requirements

Define RTO/RPO by capability, immutable ledger backup, source/event/outbox recovery, key/secrets recovery, provider/bank evidence, country/entity data, reconciliation, report rebuild, wallet/settlement safety, and communication.

## Rules

Recovery never invents or duplicates financial effects. Uncertain external operations are reconciled before retry. Restored projections are compared to ledger/control totals; recovered data retains integrity, retention, legal hold, access, and audit evidence.

## Testing

Run restore, failover, replay, provider outage, key compromise, region loss, data corruption, and manual-continuity exercises with findings and remediation.

## Related Documents

- [000-index.md](000-index.md)
- [014-multi-region-architecture.md](014-multi-region-architecture.md)
- [015-high-availability.md](015-high-availability.md)
- [017-performance.md](017-performance.md)
