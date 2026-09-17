# Reconciliation Rules

> **Document:** 12-financial-system/220-reconciliation/013-reconciliation-rules.md

---

## Purpose

Reconciliation rules define scope, frequency, sources, match keys, tolerances, control totals, timing treatment, exception severity, owner, approval, and close impact.

## Rules

- match exact source IDs before fuzzy or derived matching;
- compare counts, amounts, currencies, dimensions, statuses, and lineage;
- distinguish timing, missing, duplicate, classification, currency, provider, fraud, and unauthorized differences;
- never suppress an exception because aggregate totals balance;
- preserve rule/version used; and
- require approval for tolerance, exclusion, write-off, or completion.

## Rule Governance

Rules have owner, effective dates, scope, test cases, tolerance rationale, change approval, rollback/version history, and documented impact on prior reconciliation reports.

## Related Documents

- [000-index.md](000-index.md)
- [002-reconciliation-domain-model.md](002-reconciliation-domain-model.md)
- [014-exceptions.md](014-exceptions.md)
- [016-reconciliation-approvals.md](016-reconciliation-approvals.md)
