# Ledger Periods

> **Document:** 12-financial-system/030-general-ledger/009-ledger-periods.md

---

## Purpose

A ledger period controls the dates in which ordinary and adjustment postings are permitted and provides the boundary for reporting and close.

## States

```text
Planned -> Open -> Soft Close -> Closed -> Archived
```

Planned periods are configured but cannot receive entries. Open periods accept ordinary postings. Soft close permits controlled review and approved late activity. Closed periods reject ordinary postings. Archived periods remain reportable but are not mutable.

## Period Data

Period ID, legal entity, start and end boundaries, calendar, status, close owner, close checklist, close timestamp, reopening authority, and adjustment policy.

## Close Controls

Close requires trial balance, subledger reconciliation, clearing and suspense review, bank/provider reconciliation, tax review, intercompany review, pending payout review, and approval evidence. Reopening a closed period requires documented authority and creates a tracked adjustment or restatement workflow.

## Related Documents

- [000-index.md](000-index.md)
- [008-ledger-balancing.md](008-ledger-balancing.md)
- [010-ledger-adjustments.md](010-ledger-adjustments.md)
- [015-ledger-auditability.md](015-ledger-auditability.md)
