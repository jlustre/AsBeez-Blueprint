# Ledger Accounts

> **Document:** 12-financial-system/030-general-ledger/005-ledger-accounts.md

---

## Purpose

A ledger account is a controlled posting destination defined by the Chart of Accounts and used by journal lines. The account describes economic meaning; dimensions describe business context.

## Required Account Data

Account ID, account number, name, class, normal balance, parent, posting status, legal entity scope, currency policy, required dimensions, effective dates, owner, and chart version.

## Posting Rules

- Only active posting accounts accept ordinary journal lines.
- The account class and normal balance are validated before posting.
- Required dimensions cannot be omitted or replaced with fabricated values.
- Retired accounts may accept only approved historical correction workflows.
- Account definitions are versioned; historical lines retain the definition effective when posted.

## Balance Meaning

An account balance is the sum of posted journal lines for a defined entity, currency, period, and dimension slice. It is not the same as a wallet available balance, settlement payable, or provider balance until the relevant reconciliation and projection rules are applied.

## Related Documents

- [000-index.md](000-index.md)
- [003-double-entry-accounting.md](003-double-entry-accounting.md)
- [007-ledger-posting.md](007-ledger-posting.md)
- [016-ledger-partitioning.md](016-ledger-partitioning.md)
