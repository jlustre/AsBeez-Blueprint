# Ledger Batches

> **Document:** 12-financial-system/030-general-ledger/006-ledger-batches.md

---

## Purpose

A ledger batch groups related journal entries for controlled validation, posting, reconciliation, and operational reporting. A batch is a processing boundary, not a replacement for individual entry identity.

## Batch Data

Batch ID, source context, batch type, legal entity, currency scope, expected entry count and total, period, rule version, creation time, preparer, status, and processing result.

## Lifecycle

```text
Created -> Validating -> Ready -> Posting -> Posted
Created -> Rejected
Posting -> Failed -> Retryable | Quarantined
```

## Rules

- Every entry belongs to one batch or is explicitly marked standalone.
- Batch totals are calculated from entries and compared before posting.
- A retry reuses entry idempotency keys and cannot duplicate posted effects.
- Partial posting is prohibited unless the batch type explicitly allows independently posted entries and records the boundary.
- Failed or quarantined batches retain all evidence and require an operational resolution.

## Related Documents

- [000-index.md](000-index.md)
- [004-journal-entries.md](004-journal-entries.md)
- [007-ledger-posting.md](007-ledger-posting.md)
- [013-ledger-reconciliation.md](013-ledger-reconciliation.md)
