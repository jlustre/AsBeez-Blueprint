# Overview

> **Document:** 12-financial-system/030-general-ledger/001-overview.md

---

## Purpose

The General Ledger (GL) is the authoritative record of posted monetary accounting effects. It receives controlled journal entries from financial bounded contexts and supports trial balances, financial statements, reconciliation, period close, and audit.

## Core Principles

- Every posted entry is double-entry and balanced.
- Posted entries are immutable; corrections are new entries.
- Every entry has a source fact, policy version, effective time, posting period, currency, entity, and audit trail.
- The GL is not a payment processor, wallet, invoice system, or reward qualification engine.
- Account definitions come from the Chart of Accounts; the GL records their use.
- Projections may optimize reads but never replace posted ledger truth.

For AsBeez, the GL receives approved financial consequences from marketplace orders, vendor and partner settlement, taxes, payments, refunds, reserves, and reward events. It does not decide whether a purchase qualifies for RP, whether an ABC is created, where a matrix node is placed, or whether an AHC event is financially recognized.

## Scope

This folder defines ledger architecture, journal structure, account usage, batches, posting, balancing, periods, adjustments, reversals, reconciliation, projections, partitioning, auditability, retention, and roadmap.

## Related Documents

- [000-index.md](000-index.md)
- [002-ledger-architecture.md](002-ledger-architecture.md)
- [003-double-entry-accounting.md](003-double-entry-accounting.md)
- [007-ledger-posting.md](007-ledger-posting.md)
- [015-ledger-auditability.md](015-ledger-auditability.md)
- [019-asbeez-posting-mappings.md](019-asbeez-posting-mappings.md)
