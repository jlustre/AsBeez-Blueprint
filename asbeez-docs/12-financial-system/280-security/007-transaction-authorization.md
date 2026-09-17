# Transaction Authorization

> **Document:** 12-financial-system/280-security/007-transaction-authorization.md

---

## Purpose

Transaction authorization validates whether a financial command may execute given actor, owner, amount, currency, entity, country, operation, state, risk, compliance, limits, policy, and approval context.

## Operations

Payment, refund, wallet credit/debit/transfer, payout, fund transfer, reserve release, adjustment, journal post, policy change, tax/remittance, reward conversion, and vendor/partner settlement.

## Rules

Authorization is server-side, idempotent, state-aware, and separate from authentication. High-risk/material actions require step-up/MFA, dual approval, separation of duties, destination/beneficiary verification, and complete audit evidence. Authorization does not guarantee external provider success.

## Related Documents

- [000-index.md](000-index.md)
- [004-authorization.md](004-authorization.md)
- [008-multi-factor-approval.md](008-multi-factor-approval.md)
- [014-api-security.md](014-api-security.md)
