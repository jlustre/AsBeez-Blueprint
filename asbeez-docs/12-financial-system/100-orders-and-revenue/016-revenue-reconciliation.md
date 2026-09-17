# Revenue Reconciliation

> **Document:** 12-financial-system/100-orders-and-revenue/016-revenue-reconciliation.md

---

## Purpose

Revenue reconciliation proves that orders, invoices, payments, vendor/partner settlement, tax, discounts, refunds, deferred/accrued schedules, recognized revenue, reserves, rewards, and General Ledger control accounts agree.

## Required Checks

- GMV metric population agrees to order lines and status definition;
- captured/invoiced source agrees to order allocation;
- platform fees and recognized revenue agree to performance evidence;
- vendor/partner obligations and payouts agree to settlement subledgers;
- tax agrees to assessments and payable accounts;
- deferred, accrued, and unearned schedules agree to periods;
- refund, chargeback, discount, reward, and reserve effects are linked; and
- country/entity/currency/dimension totals reconcile to reports.

## Exceptions

Missing source, duplicate order, principal/agent mismatch, unexplained residual, timing difference, provider mismatch, unrecognized obligation, stale policy, or incorrect reward link is an owned exception even when aggregate totals balance.

## Related Documents

- [000-index.md](000-index.md)
- [003-gross-merchandise-value.md](003-gross-merchandise-value.md)
- [011-revenue-recognition.md](011-revenue-recognition.md)
- [017-revenue-reporting.md](017-revenue-reporting.md)
