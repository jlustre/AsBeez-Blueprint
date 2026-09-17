# Partner Events

> **Document:** 12-financial-system/120-partner-finance/016-partner-events.md

---

## Purpose

Partner Finance events are immutable facts for partner approval, attribution, earnings, commissions, bonuses, incentives, reserves, holds, settlement, payout, tax, statements, and reconciliation.

## Event Catalog

- PartnerApproved, PartnerRestricted, PartnerSuspended;
- PartnerActivityAttributed, PartnerActivityDisqualified;
- PartnerEarningRecorded, PartnerCommissionCalculated, PartnerBonusGranted, PartnerIncentiveQualified;
- PartnerReservePlaced, PartnerReserveReleased, PartnerHoldPlaced, PartnerHoldReleased;
- PartnerSettlementCalculated, PartnerSettlementApproved, PartnerSettlementHeld;
- PartnerPayoutRequested, PartnerPayoutApproved, PartnerPayoutSubmitted, PartnerPayoutPaid, PartnerPayoutFailed;
- PartnerAdjustmentCreated, PartnerTaxWithheld, PartnerStatementIssued, PartnerReconciled; and
- PartnerExceptionOpened, PartnerExceptionResolved.

## Contract

Events include ID/version, partner/program/agreement, source order/service/activity, attribution, amount/unit/currency, country/entity, tax/fee/reserve/hold, payout/provider reference, policy versions, occurred/effective time, actor/system, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. Partner events do not silently create payable, revenue, reward, or payout effects; each consequence follows qualification, funding, settlement, and reconciliation rules.

## Related Documents

- [000-index.md](000-index.md)
- [003-partner-earnings.md](003-partner-earnings.md)
- [009-partner-settlement.md](009-partner-settlement.md)
- [013-partner-reconciliation.md](013-partner-reconciliation.md)
