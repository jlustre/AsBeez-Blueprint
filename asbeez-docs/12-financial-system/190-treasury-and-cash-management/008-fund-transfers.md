# Fund Transfers

> **Document:** 12-financial-system/190-treasury-and-cash-management/008-fund-transfers.md

---

## Purpose

Fund transfers move approved cash between AsBeez bank/provider accounts, entities, currencies, reserves, funds, or clearing accounts for a documented treasury purpose.

## Required Data

Transfer ID, source/destination accounts, entities, countries, currencies, amount, purpose, beneficiary, FX/rate/fee, approval, provider reference, timing, tax/intercompany treatment, and reconciliation status.

## Rules

- source and destination ownership, availability, currency, and restrictions are validated;
- transfer cannot fund an unapproved payout, reward, vendor/partner obligation, or reserve use;
- cross-entity transfers have intercompany/accounting/tax treatment;
- external submission is separate from confirmed completion; and
- idempotency, dual control, sanctions, limits, and audit apply.

## Related Documents

- [000-index.md](000-index.md)
- [003-bank-accounts.md](003-bank-accounts.md)
- [009-bank-reconciliation.md](009-bank-reconciliation.md)
- [014-treasury-controls.md](014-treasury-controls.md)
