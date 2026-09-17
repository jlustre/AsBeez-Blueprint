# Bank Transfers

> **Document:** 12-financial-system/070-payments/013-bank-transfers.md

---

## Purpose

Bank transfers support customer funding, vendor/partner settlement, refunds, treasury movement, and other approved financial operations through bank rails.

## Required Data

Transfer ID, direction, sender/beneficiary references, bank/provider, account token, amount, currency, country/entity, purpose, order/invoice/settlement/payout reference, status, confirmation, and bank statement evidence.

## Rules

Incoming transfer funds remain unidentified or pending until matched and verified. Outbound transfers require approved payable, beneficiary verification, sanctions/compliance, limits, and authorization. A bank transfer does not automatically mean a marketplace order is complete or a reward is qualified.

## Reconciliation

Bank statement lines, provider messages, transfer records, clearing accounts, and GL entries reconcile by reference, amount, currency, date, and beneficiary. Unknown or mismatched funds enter controlled exception handling.

## Related Documents

- [000-index.md](000-index.md)
- [007-payment-settlement.md](007-payment-settlement.md)
- [016-payment-provider-integration.md](016-payment-provider-integration.md)
- [018-payment-reconciliation.md](018-payment-reconciliation.md)
