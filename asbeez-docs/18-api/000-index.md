# API

## Purpose

This domain defines public and internal API contracts for AsBeez customers, members, vendors, partners, administrators, platform services, and financial contexts.

## Authority

APIs expose domain commands and authorized views, not database tables. Financial APIs remain authoritative for payments, wallets, payouts, invoices, refunds, tax, FX, reserves, reconciliation, reporting, and the General Ledger. Product APIs delegate financial effects through those contracts.

## Structure

- [001-api-overview.md](001-api-overview.md)
- [002-auth-api.md](002-auth-api.md)
- [003-commerce-api.md](003-commerce-api.md)
- [004-vendor-api.md](004-vendor-api.md)
- [005-member-api.md](005-member-api.md)
- [006-rewards-api.md](006-rewards-api.md)
- [007-wallet-api.md](007-wallet-api.md)
- [008-admin-api.md](008-admin-api.md)

## Common Contract Rules

Use versioned schemas, authentication, authorization, scoped resources, entity/country/currency context, correlation IDs, idempotency for effects, integer minor-unit amounts, safe errors, pagination, rate limits, audit, privacy, observability, and explicit pending/failed/unknown states. Clients cannot directly mutate balances, posted journals, provider evidence, policy history, or certifications.

## Implementation Sequence

1. Establish authentication, authorization, request/response, errors, versioning, idempotency, privacy, and observability.
2. Implement commerce and participant read/command contracts.
3. Connect rewards, wallet, payment, invoice, refund, payout, and financial workflows through domain APIs.
4. Add administration, support, webhooks, integrations, contract tests, security tests, and recovery behavior.

## Related Documents

- [001-api-overview.md](001-api-overview.md)
- [002-auth-api.md](002-auth-api.md)
- [007-wallet-api.md](007-wallet-api.md)
- [008-admin-api.md](008-admin-api.md)
- [../12-financial-system/310-api/001-api-overview.md](../12-financial-system/310-api/001-api-overview.md)
