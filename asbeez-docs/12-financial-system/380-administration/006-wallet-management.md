# Wallet Management

> **Document:** 12-financial-system/380-administration/006-wallet-management.md

---

## Purpose

Wallet administration manages wallet type, owner, currency/unit, limits, status, holds, reservations, compliance, statements, and controlled movement requests.

## Permitted Actions

Create/activate/lock wallet, review balances and movements, set approved limits, place/release controlled holds or reserves, investigate mismatch, and request credit/debit/transfer/redemption/payout through domain APIs.

## Rules

Administrators cannot write balances, bypass holds, change historical movements, convert RP/ABC/AHC by field edit, or choose unrestricted account mappings. Monetary actions require current version, authorization, idempotency, policy, compliance/risk, currency, country, and ledger/reconciliation evidence.

## Related Documents

- [000-index.md](000-index.md)
- [019-role-and-permission-management.md](019-role-and-permission-management.md)
- [015-reconciliation-management.md](015-reconciliation-management.md)
- [../300-data-model/005-wallet-schema.md](../300-data-model/005-wallet-schema.md)
