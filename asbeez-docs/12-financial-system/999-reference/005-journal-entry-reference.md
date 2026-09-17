# Journal Entry Reference

> **Document:** 12-financial-system/999-reference/005-journal-entry-reference.md

---

## Purpose

A journal entry is the balanced accounting header and lines created from an approved financial source effect.

## Required Content

Journal ID/number, type, source/correlation/causation, description, entity/country, transaction/base currency, accounting date, period, policy/chart version, idempotency, preparer/approver, status, lines, and reversal/compensation relationship.

## Lifecycle

Draft -> prepared -> validated -> approved -> posted -> reversed/compensated, or rejected. Posting verifies account/dimension/period/currency validity, authorization, source approval, idempotency, and equal debit/credit totals.

## Immutable Rule

Posted headers and lines cannot be edited or deleted. Errors create linked reversal or compensating entries with new audit and reconciliation evidence.

## Related Documents

- [000-index.md](000-index.md)
- [003-chart-of-accounts-reference.md](003-chart-of-accounts-reference.md)
- [006-ledger-entry-reference.md](006-ledger-entry-reference.md)
- [../300-data-model/003-journal-entries-schema.md](../300-data-model/003-journal-entries-schema.md)
