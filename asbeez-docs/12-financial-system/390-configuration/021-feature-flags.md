# Feature Flags

> **Document:** 12-financial-system/390-configuration/021-feature-flags.md

---

## Purpose

Feature flags control staged exposure of financial capabilities, providers, workflows, UI, reports, models, and operational behavior by environment, entity, country, currency, cohort, role, or percentage.

## Rules

Flags have owner, purpose, type, scope, default, dependencies, expiry, approval, audit, test plan, rollout, monitoring, and kill behavior. Financial-effect flags fail closed or route to safe pending state. Flags cannot bypass authorization, ledger, tax, risk, reconciliation, security, or close controls.

## Change Control

Test flag combinations, migration/backfill, rollback, provider/country/entity impact, idempotency, event/schema compatibility, and accounting/reconciliation behavior. Remove expired flags or document renewal; historical outcomes retain flag/version context.

## Related Documents

- [000-index.md](000-index.md)
- [020-ai-settings.md](020-ai-settings.md)
- [022-configuration-versioning.md](022-configuration-versioning.md)
- [../360-testing/009-contract-testing.md](../360-testing/009-contract-testing.md)
