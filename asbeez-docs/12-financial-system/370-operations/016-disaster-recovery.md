# Disaster Recovery

> **Document:** 12-financial-system/370-operations/016-disaster-recovery.md

---

## Purpose

Disaster recovery restores financial services, data, events, outbox, projections, providers, credentials, evidence, controls, and operational capability after infrastructure, region, security, or data loss.

## Recovery Procedure

Declare recovery scope and authority; protect evidence; restore identity/keys/secrets; recover authoritative database/ledger; restore events/outbox; rebuild projections; validate queues/providers; reconcile uncertain external operations; compare control totals; restore access by role; communicate; test and certify recovery.

## Rules

Recovery cannot invent, delete, duplicate, or silently reverse financial effects. Ledger remains immutable and balanced; idempotency protects retries; provider uncertainty is reconciled before retry; country/entity/privacy/retention/legal-hold/audit controls are verified. Record RTO/RPO, gaps, approvals, and remediation.

## Related Documents

- [000-index.md](000-index.md)
- [015-business-continuity.md](015-business-continuity.md)
- [017-runbooks.md](017-runbooks.md)
- [../290-architecture/016-disaster-recovery.md](../290-architecture/016-disaster-recovery.md)
