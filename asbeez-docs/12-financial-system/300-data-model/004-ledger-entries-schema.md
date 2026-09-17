# Ledger Entries Schema

> **Document:** 12-financial-system/300-data-model/004-ledger-entries-schema.md

---

## Purpose

Ledger lines are the immutable debit and credit records attached to a journal and used to calculate account balances and control totals.

## Core Fields

`ledger_entry_id`, `journal_id`, `line_number`, `account_id`, `debit_minor`, `credit_minor`, `currency`, `base_debit_minor`, `base_credit_minor`, `entity_id`, `country_code`, `dimensions`, `source_reference`, `created_at`, and `schema_version`.

## Rules

Exactly one of debit or credit is positive on a line; both are zero only for non-posting metadata records, which are not ledger lines. Amounts are non-negative integers. Lines inherit the posted journal’s period, policy, entity, country, and currency context. Lines are append-only and corrections use reversal/compensation.

## Balances and Dimensions

Balances are projections or materialized aggregates derived from posted lines. Dimensions may include vendor, partner, member, wallet, product, order, payment, tax, reserve, channel, and region. Dimensions explain allocation but never change double-entry authority.

## Related Documents

- [000-index.md](000-index.md)
- [003-journal-entries-schema.md](003-journal-entries-schema.md)
- [002-financial-accounts-schema.md](002-financial-accounts-schema.md)
- [../030-general-ledger/013-ledger-reconciliation.md](../030-general-ledger/013-ledger-reconciliation.md)
