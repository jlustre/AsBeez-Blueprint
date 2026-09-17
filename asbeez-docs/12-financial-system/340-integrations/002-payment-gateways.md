# Payment Gateways

> **Document:** 12-financial-system/340-integrations/002-payment-gateways.md

---

## Purpose

Payment gateway integrations adapt payment intents, methods, authorization, capture, void, refunds, disputes, settlement reports, fees, capabilities, and provider webhooks.

## Adapter Contract

Map AsBeez payment/order/customer/country/currency context to provider references and capabilities. Store provider request/response evidence, status mapping, fees, settlement, decline reason class, idempotency, correlation, webhook signature result, and timestamps.

## Rules

Tokenize payment methods and keep credentials in secret management. Use provider idempotency, timeouts, bounded retries, callback deduplication, and reconciliation. Provider success or callback does not itself post revenue, settle funds, or close a payment. Unknown outcomes are queried/reconciled.

## Related Documents

- [000-index.md](000-index.md)
- [003-banking-integrations.md](003-banking-integrations.md)
- [014-webhooks.md](014-webhooks.md)
- [../070-payments/016-payment-provider-integration.md](../070-payments/016-payment-provider-integration.md)
