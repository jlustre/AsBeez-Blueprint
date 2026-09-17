# Reserve API

> **Document:** 12-financial-system/310-api/018-reserve-api.md

---

## Purpose

The Reserve API exposes reserve purpose, owner, balance, funding, holds, release conditions, approvals, and reconciliation for restricted financial value.

## Queries

Retrieve reserve type, owner, source/target account, amount/currency, country/entity, funding, release policy, status, age, linked payment/dispute/refund/vendor/partner/reward exposure, and ledger reference.

## Commands

Propose, approve, fund, increase, decrease, release, transfer, expire, close, or investigate a reserve. Commands require purpose policy, authority, current version, balance, currency, country, risk, approval, idempotency, and accounting validation.

## Rules

Reserve funds are not free cash, revenue, or an untracked liability. Clients cannot release or rewrite reserves directly. Funding and release return workflow state and are linked to wallet/subledger, ledger, reconciliation, and audit effects.

## Related Documents

- [000-index.md](000-index.md)
- [010-wallet-api.md](010-wallet-api.md)
- [015-chargeback-api.md](015-chargeback-api.md)
- [../300-data-model/013-reserve-schema.md](../300-data-model/013-reserve-schema.md)
- [../180-reserves-and-funds/001-overview.md](../180-reserves-and-funds/001-overview.md)
