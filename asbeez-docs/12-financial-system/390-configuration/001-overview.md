# Overview

> **Document:** 12-financial-system/390-configuration/001-overview.md

---

## Purpose

Financial configuration defines approved policies, limits, mappings, capabilities, thresholds, calendars, providers, feature controls, and operational parameters used by AsBeez financial workflows.

## Configuration Principles

- every value has an owner, authority, scope, type, unit, version, status, effective period, dependencies, and audit record;
- entity, country, currency, period, environment, context, and provider scope are explicit;
- changes are tested, approved, observable, and reversible by a new version;
- historical journals, events, tax, FX, reports, decisions, and reconciliations retain the version used; and
- configuration cannot bypass authorization, idempotency, ledger balance, reconciliation, security, privacy, compliance, or recovery controls.

## Related Documents

- [000-index.md](000-index.md)
- [002-global-financial-settings.md](002-global-financial-settings.md)
- [003-country-financial-settings.md](003-country-financial-settings.md)
- [022-configuration-versioning.md](022-configuration-versioning.md)
- [../380-administration/018-configuration-management.md](../380-administration/018-configuration-management.md)
