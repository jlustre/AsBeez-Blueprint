# Configuration Management

> **Document:** 12-financial-system/380-administration/018-configuration-management.md

---

## Purpose

Configuration administration manages financial policies, limits, thresholds, mappings, calendars, provider capabilities, routing, fees, tax/FX settings, feature flags, templates, and operational parameters.

## Change Procedure

Identify owner and scope; record current/target value, reason, dependencies, entity/country/currency/period impact, effective date, risk, test evidence, approvals, rollout, monitoring, rollback, and expiry/review.

## Rules

Configuration is versioned and effective-dated. High-risk or financial-impact changes require dual control, test/staging validation, separation of duties, access review, and audit. Do not alter historical policy/account/tax/FX/journal meaning; use a new version or compensating treatment.

## Related Documents

- [000-index.md](000-index.md)
- [004-chart-of-accounts-management.md](004-chart-of-accounts-management.md)
- [019-role-and-permission-management.md](019-role-and-permission-management.md)
- [../260-compliance-and-governance/020-policy-versioning.md](../260-compliance-and-governance/020-policy-versioning.md)
