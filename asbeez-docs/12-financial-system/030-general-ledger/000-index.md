# General Ledger

> **Document:** 12-financial-system/030-general-ledger/000-index.md

---

## Purpose

This section defines the general ledger architecture, double-entry accounting, journal entries, posting, balancing, periods, adjustments, reversals, reconciliation, projections, auditability, partitioning, and retention.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-ledger-architecture.md](002-ledger-architecture.md) - Ledger Architecture
- [003-double-entry-accounting.md](003-double-entry-accounting.md) - Double Entry Accounting
- [004-journal-entries.md](004-journal-entries.md) - Journal Entries
- [005-ledger-accounts.md](005-ledger-accounts.md) - Ledger Accounts
- [006-ledger-batches.md](006-ledger-batches.md) - Ledger Batches
- [007-ledger-posting.md](007-ledger-posting.md) - Ledger Posting
- [008-ledger-balancing.md](008-ledger-balancing.md) - Ledger Balancing
- [009-ledger-periods.md](009-ledger-periods.md) - Ledger Periods
- [010-ledger-adjustments.md](010-ledger-adjustments.md) - Ledger Adjustments
- [011-reversals.md](011-reversals.md) - Reversals
- [012-compensating-entries.md](012-compensating-entries.md) - Compensating Entries
- [013-ledger-reconciliation.md](013-ledger-reconciliation.md) - Ledger Reconciliation
- [014-ledger-projections.md](014-ledger-projections.md) - Ledger Projections
- [015-ledger-auditability.md](015-ledger-auditability.md) - Ledger Auditability
- [016-ledger-partitioning.md](016-ledger-partitioning.md) - Ledger Partitioning
- [017-ledger-retention.md](017-ledger-retention.md) - Ledger Retention
- [018-future-roadmap.md](018-future-roadmap.md) - Future Roadmap
- [019-asbeez-posting-mappings.md](019-asbeez-posting-mappings.md) - AsBeez Posting Mappings

## Design Authority

The General Ledger is the authoritative source for posted monetary accounting effects. The Chart of Accounts defines account meaning and dimensions; Payments, Billing, Settlement, Tax, Rewards, Treasury, and Reconciliation provide approved source facts and workflows. Wallets and reporting projections are derived views and must not bypass ledger controls.

## Implementation Sequence

1. Approve the chart of accounts, account dimensions, legal entities, currencies, and periods.
2. Implement journal entry and double-entry validation.
3. Implement idempotent posting, batches, outbox events, and immutable journal storage.
4. Implement balancing, trial balance, period close, adjustments, reversals, and compensating entries.
5. Connect reconciliation, projections, audit evidence, partitioning, and retention controls.
6. Certify source-to-ledger-to-report traceability before production financial use.

## AsBeez-Specific Boundary

Marketplace order allocation, vendor and partner obligations, and reward financial treatment must follow [AsBeez Posting Mappings](019-asbeez-posting-mappings.md). RP, ABC, AHC, and Beehive Matrix events are not assumed to be money or liabilities; their financial effect requires an approved policy and jurisdictional classification.
