# API Overview

## Purpose

The AsBeez API layer provides stable, secure, versioned interfaces for marketplace commerce, vendors, members, rewards, wallets, administration, platform services, and financial workflows.

## Contract Shape

APIs expose resource queries and domain commands. Requests include authenticated actor context, authorization scope, API version, correlation ID, and idempotency key for effectful operations. Responses include resource/operation ID, status, timestamps, scope, schema version, source/freshness, and safe error information.

## Financial Boundary

Commerce and participant APIs request payment, invoice, refund, payout, wallet, reward, tax, and settlement actions through financial contracts. They cannot write balances, journals, account mappings, tax decisions, provider results, or revenue recognition directly. The General Ledger remains authoritative for posted monetary effects.

## Safety and Experience

Use clear pending/processing/completed/failed/rejected/reversed/unknown states, customer-safe errors, deterministic pagination, resource ownership, country/entity isolation, privacy masking, audit correlation, rate limiting, and backward-compatible versioning. Sensitive data and provider secrets never appear in URLs or ordinary responses.

## Related Documents

- [index.md](index.md)
- [002-auth-api.md](002-auth-api.md)
- [003-commerce-api.md](003-commerce-api.md)
- [../12-financial-system/310-api/001-api-overview.md](../12-financial-system/310-api/001-api-overview.md)
