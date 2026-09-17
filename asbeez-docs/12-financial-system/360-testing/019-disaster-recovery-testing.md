# Disaster Recovery Testing

> **Document:** 12-financial-system/360-testing/019-disaster-recovery-testing.md

---

## Purpose

Disaster-recovery tests prove that financial services, records, keys, events, outbox, projections, integrations, evidence, and controls can recover within approved RTO/RPO without inventing or duplicating financial effects.

## Scenarios

Test database loss/corruption, region loss, provider outage, queue/outbox loss, event replay, projection rebuild, backup restore, key compromise/rotation, credential loss, network partition, ransomware, data deletion, close interruption, and uncertain payment/payout/refund operations.

## Assertions

Restored ledger and source evidence remain immutable and balanced; idempotency prevents duplicate effects; uncertain external operations reconcile before retry; projections compare to control totals; access, retention, legal hold, audit, country, and privacy controls survive recovery; and findings receive remediation.

## Related Documents

- [000-index.md](000-index.md)
- [014-replay-testing.md](014-replay-testing.md)
- [018-compliance-testing.md](018-compliance-testing.md)
- [../290-architecture/016-disaster-recovery.md](../290-architecture/016-disaster-recovery.md)
