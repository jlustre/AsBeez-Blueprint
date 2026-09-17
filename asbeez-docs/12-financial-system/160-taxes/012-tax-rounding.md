# Tax Rounding

> **Document:** 12-financial-system/160-taxes/012-tax-rounding.md

---

## Purpose

Tax rounding defines how fractional tax amounts are represented and reconciled at line, invoice, transaction, settlement, filing, and reporting levels.

## Required Data

Currency precision, tax precision, rounding mode, calculation scope, line/invoice authority, residual threshold, jurisdiction, rule version, and rounding difference account.

## Rules

Rounding is deterministic, disclosed where required, and applied consistently for the applicable jurisdiction. Line-level and invoice-level totals may differ by a permitted residual; the residual is recorded, never discarded. Historical calculations are not recomputed using a new rounding rule.

## Reconciliation

Rounding differences reconcile among tax lines, invoice totals, settlement allocations, filings, and the approved tax rounding account. Differences outside policy tolerance create a review exception.

## Related Documents

- [000-index.md](000-index.md)
- [011-tax-calculation.md](011-tax-calculation.md)
- [013-tax-invoices.md](013-tax-invoices.md)
- [016-tax-reconciliation.md](016-tax-reconciliation.md)
