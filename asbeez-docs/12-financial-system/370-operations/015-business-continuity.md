# Business Continuity

> **Document:** 12-financial-system/370-operations/015-business-continuity.md

---

## Purpose

Business continuity keeps critical financial operations safe during service, provider, personnel, facility, network, security, data, or regional disruption.

## Critical Operations

Ledger and controls, payment status/reconciliation, wallet safety, payout holds/approvals, refunds/disputes, treasury/liquidity, tax deadlines, close, support, compliance, incident communication, and evidence preservation receive documented fallback priorities, owners, dependencies, RTO/RPO, and degraded modes.

## Rules

Degraded operation may queue, hold, read-only, rate-limit, isolate a provider, or use approved manual continuity procedures. It cannot bypass authorization, dual control, idempotency, ledger balance, tax/compliance, country/entity, audit, or reconciliation. Manual actions are logged and later reconciled.

## Related Documents

- [000-index.md](000-index.md)
- [010-treasury-operations.md](010-treasury-operations.md)
- [016-disaster-recovery.md](016-disaster-recovery.md)
- [017-runbooks.md](017-runbooks.md)
