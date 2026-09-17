# Journal Entries Schema

> **Document:** 12-financial-system/300-data-model/003-journal-entries-schema.md

---

## Purpose

The journal entry is the balanced accounting transaction header that records an approved monetary effect before or at posting to the General Ledger.

## Core Fields

`journal_id`, `journal_number`, `status`, `entry_type`, `source_type`, `source_id`, `description`, `entity_id`, `country_code`, `transaction_currency`, `base_currency`, `accounting_date`, `financial_period_id`, `policy_version`, `correlation_id`, `causation_id`, `idempotency_key`, `prepared_by`, `approved_by`, `posted_at`, and `reversal_of_journal_id`.

## Lifecycle

Draft, prepared, validated, approved, posted, reversed, or rejected. Only an authorized posting operation changes a journal to posted. Posted headers and lines cannot be edited or deleted. A correction references the original journal and creates a new balanced journal.

## Invariants

Every posted journal has at least two lines, one or more debit/credit sides, one currency treatment, valid accounts and dimensions, an open period, and total debits equal to total credits in the posting currency.

## Related Documents

- [000-index.md](000-index.md)
- [002-financial-accounts-schema.md](002-financial-accounts-schema.md)
- [004-ledger-entries-schema.md](004-ledger-entries-schema.md)
- [../030-general-ledger/007-ledger-posting.md](../030-general-ledger/007-ledger-posting.md)
