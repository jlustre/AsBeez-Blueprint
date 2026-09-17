# Ledger Entry Reference

> **Document:** 12-financial-system/999-reference/006-ledger-entry-reference.md

---

## Purpose

Ledger entries are immutable debit/credit lines attached to a posted journal and used to derive balances, control totals, statements, and reports.

## Required Content

Entry ID, journal ID, line number, account/chart version, debit/credit minor units, currency/base amount, entity/country, period, dimensions, source reference, policy, timestamps, and schema version.

## Invariants

Amounts are non-negative integer minor units; a posting line has one side; the journal balances; account, period, currency, dimensions, source, and policy are valid; and corrections link to reversal/compensation rather than mutation.

## Derived Views

Balances, statements, subledger control totals, reports, analytics, and reconciliation views are projections derived from posted entries and disclose source position, freshness, period, currency, entity, country, and certification.

## Related Documents

- [000-index.md](000-index.md)
- [005-journal-entry-reference.md](005-journal-entry-reference.md)
- [015-reconciliation-reference.md](015-reconciliation-reference.md)
- [../300-data-model/004-ledger-entries-schema.md](../300-data-model/004-ledger-entries-schema.md)
