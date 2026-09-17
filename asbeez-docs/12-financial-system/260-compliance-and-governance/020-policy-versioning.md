# Policy Versioning

> **Document:** 12-financial-system/260-compliance-and-governance/020-policy-versioning.md

---

## Purpose

Policy versioning makes historical financial, tax, fraud, reward, payout, reserve, reporting, and reconciliation decisions reproducible.

## Required Metadata

Policy ID, version, owner, authority, scope, country/entity/currency, effective start/end, status, approval, change reason, dependencies, examples/tests, migration impact, and retirement/supersession.

## Rules

A new policy applies only from its effective time unless approved restatement lawfully permits otherwise. Every event, calculation, report, decision, journal, reserve, tax assessment, risk score, and reconciliation stores the version used. Policy rollback creates a new version and does not erase history.

## Related Documents

- [000-index.md](000-index.md)
- [003-accounting-policies.md](003-accounting-policies.md)
- [019-country-compliance.md](019-country-compliance.md)
- [018-audit-requirements.md](018-audit-requirements.md)
