# Offline Payments

> **Document:** 12-financial-system/070-payments/012-offline-payments.md

---

## Purpose

Offline payments record cash, voucher, terminal, agent, or deferred evidence collected outside the immediate online provider flow and later submitted for validation and reconciliation.

## Required Evidence

Offline payment ID, order/invoice, collector/provider, amount, currency, country, collection time/location, receipt or instrument reference, customer, approval, deposit/settlement evidence, and operator identity.

## Rules

An offline record is pending until evidence and funds are verified. It does not complete the order, create RP, ABC, AHC, vendor settlement, or revenue by entry alone. Duplicate receipts, altered evidence, short deposits, and delayed submissions become fraud or reconciliation exceptions.

## Related Documents

- [000-index.md](000-index.md)
- [006-payment-capture.md](006-payment-capture.md)
- [013-bank-transfers.md](013-bank-transfers.md)
- [018-payment-reconciliation.md](018-payment-reconciliation.md)
