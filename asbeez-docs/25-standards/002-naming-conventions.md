# Naming Conventions

## Purpose

Names must communicate domain meaning, ownership, lifecycle, scope, and technical purpose consistently across documents, APIs, events, databases, code, and user-facing products.

## Rules

Use explicit domain nouns and verbs; avoid ambiguous abbreviations; keep singular aggregate/table concepts and plural collections consistent; distinguish command/request from event/fact; keep payment, capture, settlement, revenue, and payout distinct; and keep RP/ABC/AHC distinct from money.

## Scope and Change

Names identify context and avoid collisions across commerce, membership, vendor, partner, rewards, Matrix, financial, platform, and audit domains. Renames require compatibility, migration, event/API impact, reporting, and audit review.

## Examples

Prefer `payment_captured`, `payout_requested`, `journal_posted`, `refund_completed`, `country_code`, `entity_id`, `currency_code`, `policy_version`, and `correlation_id` over vague names such as `done`, `value`, `type`, or `status_flag`.

## Related Documents

- [index.md](index.md)
- [003-id-conventions.md](003-id-conventions.md)
- [005-api-standards.md](005-api-standards.md)
- [006-database-standards.md](006-database-standards.md)
