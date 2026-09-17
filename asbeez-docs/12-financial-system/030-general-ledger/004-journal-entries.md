# Journal Entries

> **Document:** 12-financial-system/030-general-ledger/004-journal-entries.md

---

## Purpose

A journal entry is a complete proposed or posted accounting effect containing a header and balanced journal lines. It is the unit submitted to the posting engine.

## Header Fields

Entry ID, entry type, source context, source record, correlation and causation IDs, idempotency key, legal entity, transaction/effective time, posting period, currency scope, policy version, preparer, approver, and status.

## Line Fields

Line ID, account ID and number, debit or credit amount, currency, exchange-rate reference where required, dimensions, counterparty reference, tax reference, description, and source allocation.

## Lifecycle

```text
Draft -> Validated -> Approved -> Posted
Draft -> Rejected
Posted -> Reversed or Compensated
```

Draft and validated entries may be changed by authorized workflows. Approved and posted entries are immutable. A posted entry is never deleted or edited to correct an error.

## Idempotency

The source context and idempotency key uniquely identify the intended financial effect. Repeating the request returns the original result; it does not create another entry.

## Related Documents

- [000-index.md](000-index.md)
- [003-double-entry-accounting.md](003-double-entry-accounting.md)
- [007-ledger-posting.md](007-ledger-posting.md)
- [011-reversals.md](011-reversals.md)
