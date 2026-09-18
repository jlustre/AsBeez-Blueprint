# ADR-005: Ledger-First Adjustments

## Status

Accepted.

## Context

Manual balance edits or operational corrections can destroy audit history, create imbalance, break subledger control totals, and hide the cause of a payment, refund, payout, reward, tax, reserve, or reconciliation difference.

## Decision

All material financial adjustments flow through the ledger-first workflow: identify source and policy; validate authority, period, account, dimensions, entity/country/currency, amount, and idempotency; prepare balanced journal; obtain approval; post immutable lines; update/reconcile subledgers and projections; and retain audit evidence. Corrections use reversals or compensating entries linked to the original.

## Consequences

Operations cannot fix balances directly and some corrections take longer. History remains reproducible, control totals remain meaningful, and reports can explain original and correcting facts. Unknown provider outcomes are reconciled before adjustment or retry.

## Controls

Require separation of duties, approval thresholds, dual control where material, open period, chart/policy version, source/correlation, concurrency/idempotency, balanced debit/credit, audit, reconciliation, and post-adjustment monitoring. AI, projections, APIs, and administrators cannot bypass this decision.

## Related Documents

- [index.md](index.md)
- [../12-financial-system/290-architecture/005-double-entry-ledger-architecture.md](../12-financial-system/290-architecture/005-double-entry-ledger-architecture.md)
- [../12-financial-system/370-operations/013-exception-management.md](../12-financial-system/370-operations/013-exception-management.md)
- [../12-financial-system/360-testing/005-double-entry-validation.md](../12-financial-system/360-testing/005-double-entry-validation.md)
