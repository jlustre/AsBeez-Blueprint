# Compensating Entries

> **Document:** 12-financial-system/030-general-ledger/012-compensating-entries.md

---

## Purpose

A compensating entry corrects a posted accounting result by recording the required counter-effect and, when necessary, the corrected classification. It preserves the complete history of what was posted and why it changed.

## Reversal Versus Compensation

| Mechanism | Use |
| --- | --- |
| Reversal | fully negates a prior entry, commonly a temporary or voided effect |
| Compensation | corrects amount, account, dimension, timing, or classification with a new accounting effect |

## Required Linkage

The correcting entry references the original entry, source case, reason code, preparer, approver, policy version, effective date, and affected reporting dimensions. Where the correction crosses currencies or periods, the calculation and rate evidence are retained.

## Prohibited Behavior

No correction may edit or delete posted lines, silently net unrelated entries, reuse an idempotency key for a different effect, or post to suspense without an investigation record.

## Related Documents

- [000-index.md](000-index.md)
- [010-ledger-adjustments.md](010-ledger-adjustments.md)
- [011-reversals.md](011-reversals.md)
- [015-ledger-auditability.md](015-ledger-auditability.md)
