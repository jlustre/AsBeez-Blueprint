# Architecture Decisions

## Purpose

This domain records significant AsBeez architecture decisions, their context, consequences, boundaries, and review conditions. ADRs guide implementation but do not override legal, accounting, security, or domain authority.

## Decision Records

- [adr-001-one-active-cart-per-country.md](adr-001-one-active-cart-per-country.md) - One active cart per country
- [adr-002-multi-vendor-checkout.md](adr-002-multi-vendor-checkout.md) - Multi-vendor checkout
- [adr-003-rp-generated-after-payment.md](adr-003-rp-generated-after-payment.md) - Reward timing after payment
- [adr-004-server-side-pricing.md](adr-004-server-side-pricing.md) - Server-side pricing
- [adr-005-ledger-first-adjustments.md](adr-005-ledger-first-adjustments.md) - Ledger-first adjustments

## ADR Rules

Each decision identifies scope, owner, status, alternatives, consequences, implementation controls, migration/reversal conditions, and related evidence. A later decision supersedes an earlier one explicitly; historical records are not rewritten because an ADR changes.

## Cross-Cutting Authority

Country/entity/currency/policy scope, API/event contracts, authorization, idempotency, reconciliation, privacy, legal release gates, and the General Ledger remain controlling. Decisions affecting financial effects require accounting, tax, risk/compliance, security, testing, operations, and audit review.

## Related Documents

- [adr-001-one-active-cart-per-country.md](adr-001-one-active-cart-per-country.md)
- [adr-005-ledger-first-adjustments.md](adr-005-ledger-first-adjustments.md)
- [../12-financial-system/290-architecture/000-index.md](../12-financial-system/290-architecture/000-index.md)
