# Payout Management

> **Document:** 12-financial-system/380-administration/008-payout-management.md

---

## Purpose

Payout administration manages withdrawal queues, recipient eligibility, holds, approvals, batches, provider status, failures, returns, fees, liquidity, and reconciliation.

## Permitted Actions

Review eligibility/status/evidence, assign or escalate exceptions, approve under threshold and separation rules, cancel before submission, query uncertain provider state, and request controlled retry or compensation.

## Rules

Administrators cannot mark paid, alter destination after lock, release reserves, bypass sanctions/tax/risk, or retry unknown effects blindly. Payout changes require current balance/reserve, entity/country/currency, idempotency, approval, provider evidence, wallet/ledger, and reconciliation controls.

## Related Documents

- [000-index.md](000-index.md)
- [006-wallet-management.md](006-wallet-management.md)
- [010-refund-management.md](010-refund-management.md)
- [../300-data-model/007-payout-schema.md](../300-data-model/007-payout-schema.md)
