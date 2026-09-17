# Ledger Testing

> **Document:** 12-financial-system/360-testing/004-ledger-testing.md

---

## Purpose

Ledger tests verify journal preparation, account mapping, posting, balances, periods, dimensions, corrections, projections, reconciliation, and audit lineage.

## Invariants

Every posted journal has valid source and approval, open period, valid accounts/dimensions, correct entity/country/currency, non-negative line amounts, equal debits and credits, immutable lines, idempotency, and traceable reversal/compensation.

## Required Cases

Test normal, partial, multi-currency, tax, fee, reserve, vendor/partner, reward, refund, dispute, payout, provider settlement, failure, retry, stale version, period lock, duplicate, and correction workflows. Compare subledger/control-account and projection totals.

## Related Documents

- [000-index.md](000-index.md)
- [005-double-entry-validation.md](005-double-entry-validation.md)
- [010-reconciliation-testing.md](010-reconciliation-testing.md)
- [../300-data-model/003-journal-entries-schema.md](../300-data-model/003-journal-entries-schema.md)
