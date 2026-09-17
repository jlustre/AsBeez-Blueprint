# Clearing Accounts

> **Document:** 12-financial-system/020-chart-of-accounts/011-clearing-accounts.md

---

## Purpose

Clearing accounts temporarily hold amounts while a known financial workflow moves value between recognized states or owners.

## Approved Uses

- payment funds captured but not yet settled by a provider;
- vendor or partner amounts calculated but awaiting approval;
- payout funds submitted but not confirmed;
- tax collected pending remittance;
- intercompany or treasury transfers in transit; and
- controlled batch allocation between source and destination accounts.

## Rules

Every clearing account has an owner, expected aging, source event, destination state, currency, and reconciliation procedure. A clearing balance must have a matching operational record. Clearing is not a permanent account class for unresolved differences.

## Aging and Resolution

Daily monitoring identifies aged balances. The owner must resolve, reclassify, return, or escalate an item using a new journal entry. No user may clear an item by deleting, editing, or posting an unexplained offset.

## Related Documents

- [000-index.md](000-index.md)
- [005-asset-accounts.md](005-asset-accounts.md)
- [006-liability-accounts.md](006-liability-accounts.md)
- [012-suspense-accounts.md](012-suspense-accounts.md)
- [016-account-governance.md](016-account-governance.md)
