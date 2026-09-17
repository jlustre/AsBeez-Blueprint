# Read Models

> **Document:** 12-financial-system/300-data-model/019-read-models.md

---

## Purpose

Read models provide query-optimized views of financial facts for wallets, statements, vendor/partner balances, reconciliation, reporting, risk, operations, and analytics.

## Core Fields

Each projection identifies `model_name`, `projection_version`, `source_position`, `source_snapshot`, `entity_id`, `country_code`, `currency`, `period`, `freshness_at`, `certification_status`, `rebuild_status`, and `last_reconciled_at`.

## Rules

Read models are derived, disposable, rebuildable, and never the source of posted accounting truth. They disclose stale, partial, pending, or uncertified state. A read model cannot authorize payment, payout, wallet debit, journal posting, reserve release, or period close.

## Rebuild and Reconciliation

Rebuilds use immutable journals, events, subledger records, or approved snapshots. Before release, compare counts, debit/credit totals, balances, currency, entity, country, and period control totals; retain version and exception evidence.

## Related Documents

- [000-index.md](000-index.md)
- [003-journal-entries-schema.md](003-journal-entries-schema.md)
- [018-event-store-schema.md](018-event-store-schema.md)
- [016-reporting-schema.md](016-reporting-schema.md)
