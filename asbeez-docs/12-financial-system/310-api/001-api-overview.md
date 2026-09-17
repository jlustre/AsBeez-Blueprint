# API Overview

> **Document:** 12-financial-system/310-api/001-api-overview.md

---

## Purpose

The Financial System API exposes authenticated queries and controlled commands for accounts, ledger, wallets, payments, payouts, invoices, refunds, disputes, tax, FX, reserves, reconciliation, and reporting.

## Contract Principles

- APIs expose domain commands and views, not database tables;
- clients cannot directly write balances, posted journals, account mappings, tax decisions, provider status, or recognition outcomes;
- every financial command is authorized, validated, idempotent, audited, and correlated;
- responses distinguish accepted, pending, completed, failed, rejected, reversed, and unknown outcomes; and
- API contracts are versioned, schema-described, observable, country/entity aware, and backward-compatible within a supported version.

## Authority

The General Ledger remains authoritative for posted monetary effects. APIs return workflow and projection state with source/freshness metadata where eventual consistency applies.

## Related Documents

- [000-index.md](000-index.md)
- [002-authentication.md](002-authentication.md)
- [004-request-response-standards.md](004-request-response-standards.md)
- [009-ledger-api.md](009-ledger-api.md)
- [023-api-versioning.md](023-api-versioning.md)
