# Payment Provider Reconciliation

> **Document:** 12-financial-system/190-treasury-and-cash-management/010-payment-provider-reconciliation.md

---

## Purpose

Payment provider reconciliation matches provider captures, refunds, disputes, fees, settlements, balances, transfers, and payouts to AsBeez payment, customer, order, wallet, vendor/partner, tax, reserve, and GL records.

## Required Checks

- provider event maps to one AsBeez payment/effect;
- gross, fee, net, currency, settlement date, and reference agree;
- provider balance agrees to imported transactions and cash position;
- refunds, chargebacks, payout returns, and reserves propagate; and
- unknown, duplicate, stale, or unmatched events become exceptions.

## Rules

Provider status is evidence, not direct authority over AsBeez accounting. Reconciliation does not alter provider history or create a payout/revenue/reward effect without validated workflow.

## Related Documents

- [000-index.md](000-index.md)
- [009-bank-reconciliation.md](009-bank-reconciliation.md)
- [010-payment-provider-reconciliation.md](010-payment-provider-reconciliation.md)
- [015-treasury-reporting.md](015-treasury-reporting.md)
