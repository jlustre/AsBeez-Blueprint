# Concurrency Control

> **Document:** 12-financial-system/290-architecture/010-concurrency-control.md

---

## Purpose

Concurrency control prevents lost updates, double spending, duplicate postings, conflicting approvals, stale policy use, and inconsistent financial state.

## Controls

Optimistic aggregate versioning, database constraints, unique idempotency keys, row/partition locks where necessary, reservation/hold atomicity, serial posting, and conflict retry/rejection.

## Rules

Never rely on cached balances for authorization. Wallet, payout, reserve, ledger, settlement, tax, reward conversion, and account changes validate current version and policy. Deadlocks/timeouts fail safely and do not imply financial success.

## Evidence

Conflicts, retries, locks, stale versions, rejected commands, timeout recovery, and successful commits are observable with aggregate, command, actor/service, policy, and correlation references.

## Related Documents

- [000-index.md](000-index.md)
- [005-double-entry-ledger-architecture.md](005-double-entry-ledger-architecture.md)
- [009-idempotency.md](009-idempotency.md)
- [011-consistency-model.md](011-consistency-model.md)
