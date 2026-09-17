# Configuration Versioning

> **Document:** 12-financial-system/390-configuration/022-configuration-versioning.md

---

## Purpose

Configuration versioning makes every financial policy and setting reproducible, comparable, auditable, and safely deployable across environments, entities, countries, currencies, providers, periods, and contexts.

## Required Metadata

Configuration ID/type, version, owner, authority, scope, value/schema, unit, status, effective start/end, dependencies, reason, approval, tests, migration/rollback, deployment, observability, consumer impact, supersession, and retirement/review.

## Rules

New configuration applies from its effective time unless an authorized restatement policy applies. Events, calculations, reports, risk decisions, tax, FX, journals, reserves, reconciliations, and approvals retain the version used. Rollback creates a new version; it does not erase history.

## Lifecycle

Draft, reviewed, tested, approved, scheduled, active, superseded, deprecated, retired, or rejected. Conflicting scope/effective dates fail validation and require explicit precedence.

## Related Documents

- [000-index.md](000-index.md)
- [021-feature-flags.md](021-feature-flags.md)
- [001-overview.md](001-overview.md)
- [../260-compliance-and-governance/020-policy-versioning.md](../260-compliance-and-governance/020-policy-versioning.md)
