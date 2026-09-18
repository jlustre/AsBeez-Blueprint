# Database

## Purpose

This domain defines the AsBeez database architecture, entity relationships, table ownership, core commerce/rewards/matrix/financial records, audit evidence, integrity constraints, migrations, and operational safeguards.

## Authority

Database structure supports bounded-context ownership; it does not replace domain policies, API/event contracts, or the General Ledger. Contexts own private tables and expose approved contracts. Direct cross-context writes are prohibited.

## Structure

- [001-database-overview.md](001-database-overview.md)
- [002-erd.md](002-erd.md)
- [003-core-tables.md](003-core-tables.md)
- [004-commerce-tables.md](004-commerce-tables.md)
- [005-rewards-tables.md](005-rewards-tables.md)
- [006-matrix-tables.md](006-matrix-tables.md)
- [007-financial-tables.md](007-financial-tables.md)
- [008-audit-tables.md](008-audit-tables.md)

## Global Rules

Use stable IDs, foreign-key/unique/check constraints, integer minor units plus ISO currency, entity/country/period/policy/schema versions, optimistic versions, idempotency, append-only posted facts, privacy classification, retention/legal hold, backup/restore, and migration evidence. Read models, analytics, and caches are derived and cannot authorize financial actions.

## Implementation Sequence

1. Define ownership, context boundaries, identifiers, common metadata, security, retention, and migration standards.
2. Implement core identity/tenant/entity records and commerce sources.
3. Implement rewards/matrix records with non-monetary separation.
4. Implement financial and audit tables with ledger/reconciliation authority.
5. Validate ERD, constraints, performance, partitioning, privacy, recovery, and cross-context contracts.

## Related Documents

- [001-database-overview.md](001-database-overview.md)
- [002-erd.md](002-erd.md)
- [007-financial-tables.md](007-financial-tables.md)
- [008-audit-tables.md](008-audit-tables.md)
- [../16-system-architecture/000-index.md](../16-system-architecture/000-index.md)
- [../12-financial-system/300-data-model/000-index.md](../12-financial-system/300-data-model/000-index.md)
