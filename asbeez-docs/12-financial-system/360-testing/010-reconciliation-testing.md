# Reconciliation Testing

> **Document:** 12-financial-system/360-testing/010-reconciliation-testing.md

---

## Purpose

Reconciliation tests prove that ledger, subledger, bank, provider, wallet, reward, vendor, partner, tax, reserve, and country sources match under defined keys, timing, currency, and tolerance rules.

## Required Cases

Test exact match, timing difference, amount/currency mismatch, duplicate, missing, partial, late, reversed, provider unknown, FX/rounding, source correction, stale snapshot, control-total failure, exception assignment, resolution, approval, certification, reopening, and rebuild.

## Assertions

Differences remain visible and are never hidden by manual balance edits. Certification identifies scope, period, source versions, control totals, unresolved risk, reviewer, and evidence. Accepted adjustments are idempotent, policy-approved, linked to source and ledger, and auditable.

## Related Documents

- [000-index.md](000-index.md)
- [004-ledger-testing.md](004-ledger-testing.md)
- [011-financial-close-testing.md](011-financial-close-testing.md)
- [../300-data-model/014-reconciliation-schema.md](../300-data-model/014-reconciliation-schema.md)
