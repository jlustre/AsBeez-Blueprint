# Vendor Reconciliation

> **Document:** 12-financial-system/110-vendor-finance/014-vendor-reconciliation.md

---

## Purpose

Vendor reconciliation proves that vendor orders, earnings, fees, taxes, reserves, holds, refunds, chargebacks, settlements, payouts, statements, and General Ledger control accounts agree.

## Required Checks

- order lines and fulfillment status agree to vendor earnings;
- payment/invoice source agrees to settlement basis;
- platform fee, partner allocation, tax, reserve, and hold calculations agree;
- vendor payable agrees to approved settlement;
- payout attempts and provider/bank evidence agree to payable reductions;
- refunds and chargebacks propagate to earnings and settlement; and
- country/entity/currency/policy dimensions agree across records.

## Exceptions

Missing source, duplicate earning, incorrect vendor, unexplained residual, provider mismatch, stale tax/fee policy, premature payout, or reward-linked error is an owned exception even when aggregate totals balance.

## Evidence

Reconciliation stores population, monetary totals, source periods, rule/policy versions, account mappings, reviewer, approval, age, unmatched items, and resolution references.

## Related Documents

- [000-index.md](000-index.md)
- [008-vendor-settlement.md](008-vendor-settlement.md)
- [009-vendor-payouts.md](009-vendor-payouts.md)
- [015-vendor-financial-reporting.md](015-vendor-financial-reporting.md)
