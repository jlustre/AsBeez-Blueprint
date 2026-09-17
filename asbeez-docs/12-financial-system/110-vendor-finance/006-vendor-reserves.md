# Vendor Reserves

> **Document:** 12-financial-system/110-vendor-finance/006-vendor-reserves.md

---

## Purpose

Vendor reserves restrict a documented portion of vendor entitlement to protect against refunds, returns, chargebacks, fraud, tax, fulfillment, disputes, or other approved vendor exposure.

## Required Data

Reserve ID, vendor, order/population, exposure type, basis, rate/amount, currency, country/entity, start date, review/release condition, owner, approval, utilization, and settlement/GL mapping.

## Rules

Reserve is not revenue, fee, confiscation, or free cash. It remains attributable to the vendor and exposure population. Release or utilization is a new event and cannot be applied to an unrelated vendor, order, country, or program.

## Monitoring

Report reserved, released, utilized, expired, and outstanding amounts by vendor, exposure, country, entity, currency, age, and policy version. Reconcile to vendor subledger, settlement, reserve accounts, and payout status.

## Related Documents

- [000-index.md](000-index.md)
- [007-vendor-holds.md](007-vendor-holds.md)
- [008-vendor-settlement.md](008-vendor-settlement.md)
- [014-vendor-reconciliation.md](014-vendor-reconciliation.md)
