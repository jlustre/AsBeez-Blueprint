# Exception Management

> **Document:** 12-financial-system/370-operations/013-exception-management.md

---

## Purpose

Exception management provides a controlled queue for financial, provider, data, security, compliance, reconciliation, tax, close, and operational conditions that cannot complete normally.

## Exception Record

Capture type, severity, source, scope, entity/country/currency/period, amount where permitted, resource, status, owner, age, cause, evidence, policy/version, correlation, impact, due date, escalation, action, approval, resolution, and residual risk.

## Lifecycle

Detected, triaged, assigned, investigating, awaiting source/provider, action proposed, approved, remediated, reconciled, verified, closed, or reopened. Critical/material exceptions require dual review and management escalation.

## Rules

Do not suppress, overwrite, manually balance, blind-retry, or close an exception without evidence. Resolution may be a source correction, retry after uncertainty, compensating entry, hold/release workflow, provider escalation, policy decision, or accepted risk with authority.

## Related Documents

- [000-index.md](000-index.md)
- [008-reconciliation-operations.md](008-reconciliation-operations.md)
- [014-incident-management.md](014-incident-management.md)
- [../350-observability/013-alerting.md](../350-observability/013-alerting.md)
