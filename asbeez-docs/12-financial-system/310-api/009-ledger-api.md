# Ledger API

> **Document:** 12-financial-system/310-api/009-ledger-api.md

---

## Purpose

The Ledger API exposes journal preparation, validation status, posted journals, ledger lines, balances, trial balances, reversals, and audit lineage under strict authority controls.

## Queries

Retrieve journal by ID/source, lines, account activity, balances by period/dimension, trial balance, posting status, reversal relationships, and reconciliation metadata. Posted results identify chart, entity, country, currency, period, policy, source, and certification.

## Commands

Submit a posting request, approve where authorized, request reversal/compensation, or investigate an exception. The API validates balanced lines, account mappings, period, currency, dimensions, source approval, idempotency, and separation of duties before posting.

## Rules

Clients cannot insert/update/delete posted journals or ledger lines. Corrections create new linked entries. Queries may be eventually consistent only when freshness and source position are disclosed.

## Related Documents

- [000-index.md](000-index.md)
- [008-financial-account-api.md](008-financial-account-api.md)
- [007-error-handling.md](007-error-handling.md)
- [../300-data-model/003-journal-entries-schema.md](../300-data-model/003-journal-entries-schema.md)
- [../290-architecture/005-double-entry-ledger-architecture.md](../290-architecture/005-double-entry-ledger-architecture.md)
