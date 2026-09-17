# Payment Retries

> **Document:** 12-financial-system/070-payments/009-payment-retries.md

---

## Purpose

Retries recover transient payment failures without duplicating authorization, capture, refund, payout, or ledger effects.

## Retry Rules

- retry only transient or explicitly retryable states;
- reuse the same intent but create a distinct attempt ID;
- preserve provider idempotency keys and AsBeez correlation IDs;
- apply backoff, maximum attempts, customer and provider limits;
- never retry after a confirmed success without reconciliation; and
- move exhausted attempts to a terminal state with support/reconciliation action.

## Unknown Outcomes

When a provider timeout leaves success uncertain, query provider state before retrying. If evidence remains unavailable, quarantine the attempt and prevent downstream financial effects until resolved.

## Related Documents

- [000-index.md](000-index.md)
- [008-payment-failures.md](008-payment-failures.md)
- [016-payment-provider-integration.md](016-payment-provider-integration.md)
- [021-payment-events.md](021-payment-events.md)
