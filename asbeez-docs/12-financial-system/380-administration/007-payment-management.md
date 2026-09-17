# Payment Management

> **Document:** 12-financial-system/380-administration/007-payment-management.md

---

## Purpose

Payment administration manages payment intents, attempts, methods, authorization, capture, voids, settlement, provider evidence, refunds, disputes, risk, and reconciliation queues.

## Permitted Actions

Review status/evidence, retry or query uncertain operation under policy, route provider, resolve exception, request refund/dispute, and escalate risk/provider issues through authorized workflows.

## Rules

Administrators cannot change amount, tax, allocation, revenue treatment, provider result, or ledger directly. Payment capture is not automatically revenue. Unknown, duplicate, failed, disputed, and provider-reported states remain distinct until reconciled.

## Related Documents

- [000-index.md](000-index.md)
- [008-payout-management.md](008-payout-management.md)
- [010-refund-management.md](010-refund-management.md)
- [../300-data-model/006-payment-schema.md](../300-data-model/006-payment-schema.md)
