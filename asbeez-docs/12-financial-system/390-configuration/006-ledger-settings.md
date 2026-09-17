# Ledger Settings

> **Document:** 12-financial-system/390-configuration/006-ledger-settings.md

---

## Purpose

Ledger settings define posting policy, journal numbering, account/dimension validation, period behavior, source mappings, approval thresholds, correction types, currencies, control totals, and projection behavior.

## Rules

Settings enforce balanced double-entry, immutable posted lines, valid chart version, entity/country/currency/dimensions, open period, source approval, idempotency, and separation of duties. They cannot allow direct balance edits, unbalanced entries, historical reinterpretation, or silent correction.

## Change Control

Accounting owns policy; changes require examples/tests, chart/report/subledger/reconciliation impact, effective date, dual approval, staged deployment, monitoring, and rollback through a new version.

## Related Documents

- [000-index.md](000-index.md)
- [005-rounding-settings.md](005-rounding-settings.md)
- [007-wallet-settings.md](007-wallet-settings.md)
- [../300-data-model/003-journal-entries-schema.md](../300-data-model/003-journal-entries-schema.md)
