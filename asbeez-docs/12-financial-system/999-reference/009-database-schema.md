# Database Schema

> **Document:** 12-financial-system/999-reference/009-database-schema.md

---

## Purpose

This reference summarizes the Financial System data model: authoritative aggregates, immutable accounting, subledgers, event history, projections, audit, reconciliation, partitioning, and retention.

## Core Groups

Accounts/chart; journals/ledger lines; wallets/movements/holds; payments/payouts; invoices/refunds/chargebacks; tax/currency/reserves; reconciliation/periods/reports; audit/events/outbox; read models/indexes/partitions/retention.

## Common Rules

Stable IDs, integer minor units plus ISO currency, entity/country/period/policy/schema version, source/actor/correlation/idempotency, constraints, optimistic versions, append-only posted facts, control accounts, and reconciliation apply. Read models are disposable and cannot authorize financial actions.

## Related Documents

- [000-index.md](000-index.md)
- [005-journal-entry-reference.md](005-journal-entry-reference.md)
- [006-ledger-entry-reference.md](006-ledger-entry-reference.md)
- [../300-data-model/000-index.md](../300-data-model/000-index.md)
