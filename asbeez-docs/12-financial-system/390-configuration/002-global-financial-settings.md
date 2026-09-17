# Global Financial Settings

> **Document:** 12-financial-system/390-configuration/002-global-financial-settings.md

---

## Purpose

Global financial settings define defaults and invariant platform policies for accounting basis, base/reporting currency, supported dimensions, posting behavior, workflow states, precision, retention, security, observability, and operational controls.

## Scope

Global defaults apply only when no more-specific approved entity/country/currency/provider policy exists. Settings identify owner, authority, version, environment, effective dates, dependencies, override rules, tests, and rollback.

## Rules

Global settings cannot silently override statutory, entity, country, provider, tax, or account policy. Financial-impact changes require impact assessment, staging validation, approval, deployment monitoring, and historical version preservation. Invalid or missing configuration fails safely or enters exception state.

## Related Documents

- [000-index.md](000-index.md)
- [003-country-financial-settings.md](003-country-financial-settings.md)
- [006-ledger-settings.md](006-ledger-settings.md)
- [022-configuration-versioning.md](022-configuration-versioning.md)
