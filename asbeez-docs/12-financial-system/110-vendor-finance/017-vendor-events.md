# Vendor Events

> **Document:** 12-financial-system/110-vendor-finance/017-vendor-events.md

---

## Purpose

Vendor finance events are immutable facts for vendor account, earnings, fees, reserves, holds, settlement, payout, refund, chargeback, tax, statement, and reconciliation workflows.

## Event Catalog

- VendorAccountVerified, VendorAccountRestricted, VendorAccountSuspended;
- VendorEarningRecorded, VendorEarningAdjusted, VendorFeeAssessed;
- VendorReservePlaced, VendorReserveReleased, VendorHoldPlaced, VendorHoldReleased;
- VendorSettlementCalculated, VendorSettlementApproved, VendorSettlementHeld;
- VendorPayoutRequested, VendorPayoutApproved, VendorPayoutSubmitted, VendorPayoutPaid, VendorPayoutFailed;
- VendorRefundApplied, VendorChargebackOpened, VendorChargebackResolved;
- VendorTaxWithheld, VendorStatementIssued, VendorReconciliationCompleted; and
- VendorExceptionOpened, VendorExceptionResolved.

## Contract

Events include ID/version, vendor, order/line/settlement/payout references, amount/currency, tax/fee/reserve/hold, country/entity, policy versions, provider reference, occurred/effective time, actor/system, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. Events do not silently alter vendor balances, create revenue, or release payout; each downstream effect follows its owning workflow and reconciliation evidence.

## Related Documents

- [000-index.md](000-index.md)
- [003-vendor-earnings.md](003-vendor-earnings.md)
- [008-vendor-settlement.md](008-vendor-settlement.md)
- [014-vendor-reconciliation.md](014-vendor-reconciliation.md)
