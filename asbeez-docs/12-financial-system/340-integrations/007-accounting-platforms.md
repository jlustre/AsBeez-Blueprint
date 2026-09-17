# Accounting Platforms

> **Document:** 12-financial-system/340-integrations/007-accounting-platforms.md

---

## Purpose

Accounting-platform integrations exchange approved chart mappings, journals, balances, invoices, bills, tax, payments, and reporting evidence with external accounting systems.

## Adapter Contract

Map AsBeez entity/country/chart version, account/dimensions, period, currency, journal/source, invoice, tax, vendor/customer, and external reference. Track export batch, acceptance/rejection, mapping version, hash/control totals, correction, and reconciliation status.

## Rules

The AsBeez General Ledger remains authoritative for AsBeez posted truth unless a documented legal-entity authority says otherwise. External acceptance is evidence, not automatic posting or close. Exports are idempotent, balanced, immutable by batch, and corrected through linked reversals/adjustments.

## Related Documents

- [000-index.md](000-index.md)
- [008-erp-systems.md](008-erp-systems.md)
- [016-integration-monitoring.md](016-integration-monitoring.md)
- [../300-data-model/003-journal-entries-schema.md](../300-data-model/003-journal-entries-schema.md)
