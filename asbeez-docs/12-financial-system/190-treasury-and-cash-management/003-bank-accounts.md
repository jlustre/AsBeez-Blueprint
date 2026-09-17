# Bank Accounts

> **Document:** 12-financial-system/190-treasury-and-cash-management/003-bank-accounts.md

---

## Purpose

Bank Accounts record approved external bank custody accounts used by AsBeez legal entities for collection, settlement, payout, reserves, tax, operating cash, and treasury management.

## Required Data

Account ID, institution, masked account reference, legal entity, country, currency, account purpose, signatories, status, restrictions, provider integration, GL account, opening/closing evidence, and effective dates.

## Rules

Opening, changing, closing, or transferring from a bank account requires verification, dual control, entity authority, purpose, sanctions/compliance, and audit evidence. Bank account balance is external evidence until statement reconciliation. Customer/vendor/member funds cannot be mixed with company cash without approved custody/accounting treatment.

## Related Documents

- [000-index.md](000-index.md)
- [002-treasury-domain-model.md](002-treasury-domain-model.md)
- [009-bank-reconciliation.md](009-bank-reconciliation.md)
- [014-treasury-controls.md](014-treasury-controls.md)
