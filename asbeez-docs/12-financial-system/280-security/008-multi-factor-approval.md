# Multi Factor Approval

> **Document:** 12-financial-system/280-security/008-multi-factor-approval.md

---

## Purpose

Multi-factor approval adds independent authentication and approval evidence to high-risk or material financial operations.

## Required Factors

Strong authenticator, hardware/security key where appropriate, trusted device/session, independent approver, transaction intent binding, step-up challenge, and recovery controls.

## Rules

Approval is bound to operation, amount, currency, beneficiary, destination, entity, country, policy, and expiry. Reuse, replay, altered payload, self-approval, or stale challenge is rejected. MFA does not replace KYC, sanctions, fraud, tax, reserve, or reconciliation controls.

## Evidence

Record factor type, challenge/request binding, approver, device/session, operation scope, result, timestamp, expiry, failure, recovery, and audit reference.

## Related Documents

- [000-index.md](000-index.md)
- [006-separation-of-duties.md](006-separation-of-duties.md)
- [007-transaction-authorization.md](007-transaction-authorization.md)
- [016-security-monitoring.md](016-security-monitoring.md)
