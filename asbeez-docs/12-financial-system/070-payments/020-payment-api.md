# Payment API

> **Document:** 12-financial-system/070-payments/020-payment-api.md

---

## Purpose

The Payment API exposes authenticated payment views and commands without allowing clients to write payment state or amounts directly.

## Read Operations

- retrieve intent, attempt, authorization, capture, refund, dispute, and settlement status;
- retrieve supported methods and providers for country/currency/order context;
- retrieve payment history, fees, reconciliation state, and customer-safe errors; and
- retrieve provider-independent payment references and timestamps.

## Commands

Create/cancel intent, confirm method, authorize, capture, void, request refund, submit dispute evidence, and retry/query an uncertain attempt where permitted. Every command requires authorization, idempotency, correlation, server-side amount calculation, and policy validation.

## Rules

Clients cannot supply final prices, tax, vendor allocation, partner commission, reward qualification, account mappings, or provider secrets. API responses distinguish pending, authorized, captured, settled, failed, refunded, disputed, and unknown states.

## Related Documents

- [000-index.md](000-index.md)
- [002-payment-domain-model.md](002-payment-domain-model.md)
- [004-payment-intents.md](004-payment-intents.md)
- [019-payment-security.md](019-payment-security.md)
