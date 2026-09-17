# Role And Permission Management

> **Document:** 12-financial-system/380-administration/019-role-and-permission-management.md

---

## Purpose

Role and permission administration controls who may view, initiate, approve, execute, certify, configure, investigate, export, or administer financial resources and actions.

## Controls

Use least privilege, RBAC/ABAC, entity/country scope, resource ownership, amount/threshold, purpose, time-bound elevation, MFA, dual control, separation of duties, joiner/mover/leaver, periodic recertification, and emergency access review.

## Rules

No actor approves their own restricted action or bypasses ledger, payout, reserve, tax, period, reconciliation, compliance, privacy, or audit controls. Permission decisions are evaluated at execution, logged with policy/version and authentication strength, and revoked promptly when role/scope changes.

## Related Documents

- [000-index.md](000-index.md)
- [018-configuration-management.md](018-configuration-management.md)
- [020-audit-management.md](020-audit-management.md)
- [../310-api/003-authorization.md](../310-api/003-authorization.md)
