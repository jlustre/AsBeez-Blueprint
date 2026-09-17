# Overview

> **Document:** 12-financial-system/040-subledgers/001-overview.md

---

## Purpose

Subledgers provide detailed, domain-specific records that explain, support, and reconcile General Ledger postings. They preserve participant, provider, reward, tax, settlement, reserve, and fund detail that would be too granular for the chart of accounts.

## Authority

The owning operational or financial context is authoritative for its subledger events and status. The General Ledger is authoritative for posted monetary accounting effects. A subledger balance is not a substitute for a GL balance and must reconcile to its mapped control accounts.

## Common Record Contract

Every subledger record includes a stable ID, subject/reference, source event, status, amount and currency where monetary, country, legal entity, effective time, policy versions, correlation/causation IDs, idempotency key, and audit history.

## Core Rules

- Subledger events are append-only; corrections are reversals or compensating events.
- A record may be non-monetary, monetary, or both, and that classification is explicit.
- Monetary subledger totals map to named GL control accounts.
- Cross-domain workflows use events and never mutate another subledger directly.
- Reconciliation exceptions are owned, aged, and resolved through evidence.

## Related Documents

- [000-index.md](000-index.md)
- [002-member-wallet-subledger.md](002-member-wallet-subledger.md)
- [003-reward-points-subledger.md](003-reward-points-subledger.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
