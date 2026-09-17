# Country Financial Settings

> **Document:** 12-financial-system/390-configuration/003-country-financial-settings.md

---

## Purpose

Country financial settings define local legal entity, currency, tax, banking, payout, provider, accounting, reporting, privacy, retention, and operational policies.

## Required Fields

Country/entity, legal registrations, accounting calendar, base/settlement/reporting currency, tax rules, payment/payout methods, provider capabilities, limits, reserves, data residency, retention, time zone, effective dates, authority, version, and fallback behavior.

## Rules

Country settings override global defaults only within approved scope. Cross-country/entity operations require explicit policy, FX, tax, intercompany, sanctions, privacy, reconciliation, and access treatment. Local statutory history cannot be overwritten by global changes.

## Related Documents

- [000-index.md](000-index.md)
- [002-global-financial-settings.md](002-global-financial-settings.md)
- [004-currency-settings.md](004-currency-settings.md)
- [../260-compliance-and-governance/019-country-compliance.md](../260-compliance-and-governance/019-country-compliance.md)
