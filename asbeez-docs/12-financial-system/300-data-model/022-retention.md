# Retention

> **Document:** 12-financial-system/300-data-model/022-retention.md

---

## Purpose

Retention defines how long financial facts, evidence, access records, provider data, projections, and operational metadata remain available, protected, and recoverable.

## Retention Classes

Posted journals and ledger lines, tax/invoice records, payment/payout/refund/dispute evidence, wallet and reward accounting, reconciliation and close evidence, audit/security records, events/outbox, reports, and disposable read models each receive a policy-defined class by country/entity and legal requirement.

## Rules

Retention cannot remove records subject to statutory, tax, dispute, chargeback, audit, investigation, security, or legal hold. Deletion or anonymization is authorized, logged, irreversible where applicable, and preserves required accounting lineage and control totals. Encryption, key lifecycle, access review, backup expiry, and residency apply throughout retention.

## Disposal

Before disposal, verify owner approval, jurisdiction, hold status, dependencies, export requirements, backup behavior, and reconciliation impact. Record what was disposed, when, why, by authority, and what evidence remains.

## Related Documents

- [000-index.md](000-index.md)
- [017-audit-schema.md](017-audit-schema.md)
- [018-event-store-schema.md](018-event-store-schema.md)
- [021-partitioning.md](021-partitioning.md)
