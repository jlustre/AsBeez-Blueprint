# Contra Accounts

> **Document:** 12-financial-system/020-chart-of-accounts/010-contra-accounts.md

---

## Purpose

Contra accounts offset a related account while preserving the original gross activity and its audit trail.

## Families

| Contra type | Related account | Examples |
| --- | --- | --- |
| Contra-asset | asset | accumulated depreciation, receivable allowance |
| Contra-revenue | revenue | discounts, credits, approved refunds |
| Contra-liability | liability | released or returned customer obligation where policy requires |

## Rules

- Every contra account declares the account family it offsets.
- A contra posting references the original transaction or policy event.
- Contra balances are not used to hide errors or force a desired report total.
- Presentation rules distinguish gross, contra, and net values.
- Corrections use a new compensating entry, never an update to a posted line.

## Related Documents

- [000-index.md](000-index.md)
- [005-asset-accounts.md](005-asset-accounts.md)
- [008-revenue-accounts.md](008-revenue-accounts.md)
- [011-clearing-accounts.md](011-clearing-accounts.md)
