# Payment Provider Integration

> **Document:** 12-financial-system/070-payments/016-payment-provider-integration.md

---

## Purpose

Provider integration adapts AsBeez payment commands, callbacks, settlement reports, fees, refunds, disputes, and capabilities to provider-specific contracts without leaking provider semantics into the core domain.

## Adapter Responsibilities

- tokenize or reference payment methods;
- create and update intents and attempts;
- authorize, capture, void, refund, and query status;
- verify webhook signatures and deduplicate callbacks;
- import settlement, fee, dispute, and balance evidence; and
- translate provider states through versioned mappings.

## Rules

Provider credentials are secret-managed and scoped. Calls have timeouts, idempotency, correlation, retries, and audit logs. A provider response is not considered final until the relevant AsBeez state and reconciliation evidence are stored.

## Related Documents

- [000-index.md](000-index.md)
- [009-payment-retries.md](009-payment-retries.md)
- [017-payment-routing.md](017-payment-routing.md)
- [021-payment-events.md](021-payment-events.md)
