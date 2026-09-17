# Authentication

> **Document:** 12-financial-system/280-security/003-authentication.md

---

## Purpose

Authentication verifies the identity of customers, members, vendors, partners, staff, administrators, providers, and services before access to financial operations or data.

## Controls

Strong credentials, MFA/step-up, phishing-resistant methods where appropriate, session/device management, recovery verification, risk-based challenge, credential rotation, lockout, rate limits, and authentication event logging.

## Rules

Authentication does not grant authorization. Payout, transfer, refund, wallet, policy, ledger, export, and admin actions require separate scoped authorization and may require additional approval. Recovery never bypasses ownership, KYC, sanctions, or financial controls.

## Related Documents

- [000-index.md](000-index.md)
- [004-authorization.md](004-authorization.md)
- [008-multi-factor-approval.md](008-multi-factor-approval.md)
- [016-security-monitoring.md](016-security-monitoring.md)
