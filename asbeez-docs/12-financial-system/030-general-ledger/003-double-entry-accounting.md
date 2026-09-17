# Double Entry Accounting

> **Document:** 12-financial-system/030-general-ledger/003-double-entry-accounting.md

---

## Purpose

Double-entry accounting records each monetary effect as equal total debits and credits across one or more ledger accounts. It preserves the accounting equation and makes source, destination, and classification explicit.

## Entry Rules

- Every journal entry has at least two lines.
- Total debits equal total credits in the entry currency and posting scope.
- Each line has one account, amount, debit/credit direction, currency, entity, dimensions, and source reference.
- A line cannot be both debit and credit or have a zero/negative amount.
- Cross-currency entries use explicit conversion lines and evidence.

## Common Flows

| Event | Debit | Credit |
| --- | --- | --- |
| Customer payment captured | cash or processor receivable | customer receivable or clearing |
| Platform fee recognized | receivable or clearing | marketplace revenue |
| Vendor amount earned | settlement expense or cost | vendor payable |
| Vendor payout | vendor payable | cash or payout clearing |
| Tax collected | cash or receivable | tax payable |
| Reward obligation recognized | approved reward expense or contra-revenue | reward liability |

The final accounts depend on the approved accounting policy, contract, jurisdiction, and source context.

For AsBeez marketplace activity, the captured customer amount must be allocated among tax, vendor entitlement, platform revenue, partner obligation, reserves/holds, and any approved reward financial effect before the order is considered fully allocated. RP, ABC, matrix placement, and AHC events remain separate source events and are not silently treated as cash.

## Prohibited Shortcuts

Do not create a one-sided balance update, use a wallet projection as a journal, net unrelated transactions, or post to suspense to avoid classification.

## Related Documents

- [000-index.md](000-index.md)
- [005-ledger-accounts.md](005-ledger-accounts.md)
- [008-ledger-balancing.md](008-ledger-balancing.md)
- [010-ledger-adjustments.md](010-ledger-adjustments.md)
- [019-asbeez-posting-mappings.md](019-asbeez-posting-mappings.md)
