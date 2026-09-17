# Authorization

> **Document:** 12-financial-system/280-security/004-authorization.md

---

## Purpose

Authorization determines whether an authenticated actor or service may access data or execute an operation within role, entity, country, wallet, provider, amount, risk, and policy scope.

## Rules

Authorization is deny-by-default, least-privilege, server-side, and evaluated at object and transaction level. It checks ownership, role, status, jurisdiction, limits, approval, separation of duties, and policy version. Client fields cannot grant permissions or choose arbitrary account mappings.

## Evidence

Decisions retain actor/service, target, operation, scope, policy, reason, timestamp, authentication context, approval, and outcome. Privileged access is periodically reviewed and revoked when no longer required.

## Related Documents

- [000-index.md](000-index.md)
- [003-authentication.md](003-authentication.md)
- [005-role-based-access-control.md](005-role-based-access-control.md)
- [006-separation-of-duties.md](006-separation-of-duties.md)
