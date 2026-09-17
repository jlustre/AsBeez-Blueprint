# Payout API

> **Document:** 12-financial-system/310-api/012-payout-api.md

---

## Purpose

The Payout API exposes recipient eligibility, withdrawal requests, approvals, batch status, provider evidence, failures, returns, and payout reconciliation.

## Queries

Retrieve payout, recipient/destination token, amount/currency, fee, reserve/hold, approval, provider, batch, status, and reconciliation state within authorized scope.

## Commands

Request withdrawal, validate destination, approve, cancel before submission, retry an eligible failure, or investigate an uncertain provider result. Commands require idempotency, balance/reserve, limits, identity, sanctions, tax, risk, country, currency, approval, and separation-of-duties checks.

## Rules

Clients cannot mark a payout paid, change destination after control lock, or bypass holds and reserves. Provider success is evidence until reconciled. Failed/returned payouts use explicit compensating wallet and ledger effects.

## Related Documents

- [000-index.md](000-index.md)
- [005-idempotency.md](005-idempotency.md)
- [010-wallet-api.md](010-wallet-api.md)
- [../300-data-model/007-payout-schema.md](../300-data-model/007-payout-schema.md)
- [../080-payouts-and-withdrawals/001-overview.md](../080-payouts-and-withdrawals/001-overview.md)
