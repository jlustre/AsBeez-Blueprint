# API Reference

> **Document:** 12-financial-system/999-reference/010-api-reference.md

---

## Purpose

This reference summarizes API contract conventions and domain surfaces. The API folder is authoritative for exact endpoint schemas and versioning.

## Common Contract

Authenticated, authorized, entity/country/currency scoped requests use version, correlation, idempotency for effects, integer minor-unit amounts, safe errors, deterministic pagination, source/freshness, and explicit pending/failed/unknown states.

## Domain Surfaces

Accounts, ledger, wallets, payments, payouts, invoices, refunds, chargebacks, tax, currency, reserves, reconciliation, reporting, webhooks, rate limits, and versioning. Clients request workflows; they cannot directly write balances, posted journals, mappings, tax decisions, provider outcomes, certifications, or period state.

## Related Documents

- [000-index.md](000-index.md)
- [009-database-schema.md](009-database-schema.md)
- [011-events-reference.md](011-events-reference.md)
- [../310-api/000-index.md](../310-api/000-index.md)
