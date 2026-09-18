# Domain-Driven Design

## Purpose

Domain-Driven Design organizes AsBeez around business capabilities, explicit language, bounded contexts, aggregates, policies, events, and ownership rather than technical tables or generic services.

## Core Domains

Marketplace commerce, catalog/order/fulfillment, membership, vendor, partner, rewards/Matrix, payments, billing/invoicing, wallet, settlement, payouts, tax, FX, treasury, risk/compliance, reconciliation, reporting, administration, and platform services.

## Rules

Each context owns its language, invariants, aggregates, data, commands, events, and team responsibility. Shared concepts such as money, currency, country, identity, order, member, vendor, and policy require explicit contracts and do not imply shared mutable state.

## Financial Boundary

Marketplace/Rewards/Matrix own business qualification and distribution; Reward Finance owns approved monetary treatment; subledgers own detail; the General Ledger owns posted monetary truth. Product requirements must not invent accounting effects outside approved domain mappings.

## Modeling Practices

Use aggregate boundaries for consistency, domain events for accepted facts, commands for intent, repositories per context, anti-corruption adapters for providers/legacy systems, and policy/version references for reproducibility. Model reversals and compensation as new facts.

## Related Documents

- [index.md](index.md)
- [003-system-context.md](003-system-context.md)
- [004-bounded-contexts.md](004-bounded-contexts.md)
- [../12-financial-system/290-architecture/002-service-boundaries.md](../12-financial-system/290-architecture/002-service-boundaries.md)
