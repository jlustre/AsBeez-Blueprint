# Database Standards

## Purpose

Database standards provide consistent, secure, performant, recoverable storage while preserving bounded-context ownership and financial integrity.

## Rules

Use stable IDs, explicit ownership, foreign keys, unique/check constraints, integer minor units, ISO currency, entity/country/period/policy/schema versions, aggregate versions, idempotency, append-only posted/audit facts, migrations, backups, retention/legal holds, encryption, access controls, and reconciliation.

## Boundaries

Contexts own private tables; no direct cross-context writes. Read models/caches/warehouses are derived and cannot authorize financial actions. Financial journals/lines are immutable and balanced; subledgers reconcile to GL control accounts; provider evidence remains distinct from authoritative state.

## Operations

Migrations require owner/impact review, test/rollback, data-integrity and control-total validation, privacy/security review, capacity assessment, versioned scripts, backup, deployment evidence, and post-migration reconciliation.

## Related Documents

- [index.md](index.md)
- [002-naming-conventions.md](002-naming-conventions.md)
- [003-id-conventions.md](003-id-conventions.md)
- [../17-database/000-index.md](../17-database/000-index.md)
