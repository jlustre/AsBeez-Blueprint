# Ledger Events

> **Document:** 12-financial-system/320-events/004-ledger-events.md

---

## Purpose

Ledger events communicate journal preparation, validation, approval, posting, reversal, compensation, period, balance-projection, and reconciliation facts.

## Event Catalog

`JournalPrepared`, `JournalValidated`, `JournalRejected`, `JournalApproved`, `JournalPosted`, `JournalReversed`, `CompensatingEntryPosted`, `PeriodPostingBlocked`, `BalanceProjectionRebuilt`, and `LedgerReconciled`.

## Payload and Rules

Events include journal ID, source, account/chart version, line/control totals, entity/country/currency, dimensions, period, policy, actor/approval, reversal relationship, and posting timestamp. `JournalPosted` is emitted only after balanced immutable posting. Events provide lineage; they do not replace posted ledger records or permit client mutation.

## Related Documents

- [000-index.md](000-index.md)
- [003-account-events.md](003-account-events.md)
- [005-wallet-events.md](005-wallet-events.md)
- [../300-data-model/003-journal-entries-schema.md](../300-data-model/003-journal-entries-schema.md)
- [../290-architecture/005-double-entry-ledger-architecture.md](../290-architecture/005-double-entry-ledger-architecture.md)
