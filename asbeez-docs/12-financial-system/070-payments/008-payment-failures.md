# Payment Failures

> **Document:** 12-financial-system/070-payments/008-payment-failures.md

---

## Purpose

Payment failures record why an intent, authorization, capture, refund, or provider settlement did not complete and what recovery path is permitted.

## Failure Classes

- customer action required;
- method or provider decline;
- risk, compliance, or country restriction;
- timeout or communication uncertainty;
- duplicate or idempotency conflict;
- amount, currency, or order mismatch;
- provider settlement difference; and
- permanent operational or technical failure.

## Rules

Failure state is explicit and does not imply that funds did not move. Unknown outcomes require provider inquiry and reconciliation. A failed payment cannot create an order completion, RP event, ABC eligibility, AHC event, vendor settlement, or revenue recognition without a later validated success event.

## Related Documents

- [000-index.md](000-index.md)
- [004-payment-intents.md](004-payment-intents.md)
- [009-payment-retries.md](009-payment-retries.md)
- [018-payment-reconciliation.md](018-payment-reconciliation.md)
