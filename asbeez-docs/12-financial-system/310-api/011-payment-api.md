# Payment API

> **Document:** 12-financial-system/310-api/011-payment-api.md

---

## Purpose

The Payment API exposes payment intents, methods, authorization, capture, settlement, provider evidence, refunds, disputes, and reconciliation state.

## Queries

Retrieve intent, attempt, authorization, capture, settlement, fee, refund, dispute, provider, risk, and reconciliation status. Responses distinguish customer-safe state from internal provider, risk, and accounting detail.

## Commands

Create/cancel intent, confirm method, authorize, capture, void, request refund, retry/query uncertain attempt, or submit dispute evidence where authorized. Server calculates amount, tax, allocations, fees, and policy treatment.

## Rules

Every effectful command uses authorization, idempotency, correlation, risk/compliance, currency, country, provider, and order validation. Payment capture is not automatically revenue. Provider callbacks are deduplicated evidence and reconciled before accounting effects.

## Related Documents

- [000-index.md](000-index.md)
- [005-idempotency.md](005-idempotency.md)
- [014-refund-api.md](014-refund-api.md)
- [021-webhooks.md](021-webhooks.md)
- [../300-data-model/006-payment-schema.md](../300-data-model/006-payment-schema.md)
