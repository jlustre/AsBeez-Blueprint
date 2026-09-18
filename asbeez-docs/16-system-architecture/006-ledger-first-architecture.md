# Ledger-First Architecture

## Purpose

Ledger-first architecture ensures that approved monetary effects are classified, balanced, immutable, traceable, and reconciled before they become financial truth in reports, wallets, settlements, payouts, or analytics.

## Flow

```text
Business Source Fact -> Policy/Account Mapping -> Journal Preparation
-> Validation/Approval -> Balanced Posting -> Subledger/Projections
-> Reconciliation -> Reporting/Treasury/Audit
```

## Rules

The General Ledger owns posted truth. Every journal retains source, account/chart version, entity/country, currency, dimensions, period, policy, actor, approval, correlation, and idempotency. Posted lines cannot be edited/deleted; corrections are reversals or compensating entries.

## Boundaries

Operational contexts request financial effects through contracts. Wallet, reward, vendor, partner, tax, reserve, payment, payout, and treasury data reconcile to control accounts. GMV, payment, entitlement, tax, reserve, cash, and revenue remain distinct.

## Future Revenue Streams

Revenue strategy or product configuration does not create revenue. Recognition follows approved accounting policy, source evidence, performance obligations, period, tax, and reconciliation requirements.

## Related Documents

- [index.md](index.md)
- [004-bounded-contexts.md](004-bounded-contexts.md)
- [../12-financial-system/290-architecture/005-double-entry-ledger-architecture.md](../12-financial-system/290-architecture/005-double-entry-ledger-architecture.md)

