# Webhooks

> **Document:** 12-financial-system/310-api/021-webhooks.md

---

## Purpose

Webhooks deliver selected financial lifecycle events to approved consumers, including payment, payout, refund, dispute, invoice, wallet, reconciliation, reserve, tax, and reporting status changes.

## Delivery Contract

Each webhook includes event ID/type/version, aggregate/resource reference, event time, entity/country/currency scope, correlation/causation, source context, sequence where applicable, and signed payload metadata. Consumers acknowledge delivery separately from business processing.

## Security and Reliability

Use endpoint registration approval, signature verification, timestamp/replay protection, TLS, secret rotation, allowlisted destinations, least privilege, retries with backoff, delivery timeout, dead-letter handling, and observability. Consumers must deduplicate by event ID and tolerate ordering gaps.

## Rules

A delivered webhook is not proof that a payment, payout, journal, refund, or reconciliation completed. Sensitive data is minimized. Provider callbacks are stored as evidence, idempotently processed, and reconciled before authoritative financial effects.

## Related Documents

- [000-index.md](000-index.md)
- [005-idempotency.md](005-idempotency.md)
- [007-error-handling.md](007-error-handling.md)
- [../300-data-model/018-event-store-schema.md](../300-data-model/018-event-store-schema.md)
- [../290-architecture/008-outbox-pattern.md](../290-architecture/008-outbox-pattern.md)
