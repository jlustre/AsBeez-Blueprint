# Versioning Standards

## Purpose

Versioning preserves compatibility, reproducibility, auditability, and safe evolution across documents, code, APIs, events, schemas, policies, configuration, models, prompts, diagrams, and reports.

## Required Metadata

Artifact ID/type, version, owner, status, scope, effective date, dependencies, change reason, compatibility, migration/upcaster, tests, approval, deployment, rollback, deprecation, retirement, and review date.

## Rules

Use explicit semantic or domain-appropriate versions; never reinterpret historical records under a new meaning; keep additive changes compatible where possible; use new versions for breaking API/event/schema/policy changes; preserve old data/source/version; and communicate deprecation before removal.

## Change Control

Material changes require impact analysis across contexts, financial/accounting, country/legal, security/privacy, operations, reporting, reconciliation, testing, and recovery. Rollback creates a new version and does not erase history. Version references are retained in events, journals, calculations, reports, approvals, configuration, and audit.

## Related Documents

- [index.md](index.md)
- [001-documentation-standards.md](001-documentation-standards.md)
- [005-api-standards.md](005-api-standards.md)
- [../23-architecture-decisions/000-index.md](../23-architecture-decisions/000-index.md)

