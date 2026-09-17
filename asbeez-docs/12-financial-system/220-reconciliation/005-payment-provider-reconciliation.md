# Payment Provider Reconciliation

> **Document:** 12-financial-system/220-reconciliation/005-payment-provider-reconciliation.md

---

## Purpose

Payment provider reconciliation matches captures, refunds, disputes, fees, settlements, balances, and transfers to AsBeez payments, orders, invoices, customer records, vendor/partner obligations, tax, rewards, wallets, and GL clearing.

## Rules

Provider event maps to one AsBeez effect, with amount, currency, fee, reference, status, and settlement date validated. Unknown, duplicate, stale, or mismatched events become exceptions. Provider status does not directly alter accounting, revenue, reward, vendor, partner, or payout state.

## Evidence

Each session retains provider statement/report, import time, source population, match rules, matched/unmatched totals, currency, account/entity, reviewer, approval, exception age, and resolution reference.

## Related Documents

- [000-index.md](000-index.md)
- [004-bank-reconciliation.md](004-bank-reconciliation.md)
- [006-wallet-reconciliation.md](006-wallet-reconciliation.md)
- [017-reconciliation-reporting.md](017-reconciliation-reporting.md)
