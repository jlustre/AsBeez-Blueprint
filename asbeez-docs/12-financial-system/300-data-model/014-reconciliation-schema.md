# Reconciliation Schema

> **Document:** 12-financial-system/300-data-model/014-reconciliation-schema.md

---

## Purpose

Reconciliation data records comparison between authoritative financial sources, identified differences, ownership, resolution, approval, and evidence.

## Core Entities

`reconciliation_run`, `reconciliation_scope`, `source_snapshot`, `comparison_result`, `reconciliation_exception`, `resolution_action`, and `certification`. Fields include source type, source account/provider, entity, country, currency, period, run time, control totals, matched/unmatched amounts/counts, status, owner, severity, and approval.

## Rules

Reconcile ledger to subledgers, bank/provider settlements, wallets, rewards, vendors, partners, tax, reserves, and country books. A match requires defined keys, amount/currency tolerance, timing policy, and source lineage. Differences are not hidden by manual balance edits.

## Lifecycle

Scheduled, running, completed, exception, under review, resolved, approved, certified, reopened, or superseded. Certification identifies scope, period, source versions, reviewer, exceptions, and unresolved risk.

## Related Documents

- [000-index.md](000-index.md)
- [003-journal-entries-schema.md](003-journal-entries-schema.md)
- [015-financial-period-schema.md](015-financial-period-schema.md)
- [../220-reconciliation/001-overview.md](../220-reconciliation/001-overview.md)
