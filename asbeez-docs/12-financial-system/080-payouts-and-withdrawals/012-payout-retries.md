# Payout Retries

> **Document:** 12-financial-system/080-payouts-and-withdrawals/012-payout-retries.md

---

## Purpose

Payout retries recover transient provider failures without duplicating the payout, debit, settlement release, or ledger effect.

## Rules

- retry only states marked retryable by provider and policy;
- query provider status before retrying an unknown outcome;
- reuse payout idempotency and create a distinct attempt record;
- apply backoff, maximum attempts, provider limits, and batch controls;
- preserve the original approved amount and destination; and
- quarantine exhausted or uncertain payouts for operations and reconciliation.

## Retry Evidence

Each attempt records provider, request time, response or timeout, attempt number, idempotency key, reason, next retry time, operator/system, and resulting payout state. A retry never releases a hold, increases the approved amount, or creates a second payable.

## Related Documents

- [000-index.md](000-index.md)
- [006-payout-processing.md](006-payout-processing.md)
- [013-payout-failures.md](013-payout-failures.md)
- [019-payout-events.md](019-payout-events.md)
