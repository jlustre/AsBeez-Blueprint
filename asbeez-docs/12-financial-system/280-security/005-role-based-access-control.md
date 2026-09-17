# Role Based Access Control

> **Document:** 12-financial-system/280-security/005-role-based-access-control.md

---

## Purpose

RBAC assigns permissions to job or service roles while restricting financial access by entity, country, operation, data classification, environment, and approval state.

## Roles

Customer/member, vendor, partner, support, operations, Finance, Accounting, Treasury, Tax, Risk, Compliance, Auditor, administrator, provider integration, and service roles have distinct permissions.

## Rules

Roles do not automatically grant payout, refund, ledger, policy, export, reserve release, or risk-override permission. Sensitive roles require approval, periodic review, separation of duties, strong authentication, and audit logging.

## Role Lifecycle

```text
Requested -> Reviewed -> Approved -> Active -> Reviewed -> Revoked/Expired
```

Role grants retain requester, approver, scope, expiry, justification, review result, and revocation evidence.

## Related Documents

- [000-index.md](000-index.md)
- [004-authorization.md](004-authorization.md)
- [006-separation-of-duties.md](006-separation-of-duties.md)
- [015-data-masking.md](015-data-masking.md)
