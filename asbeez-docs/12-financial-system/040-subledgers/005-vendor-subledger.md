# Vendor Subledger

> **Document:** 12-financial-system/040-subledgers/005-vendor-subledger.md

---

## Purpose

The Vendor Subledger records vendor-level sales, entitlements, fees, taxes, reserves, holds, refunds, disputes, settlements, and payouts that support vendor payable control accounts.

## Lifecycle

```text
Order captured -> entitlement calculated -> held/reserved -> approved settlement -> payable -> payout -> reconciled
```

The source order and fulfillment/refund status remain authoritative for commercial facts. Settlement determines the amount owed; payout executes an approved transfer.

## Required Detail

Vendor ID, order and line IDs, gross amount, tax, platform fee, partner allocation, reserve, hold, refund/chargeback adjustment, net entitlement, currency, country, legal entity, settlement window, approval, payout, and policy versions.

## Rules

Vendor collections, vendor entitlement, and AsBeez revenue are separate values. A cancelled, returned, refunded, or disputed order creates explicit adjustments and may block payout. Vendor subledger totals reconcile to settlement batches and GL vendor payable accounts.

## Related Documents

- [000-index.md](000-index.md)
- [006-customer-subledger.md](006-customer-subledger.md)
- [008-commission-subledger.md](008-commission-subledger.md)
- [016-subledger-reconciliation.md](016-subledger-reconciliation.md)
