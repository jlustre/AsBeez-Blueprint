# Separation Of Duties

> **Document:** 12-financial-system/280-security/006-separation-of-duties.md

---

## Purpose

Security separation of duties prevents one actor or service from initiating, approving, executing, reversing, reconciling, and certifying the same material financial action.

## Protected Operations

Ledger posting, refunds, payouts, transfers, reserves, tax filing/remittance, reward classification, vendor/partner settlement, risk overrides, reconciliation resolution, close, policy, access, and report certification.

## Rules

Conflicting permissions are denied or require documented compensating control. Emergency access is time-limited, reasoned, monitored, and reviewed. Service accounts follow the same separation principles as people.

## Review Evidence

Access conflicts, compensating controls, emergency use, periodic reviews, revoked grants, and unresolved conflicts are reported by actor, service, role, entity, country, operation, owner, and review period.

## Related Documents

- [000-index.md](000-index.md)
- [004-authorization.md](004-authorization.md)
- [008-multi-factor-approval.md](008-multi-factor-approval.md)
- [016-security-monitoring.md](016-security-monitoring.md)
