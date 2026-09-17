# Payment Operations

> **Document:** 12-financial-system/370-operations/004-payment-operations.md

---

## Purpose

Payment operations manage intents, authorization, capture, settlement, failures, retries, provider callbacks, fees, refunds, disputes, risk holds, and reconciliation.

## Procedures

Monitor authorization/capture/settlement queues, provider health, unknown attempts, duplicate callbacks, decline/failure trends, fee/settlement variance, refunds, disputes, and payment-to-ledger breaks. Query or reconcile uncertain provider state before retrying an effect.

## Rules

Operators cannot change amount, tax, allocation, revenue treatment, account mapping, provider result, or ledger directly. Escalate risk/compliance, country, currency, fraud, tax, or materiality issues. Record action, source, authority, correlation, idempotency, communication, and reconciliation evidence.

## Related Documents

- [000-index.md](000-index.md)
- [005-payout-operations.md](005-payout-operations.md)
- [006-refund-operations.md](006-refund-operations.md)
- [../300-data-model/006-payment-schema.md](../300-data-model/006-payment-schema.md)
