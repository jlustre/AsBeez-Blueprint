# Authorization

> **Document:** 12-financial-system/310-api/003-authorization.md

---

## Purpose

Authorization determines whether an authenticated actor may view or request a financial operation within the subject, resource, action, entity, country, currency, amount, risk, and policy boundary.

## Controls

Use least privilege, RBAC/ABAC, resource ownership, country/entity scope, separation of duties, approval thresholds, MFA, risk decisions, purpose limitation, and time-bound elevated access. Operators cannot approve their own restricted action or bypass ledger, period, tax, reserve, payout, or reconciliation controls.

## Decision Inputs

Identity, role, service, resource, action, amount, currency, country/entity, wallet/account type, period, policy version, risk/compliance status, approval state, and idempotency context. Denials reveal only customer-safe information.

## Audit

Record allow/deny, policy version, actor, resource, reason, approval, authentication strength, correlation, and outcome. Authorization is re-evaluated at execution, not only at request creation.

## Related Documents

- [000-index.md](000-index.md)
- [002-authentication.md](002-authentication.md)
- [005-idempotency.md](005-idempotency.md)
- [../260-compliance-and-governance/001-overview.md](../260-compliance-and-governance/001-overview.md)
