# Ledger Auditability

> **Document:** 12-financial-system/030-general-ledger/015-ledger-auditability.md

---

## Purpose

Ledger auditability enables an investigator to trace every posted amount from report to account, journal line, source fact, initiating actor, policy, and correction history.

## Required Evidence

Entry ID, line ID, account and chart version, source context and record, correlation and causation IDs, idempotency key, actor, approver, policy version, entity, country, currency, dimensions, effective and posting times, state transitions, and integrity metadata.

## Access and Immutability

Posted entries and audit records are append-only. Access is role-scoped, sensitive values are masked or tokenized, exports are logged, and administrative access requires heightened approval. Audit evidence remains queryable after account retirement or projection rebuild.

## Investigation Path

```text
Report -> Account -> Journal Entry -> Journal Line -> Source Fact
	-> Payment / Settlement / Tax / Reward Event -> Actor and Approval
```

An audit export includes the query scope, filters, generated time, source versions, evidence references, and integrity check result.

## Related Documents

- [000-index.md](000-index.md)
- [004-journal-entries.md](004-journal-entries.md)
- [012-compensating-entries.md](012-compensating-entries.md)
- [017-ledger-retention.md](017-ledger-retention.md)
