# Payment Schema

> **Document:** 12-financial-system/300-data-model/006-payment-schema.md

---

## Purpose

Payment data records the customer or member funding lifecycle and its provider evidence without confusing authorization, capture, settlement, or revenue recognition.

## Core Fields

`payment_id`, `order_id`, `payer_id`, `payee_entity_id`, `provider_id`, `provider_payment_id`, `method_type`, `amount_minor`, `currency`, `status`, `authorization_id`, `capture_id`, `settlement_reference`, `fee_minor`, `tax_reference`, `country_code`, `idempotency_key`, `risk_decision`, `created_at`, and `updated_at`.

## Lifecycle

Created, requires action, authorized, captured, partially captured, failed, cancelled, settled, disputed, refunded, or partially refunded. Provider callbacks are stored as evidence, deduplicated, and reconciled before authoritative financial effects are posted.

## Accounting Rules

Payment capture is not automatically revenue. The model links payment, order allocation, tax, vendor/partner entitlement, fees, reserves, refunds, and ledger journals through source references. Sensitive payment credentials are tokenized and never stored in this schema.

## Related Documents

- [000-index.md](000-index.md)
- [003-journal-entries-schema.md](003-journal-entries-schema.md)
- [009-refund-schema.md](009-refund-schema.md)
- [../070-payments/001-overview.md](../070-payments/001-overview.md)
