# Ledger Posting

> **Document:** 12-financial-system/030-general-ledger/007-ledger-posting.md

---

## Purpose

Posting is the controlled act of committing a validated journal entry to the immutable General Ledger.

## Validation Gates

Before posting, the engine validates:

- entry is approved and not already posted;
- idempotency key has no conflicting effect;
- all accounts exist, are active, and accept posting;
- debits equal credits;
- currency and exchange evidence are complete;
- required entity, jurisdiction, and dimensions are present;
- posting period is open;
- source fact and policy version are valid; and
- actor and approval requirements are satisfied.

## Atomic Commit

The posting transaction commits the journal header, lines, posting status, balance update or projection instruction, audit record, and outbox event atomically. A provider call or notification is never treated as proof that posting succeeded.

## Failure Handling

Validation failures return typed reasons and leave no posted effect. Infrastructure failures are retried safely using idempotency. An uncertain commit is resolved by querying the ledger and source reference, not by blindly retrying a new entry.

## Related Documents

- [000-index.md](000-index.md)
- [003-double-entry-accounting.md](003-double-entry-accounting.md)
- [006-ledger-batches.md](006-ledger-batches.md)
- [008-ledger-balancing.md](008-ledger-balancing.md)
