# Double Entry Validation

> **Document:** 12-financial-system/360-testing/005-double-entry-validation.md

---

## Purpose

Double-entry validation proves that each posted monetary effect is balanced, complete, correctly classified, and linked to approved source facts.

## Assertions

For each journal, assert total debits equal total credits in posting currency; every line has one side, valid account/chart version, period, entity/country, currency, dimensions, source, policy, actor, and idempotency; and cross-currency entries retain rate, fee, spread, rounding, and gain/loss evidence.

## Mutation Tests

Attempt unbalanced, missing-account, invalid-period, duplicate, unauthorized, stale-version, negative/precision-invalid, cross-country-invalid, and post-edit operations. Each must be rejected or produce an approved compensating record; posted history must remain unchanged.

## Related Documents

- [000-index.md](000-index.md)
- [004-ledger-testing.md](004-ledger-testing.md)
- [009-contract-testing.md](009-contract-testing.md)
- [../290-architecture/005-double-entry-ledger-architecture.md](../290-architecture/005-double-entry-ledger-architecture.md)
