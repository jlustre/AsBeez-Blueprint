# Payout Operations

> **Document:** 12-financial-system/370-operations/005-payout-operations.md

---

## Purpose

Payout operations manage withdrawal eligibility, holds, approvals, batches, submission, provider status, failure/return, liquidity, compliance, and reconciliation.

## Procedures

Review available/reserved balances, limits, recipient verification, sanctions/tax/risk status, destination token, country/entity/currency, approvals, provider capacity, batch aging, failed/returned payouts, and wallet/ledger control totals.

## Rules

Use dual control and separation of duties for material/high-risk payouts. Do not mark paid, change a locked destination, release a hold, or retry an unknown result manually. Provider evidence is reconciled before completion; failures and returns use approved compensating effects.

## Related Documents

- [000-index.md](000-index.md)
- [004-payment-operations.md](004-payment-operations.md)
- [010-treasury-operations.md](010-treasury-operations.md)
- [../300-data-model/007-payout-schema.md](../300-data-model/007-payout-schema.md)
