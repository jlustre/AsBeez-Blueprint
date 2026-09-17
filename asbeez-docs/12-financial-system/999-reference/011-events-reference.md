# Events Reference

> **Document:** 12-financial-system/999-reference/011-events-reference.md

---

## Purpose

This reference summarizes financial events. The events folder and event-store schema govern exact envelopes, catalogs, versioning, replay, and dead-letter behavior.

## Event Rules

Events are immutable facts with ID/type/version, aggregate/sequence, source, actor, time, entity/country/currency, policy, correlation/causation, idempotency, payload, and retention metadata. Producers use durable outbox; consumers are idempotent; delivery is not proof of downstream completion.

## Catalog Groups

Account/ledger; wallet/payment/payout; invoice/refund/chargeback; tax/currency/reserve; reconciliation/close/reporting; compliance/security; versioning/replay/dead letters.

## Related Documents

- [000-index.md](000-index.md)
- [010-api-reference.md](010-api-reference.md)
- [012-configuration-reference.md](012-configuration-reference.md)
- [../320-events/000-index.md](../320-events/000-index.md)
