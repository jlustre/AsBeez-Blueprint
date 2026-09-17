# Invoice Numbering

> **Document:** 12-financial-system/090-invoicing/004-invoice-numbering.md

---

## Purpose

Invoice numbering provides a unique, sequential, jurisdiction-aware reference for issued invoices and notes.

## Numbering Scope

The sequence is defined by document type, legal entity, country/tax registration, fiscal calendar, and effective numbering policy. Draft identifiers may be temporary; issued numbers are permanent and never reused.

## Rules

- numbering is assigned at issuance according to local legal requirements;
- gaps are preserved and documented rather than silently reused;
- concurrent issuance is serialized or uses a governed sequence service;
- credit/debit notes use their own identifiable series and reference the original invoice; and
- migrations retain original number, source system, issue date, and evidence.

## Related Documents

- [000-index.md](000-index.md)
- [003-invoice-types.md](003-invoice-types.md)
- [005-invoice-generation.md](005-invoice-generation.md)
- [015-invoice-localization.md](015-invoice-localization.md)
