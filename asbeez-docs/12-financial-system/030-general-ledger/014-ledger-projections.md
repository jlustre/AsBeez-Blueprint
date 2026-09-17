# Ledger Projections

> **Document:** 12-financial-system/030-general-ledger/014-ledger-projections.md

---

## Purpose

Ledger projections are derived read models that make account balances, trial balances, dashboards, and reports efficient to query. They are not independent financial truth.

## Projection Types

- account balance by period, entity, currency, and dimensions;
- trial balance and financial statement totals;
- wallet and subledger control totals;
- clearing and suspense aging;
- revenue, expense, liability, and settlement summaries; and
- operational dashboards and certified report snapshots.

## Derivation Rules

Projections consume posted journal lines and correction events in order, record the last processed entry/event, and support rebuild from immutable source records. They must preserve chart version, account version, currency, dimensions, and period.

## Failure and Rebuild

A projection lag or failure is observable and does not authorize a direct balance edit. Rebuild compares projected totals with the GL control total before publication. User-facing balances show freshness or pending status when required.

## Related Documents

- [000-index.md](000-index.md)
- [002-ledger-architecture.md](002-ledger-architecture.md)
- [008-ledger-balancing.md](008-ledger-balancing.md)
- [015-ledger-auditability.md](015-ledger-auditability.md)
