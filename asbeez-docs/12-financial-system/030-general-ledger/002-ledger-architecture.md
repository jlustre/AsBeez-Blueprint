# Ledger Architecture

> **Document:** 12-financial-system/030-general-ledger/002-ledger-architecture.md

---

## Purpose

The ledger architecture separates source transactions, journal preparation, posting, immutable journal lines, balances, projections, and reporting. Each layer has a distinct responsibility and authority.

## Layers

```text
Business Event / Source Fact
	-> Journal Preparation
	-> Validation and Approval
	-> Posted Journal Entry
	-> Journal Lines and Account Balances
	-> Projections and Financial Reports
```

## Components

| Component | Responsibility |
| --- | --- |
| Journal service | builds entries from approved source facts |
| Posting engine | validates and commits balanced entries |
| Ledger store | preserves immutable entries and lines |
| Balance projection | derives period and account totals |
| Period service | controls open, close, and adjustment periods |
| Reconciliation service | compares ledger facts with external evidence |
| Reporting layer | produces certified or management views |

## Boundary Rules

Operational systems request financial effects through contracts. They cannot write journal lines directly. The posting engine owns balance validation, idempotency, account status, period status, currency, and dimension validation.

## Related Documents

- [000-index.md](000-index.md)
- [004-journal-entries.md](004-journal-entries.md)
- [007-ledger-posting.md](007-ledger-posting.md)
- [014-ledger-projections.md](014-ledger-projections.md)
