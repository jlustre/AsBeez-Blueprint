# Bounded Contexts

## Purpose

Bounded contexts isolate business language, data, invariants, ownership, deployment concerns, and change authority while enabling controlled collaboration across AsBeez.

## Context Catalog

Commerce/catalog/order/fulfillment; customer/member; vendor; partner; marketplace; rewards/Matrix; payments; billing/invoicing; wallets; settlement; payouts; tax; FX; treasury; risk/fraud; compliance/identity; reconciliation; reporting/analytics; administration; AI/platform services; notifications; and audit/controls.

## Ownership Rules

Each context owns private data and exposes APIs, commands, queries, and versioned events. No context writes another context's tables or projections. Anti-corruption layers translate provider, legacy, and external semantics. Shared infrastructure does not become shared domain ownership.

## Financial Contexts

Payments records funding lifecycle; Billing invoices; Settlement determines allocations; Payouts disburse; Wallets manage typed balances; Tax determines tax; FX determines conversion; Treasury manages cash; Reconciliation compares sources; Reporting derives views; GL posts authoritative monetary effects.

## Extraction Readiness

Define contract/version, ownership, data classification, consistency, idempotency, observability, SLO, security, recovery, migration, and reconciliation before extracting a context from the modular monolith.

## Related Documents

- [index.md](index.md)
- [002-domain-driven-design.md](002-domain-driven-design.md)
- [005-event-driven-architecture.md](005-event-driven-architecture.md)
- [../12-financial-system/290-architecture/002-service-boundaries.md](../12-financial-system/290-architecture/002-service-boundaries.md)
