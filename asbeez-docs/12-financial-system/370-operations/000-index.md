# Operations

> **Document:** 12-financial-system/370-operations/000-index.md

---

## Purpose

This section defines Financial System operations, including operating model, daily ops, payment/payout/refund/dispute/reconciliation/close/treasury/tax operations, support, exception and incident management, business continuity, disaster recovery, and runbooks.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-operating-model.md](002-operating-model.md) - Operating Model
- [003-daily-financial-operations.md](003-daily-financial-operations.md) - Daily Financial Operations
- [004-payment-operations.md](004-payment-operations.md) - Payment Operations
- [005-payout-operations.md](005-payout-operations.md) - Payout Operations
- [006-refund-operations.md](006-refund-operations.md) - Refund Operations
- [007-dispute-operations.md](007-dispute-operations.md) - Dispute Operations
- [008-reconciliation-operations.md](008-reconciliation-operations.md) - Reconciliation Operations
- [009-period-close-operations.md](009-period-close-operations.md) - Period Close Operations
- [010-treasury-operations.md](010-treasury-operations.md) - Treasury Operations
- [011-tax-operations.md](011-tax-operations.md) - Tax Operations
- [012-financial-support.md](012-financial-support.md) - Financial Support
- [013-exception-management.md](013-exception-management.md) - Exception Management
- [014-incident-management.md](014-incident-management.md) - Incident Management
- [015-business-continuity.md](015-business-continuity.md) - Business Continuity
- [016-disaster-recovery.md](016-disaster-recovery.md) - Disaster Recovery
- [017-runbooks.md](017-runbooks.md) - Runbooks
- [018-future-roadmap.md](018-future-roadmap.md) - Future Roadmap

## Design Authority

Financial Operations owns operating procedures, roles, queues, handoffs, runbooks, support, exceptions, incidents, continuity, recovery, and operational evidence. Domain owners retain policy and financial decisions; the General Ledger, reconciliation, compliance, security, and audit authorities remain controlling.

## Operating Authority

Operations may observe, triage, communicate, initiate approved workflows, pause/queue/isolate safely, and escalate. Operations cannot directly edit posted accounting or balances, mark provider uncertainty successful, release restricted value, bypass approval, suppress exceptions, or certify/close without authority and evidence.

## Implementation Sequence

1. Establish operating model, daily controls, ownership, support, queues, handoffs, runbooks, and escalation.
2. Operationalize payment, payout, refund, dispute, reconciliation, close, treasury, tax, and exception workflows.
3. Establish incident, continuity, disaster recovery, provider uncertainty, security, compliance, and evidence procedures.
4. Connect operations to observability, testing, audit, reconciliation, SLOs, and remediation.
5. Exercise failure, outage, close, recovery, security, country/entity, and high-volume scenarios before production scale.

## Related Documents

- [001-overview.md](001-overview.md)
- [002-operating-model.md](002-operating-model.md)
- [013-exception-management.md](013-exception-management.md)
- [014-incident-management.md](014-incident-management.md)
- [017-runbooks.md](017-runbooks.md)
- [../350-observability/016-incident-management.md](../350-observability/016-incident-management.md)
