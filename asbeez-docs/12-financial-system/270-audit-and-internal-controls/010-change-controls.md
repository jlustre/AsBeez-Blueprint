# Change Controls

> **Document:** 12-financial-system/270-audit-and-internal-controls/010-change-controls.md

---

## Purpose

Change controls govern modifications to code, configuration, account mappings, policies, rates, tax rules, risk models, integrations, report definitions, data, and permissions.

## Required Evidence

Change ID, scope, risk/impact, owner, design, test, security/privacy/tax/accounting review, approvals, migration/rollback, deployment, monitoring, incident, and post-change validation.

## Rules

Changes are versioned and effective-dated. Production changes cannot silently alter historical financial facts, policies, rates, reports, or audit evidence. Emergency changes are time-limited, documented, approved retrospectively, and tested.

## Related Documents

- [000-index.md](000-index.md)
- [020-policy-versioning.md](../260-compliance-and-governance/020-policy-versioning.md)
- [013-control-testing.md](013-control-testing.md)
- [009-access-controls.md](009-access-controls.md)
