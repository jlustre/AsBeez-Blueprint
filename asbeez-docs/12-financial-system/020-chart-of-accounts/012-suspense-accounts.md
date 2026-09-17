# Suspense Accounts

> **Document:** 12-financial-system/020-chart-of-accounts/012-suspense-accounts.md

---

## Purpose

Suspense accounts isolate an unidentified, invalid, or incomplete financial difference while investigation occurs. They are an exception mechanism, not a normal operating destination.

## Permitted Triggers

- an external statement line cannot yet be matched;
- a provider sends an amount without a valid source reference;
- a posting fails validation after funds have moved externally; or
- a controlled migration identifies an unreconciled historical difference.

## Controls

Each suspense line requires a case ID, owner, reason code, source evidence, currency, amount, created time, and resolution target. Suspense accounts are excluded from available wallet balances and ordinary performance reporting.

## Resolution

Resolution must identify the correct account and source transaction, then post a compensating transfer. Aged suspense is reported to Finance leadership and Compliance. Automatic netting or periodic zeroing without evidence is prohibited.

## Related Documents

- [000-index.md](000-index.md)
- [011-clearing-accounts.md](011-clearing-accounts.md)
- [015-account-lifecycle.md](015-account-lifecycle.md)
- [016-account-governance.md](016-account-governance.md)
