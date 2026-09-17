# Reconciliation Domain Model

> **Document:** 12-financial-system/220-reconciliation/002-reconciliation-domain-model.md

---

## Purpose

The Reconciliation domain models source populations, evidence, matching, control totals, timing differences, exceptions, discrepancy cases, resolutions, approvals, and reports.

## Entities

| Entity | Responsibility |
| --- | --- |
| Reconciliation Session | scope, period, source, target, owner, status |
| Source Population | records or amounts from authoritative source |
| Control Total | count, amount, currency, and dimension aggregate |
| Match | link between source and target facts |
| Exception | unmatched, inconsistent, missing, duplicate, or unauthorized result |
| Resolution Case | investigation, action, approval, and correction |
| Reconciliation Report | outcome, evidence, exceptions, and certification |

## Invariants

- scope, source, target, period, currency, entity, country, and policy are explicit;
- each source item has match, timing difference, exception, or approved exclusion;
- one source effect is not matched to conflicting targets;
- control totals are reproducible and versioned; and
- resolution never edits immutable source or posted ledger records.

## Lifecycle

```text
Planned -> Open -> Matching -> Review -> Approved -> Completed
Open -> Blocked | Escalated
```

## Related Documents

- [000-index.md](000-index.md)
- [003-ledger-to-subledger.md](003-ledger-to-subledger.md)
- [014-exceptions.md](014-exceptions.md)
- [015-discrepancy-resolution.md](015-discrepancy-resolution.md)
