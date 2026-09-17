# Transaction Type Catalog

> **Document:** 12-financial-system/999-reference/004-transaction-type-catalog.md

---

## Purpose

Transaction types classify financial source events and determine required validation, policy, workflow, accounting mapping, subledger, reconciliation, and audit treatment.

## Catalog

Order completion, payment authorization/capture/settlement, invoice issue/payment, vendor/partner settlement, wallet credit/debit/transfer/hold/reserve, reward monetary treatment, fee/commission, refund/return/cancellation, chargeback/dispute, payout/return, tax collection/withholding/remittance, FX conversion/gain/loss, reserve funding/release, treasury transfer, reconciliation adjustment, accrual/deferral, and close correction.

## Required Metadata

Type/version, source, actor, entity/country, currency, amount/unit, policy, account mapping, dimensions, period, idempotency, approval, correlation/causation, event, subledger, and reconciliation references.

## Rules

A transaction type is not a journal until approved mapping and double-entry validation succeed. New types require accounting, tax, risk, compliance, reporting, API/event, test, and operational review.

## Related Documents

- [000-index.md](000-index.md)
- [005-journal-entry-reference.md](005-journal-entry-reference.md)
- [011-events-reference.md](011-events-reference.md)
- [../030-general-ledger/019-asbeez-posting-mappings.md](../030-general-ledger/019-asbeez-posting-mappings.md)
