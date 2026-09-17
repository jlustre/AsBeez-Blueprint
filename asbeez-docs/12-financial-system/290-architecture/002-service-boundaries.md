# Service Boundaries

> **Document:** 12-financial-system/290-architecture/002-service-boundaries.md

---

## Purpose

Service boundaries assign ownership of financial language, data, commands, events, policies, and state transitions.

## Core Contexts

Payments, Billing/Invoicing, General Ledger, Wallets, Revenue Recognition, Settlement, Payouts, Treasury, Tax, FX, Rewards Accounting, Commission Accounting, Reconciliation, Reporting, Controls, Audit, and Risk.

## Boundary Rules

- a context owns its aggregates and private data;
- cross-context changes use commands, queries, or versioned events;
- no context writes another context’s tables or balance projections;
- the General Ledger owns posted accounting truth;
- Rewards/Matrix own RP/ABC/AHC qualification/distribution, while Reward Finance owns approved monetary effects; and
- external provider state is evidence until mapped and reconciled.

## Related Documents

- [000-index.md](000-index.md)
- [006-financial-orchestration.md](006-financial-orchestration.md)
- [007-saga-patterns.md](007-saga-patterns.md)
- [008-outbox-pattern.md](008-outbox-pattern.md)
