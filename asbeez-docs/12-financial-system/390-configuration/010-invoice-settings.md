# Invoice Settings

> **Document:** 12-financial-system/390-configuration/010-invoice-settings.md

---

## Purpose

Invoice settings define numbering, legal entity, templates, lines, tax, discounts, due dates, localization, delivery, recurring behavior, notes, and retention.

## Rules

Settings preserve issued document immutability, legal snapshots, tax/version, currency/rounding, entity/country, numbering uniqueness, document hash, delivery evidence, and access. They cannot rewrite historical totals, tax, payment, revenue, or legal identity.

## Change Control

Template, numbering, tax, localization, due-date, or delivery changes require legal/tax/accounting review, representative document tests, effective date, approval, staged rollout, and impact on reports, records, and reconciliation.

## Related Documents

- [000-index.md](000-index.md)
- [009-payout-settings.md](009-payout-settings.md)
- [014-tax-settings.md](014-tax-settings.md)
- [../300-data-model/008-invoice-schema.md](../300-data-model/008-invoice-schema.md)
