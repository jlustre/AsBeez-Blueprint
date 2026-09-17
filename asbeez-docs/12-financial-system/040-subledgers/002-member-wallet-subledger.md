# Member Wallet Subledger

> **Document:** 12-financial-system/040-subledgers/002-member-wallet-subledger.md

---

## Purpose

The Member Wallet Subledger records member-facing wallet activity, availability, holds, reservations, releases, and statements. It does not independently create cash, revenue, or a payout entitlement.

## Record Types

- wallet creation and status;
- approved credit or debit instruction;
- pending, held, reserved, released, expired, or restricted amount;
- redemption, transfer, payout request, and payout result; and
- statement and balance snapshot.

## Balance Model

```text
Ledger-backed balance
- pending debits
- holds
- reservations
- restricted amount
= available balance
```

The exact formula is currency- and policy-specific. RP, ABC, and AHC balances are not treated as monetary wallet balances merely because they appear in a member interface.

## Controls

Every wallet movement references its source event and idempotency key. Credits from rewards require approved financial classification; payout availability requires settlement, compliance, reserve, and limit checks. Wallet totals reconcile to GL control accounts and approved source subledgers.

## Related Documents

- [000-index.md](000-index.md)
- [004-ahc-subledger.md](004-ahc-subledger.md)
- [008-commission-subledger.md](008-commission-subledger.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
