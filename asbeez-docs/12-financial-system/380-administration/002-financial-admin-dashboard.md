# Financial Admin Dashboard

> **Document:** 12-financial-system/380-administration/002-financial-admin-dashboard.md

---

## Purpose

The financial admin dashboard provides role-scoped visibility into system health, financial queues, ledger/control totals, reconciliation, close, payments, payouts, refunds, disputes, tax, reserves, treasury, incidents, and approvals.

## Dashboard Requirements

Every panel identifies source, freshness, entity/country/currency/period, status, certification, owner, severity, and drill-through evidence. Show pending, unknown, held, failed, exception, provider-evidence, and certified states distinctly.

## Action Boundary

Dashboard actions initiate separately authorized commands and show confirmation, idempotency, approval, impact, and audit requirements. The dashboard cannot directly edit balances, post journals, release reserves, mark provider operations complete, close periods, certify reports, or bypass controls.

## Related Documents

- [000-index.md](000-index.md)
- [003-account-management.md](003-account-management.md)
- [015-reconciliation-management.md](015-reconciliation-management.md)
- [020-audit-management.md](020-audit-management.md)
