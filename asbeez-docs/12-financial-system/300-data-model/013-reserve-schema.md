# Reserve Schema

> **Document:** 12-financial-system/300-data-model/013-reserve-schema.md

---

## Purpose

Reserve data records restricted value held for refunds, chargebacks, vendor/partner exposure, rewards, compensation, liquidity, country obligations, or other approved financial purposes.

## Core Fields

`reserve_id`, `reserve_type`, `owner_type`, `owner_id`, `source_account_id`, `target_account_id`, `amount_minor`, `currency`, `country_code`, `entity_id`, `funding_reference`, `release_policy`, `status`, `held_since`, `release_at`, `released_at`, `approval_id`, and `ledger_reference`.

## Lifecycle

Proposed, approved, funded, active, increased, decreased, partially released, released, expired, transferred, or closed. Reserve status and balance are distinct: a reserve may be active with a zero balance or funded pending release.

## Rules

Reserve purpose, owner, source, release conditions, authority, currency, country, and accounting treatment are explicit. Reserve funds are not free cash, revenue, or an untracked liability. Funding, release, and adjustment are idempotent, approved, reconciled, and linked to ledger effects.

## Related Documents

- [000-index.md](000-index.md)
- [004-ledger-entries-schema.md](004-ledger-entries-schema.md)
- [010-chargeback-schema.md](010-chargeback-schema.md)
- [../180-reserves-and-funds/001-overview.md](../180-reserves-and-funds/001-overview.md)
