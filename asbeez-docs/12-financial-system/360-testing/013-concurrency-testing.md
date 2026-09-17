# Concurrency Testing

> **Document:** 12-financial-system/360-testing/013-concurrency-testing.md

---

## Purpose

Concurrency tests verify that simultaneous commands do not lose updates, double spend, double post, bypass holds/reserves, approve conflicting actions, or use stale policy/state.

## Required Cases

Test concurrent wallet debit/credit/transfer, payout approval/submission, reserve fund/release, payment capture/refund, journal posting, reconciliation resolution, period lock/reopen, account mapping, event sequence, and duplicate idempotency key operations.

## Assertions

Optimistic versions, unique constraints, locks, serial posting, and atomic reservations produce one valid outcome or explicit conflict/retry. Deadlock, timeout, failover, and stale-read paths fail safely without implying financial success. Posted history remains immutable.

## Related Documents

- [000-index.md](000-index.md)
- [012-idempotency-testing.md](012-idempotency-testing.md)
- [014-replay-testing.md](014-replay-testing.md)
- [../290-architecture/010-concurrency-control.md](../290-architecture/010-concurrency-control.md)
