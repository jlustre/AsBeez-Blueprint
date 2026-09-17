# Journal Entry Management

> **Document:** 12-financial-system/380-administration/005-journal-entry-management.md

---

## Purpose

Journal-entry administration supports preparation, review, approval, posting status, reversal, compensation, investigation, and audit lineage without direct mutation of posted accounting.

## Procedure

Review source, account/chart version, dimensions, entity/country/currency, period, policy, amount, tax/FX, approval, idempotency, and control totals; reject or return incomplete entries; approve under separation of duties; post through ledger service; monitor projection/reconciliation.

## Rules

Posted journals and lines cannot be edited or deleted. Corrections use linked reversal/compensating entries. Administrators cannot force unbalanced, unauthorized, duplicate, out-of-period, or unsupported-currency postings.

## Related Documents

- [000-index.md](000-index.md)
- [004-chart-of-accounts-management.md](004-chart-of-accounts-management.md)
- [020-audit-management.md](020-audit-management.md)
- [../300-data-model/003-journal-entries-schema.md](../300-data-model/003-journal-entries-schema.md)
