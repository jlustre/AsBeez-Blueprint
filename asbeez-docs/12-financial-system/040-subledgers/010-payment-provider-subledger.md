# Payment Provider Subledger

> **Document:** 12-financial-system/040-subledgers/010-payment-provider-subledger.md

---

## Purpose

The Payment Provider Subledger mirrors provider-facing payment attempts, captures, refunds, fees, settlements, disputes, and balances so they can be reconciled to AsBeez payments and the General Ledger.

## Required Detail

Provider, account, provider transaction/reference, AsBeez payment ID, order/invoice, attempt, method type, authorization/capture/refund/dispute state, gross amount, fee, net amount, currency, settlement date, country, raw evidence reference, and import/reconciliation status.

## Rules

Provider status is mapped through a versioned translation and never copied blindly into AsBeez financial state. Duplicate callbacks are idempotent. Provider balances are external evidence, not the AsBeez GL balance, until matched and reconciled.

## Exceptions

Unknown references, amount differences, currency mismatches, duplicate events, missing settlements, and unexplained fees become owned reconciliation exceptions rather than suspense-free adjustments.

## Related Documents

- [000-index.md](000-index.md)
- [006-customer-subledger.md](006-customer-subledger.md)
- [011-refund-subledger.md](011-refund-subledger.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
