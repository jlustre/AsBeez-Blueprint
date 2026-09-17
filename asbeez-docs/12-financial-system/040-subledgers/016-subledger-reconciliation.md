# Subledger Reconciliation

> **Document:** 12-financial-system/040-subledgers/016-subledger-reconciliation.md

---

## Purpose

Subledger reconciliation proves that detailed operational records agree with General Ledger control accounts, source systems, external providers, and approved financial mappings.

## Required Reconciliations

- member wallet monetary balances to wallet control accounts;
- RP and AHC event populations to approved reward rules and any recognized financial effects;
- vendor and partner entitlements to settlement batches and payable accounts;
- customer invoices/payments/refunds to provider evidence and receivables;
- tax assessments to tax payable accounts and filings;
- reserves and compensation/charity funds to designated GL accounts and commitments; and
- country totals to entity, currency, and local reporting mappings.

## Outcomes

Every population or amount is matched, accepted as a documented timing difference, placed in an owned exception, or escalated. A balanced monetary total does not prove correct attribution; missing order, vendor, member, reward, country, or policy links remain exceptions.

## Evidence

Reconciliation records include scope, source periods, population counts, monetary and non-monetary totals, mapping/policy versions, match rules, unmatched items, reviewer, approver, completion time, and resolution references.

## Related Documents

- [000-index.md](000-index.md)
- [001-overview.md](001-overview.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
- [017-future-roadmap.md](017-future-roadmap.md)
