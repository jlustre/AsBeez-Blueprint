# Operations

## Purpose

This domain defines customer/vendor support, refund operations, fraud operations, compliance operations, disaster recovery, ownership, escalation, evidence, and service continuity for AsBeez.

## Operating Authority

Operations observes, triages, communicates, initiates approved workflows, and escalates. Operations cannot directly edit balances, posted journals, immutable events, provider evidence, tax history, audit records, or certifications. Financial effects use domain APIs and reconcile to authoritative sources.

## Structure

- [001-operations-overview.md](001-operations-overview.md)
- [002-customer-support.md](002-customer-support.md)
- [003-vendor-support.md](003-vendor-support.md)
- [004-refund-operations.md](004-refund-operations.md)
- [005-fraud-operations.md](005-fraud-operations.md)
- [006-compliance-operations.md](006-compliance-operations.md)
- [007-disaster-recovery.md](007-disaster-recovery.md)

## Common Control Loop

Observe -> authenticate/scope -> classify -> preserve evidence -> validate source/policy -> use approved workflow/runbook -> reconcile -> communicate -> document -> review/remediate.

## Related Documents

- [001-operations-overview.md](001-operations-overview.md)
- [005-fraud-operations.md](005-fraud-operations.md)
- [007-disaster-recovery.md](007-disaster-recovery.md)
- [../12-financial-system/370-operations/001-overview.md](../12-financial-system/370-operations/001-overview.md)
