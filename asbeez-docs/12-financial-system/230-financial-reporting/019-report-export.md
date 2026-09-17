# Report Export

> **Document:** 12-financial-system/230-financial-reporting/019-report-export.md

---

## Purpose

Report export creates controlled copies of financial or management reports for authorized users, auditors, regulators, partners, or operations.

## Required Data

Report/version, query scope, filters, period, entity/country/currency, source snapshot, format, generated time, requester, recipients, encryption/access, integrity hash, retention, and certification status.

## Rules

Exports preserve source/version and disclose provisional, estimated, unreconciled, or restricted content. Sensitive data is minimized and protected. An export cannot change source records or certification status.

## Export Integrity

Exports retain checksum/integrity metadata, query scope, filters, generation time, source snapshot, report version, certification state, recipient/access log, retention, and expiration or revocation status.

## Related Documents

- [000-index.md](000-index.md)
- [018-report-scheduling.md](018-report-scheduling.md)
- [017-regulatory-reporting.md](017-regulatory-reporting.md)
- [002-reporting-domain-model.md](002-reporting-domain-model.md)
