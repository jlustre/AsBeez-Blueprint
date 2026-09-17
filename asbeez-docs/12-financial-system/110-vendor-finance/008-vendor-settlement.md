# Vendor Settlement

> **Document:** 12-financial-system/110-vendor-finance/008-vendor-settlement.md

---

## Purpose

Vendor settlement calculates and approves the amount owed to a vendor for an order or settlement batch after gross sales, tax, platform fees, partner allocations, reserves, holds, refunds, chargebacks, and other approved adjustments.

## Lifecycle

```text
Calculated -> Reviewed -> Approved -> Payable -> Paid/Settled
Calculated -> Held | Rejected | Adjusted
```

## Required Detail

Vendor, order/line, source payment/invoice, gross basis, tax, commission/fees, partner allocation, reserve, hold, refund/chargeback, net payable, currency, country/entity, period, approval, payout, and policy versions.

## Rules

Settlement is not AsBeez revenue recognition and payout is not settlement calculation. The batch must reconcile to captured/invoiced source and vendor subledger; residuals remain in named clearing or exception accounts.

## Related Documents

- [000-index.md](000-index.md)
- [003-vendor-earnings.md](003-vendor-earnings.md)
- [009-vendor-payouts.md](009-vendor-payouts.md)
- [014-vendor-reconciliation.md](014-vendor-reconciliation.md)
