# Treasury Events

> **Document:** 12-financial-system/190-treasury-and-cash-management/017-treasury-events.md

---

## Purpose

Treasury events are immutable facts for account, cash position, transfer, liquidity, forecast, reconciliation, concentration, country, FX, and control workflows.

## Event Catalog

- BankAccountOpened, BankAccountRestricted, BankAccountClosed;
- CashPositionCaptured, ProviderBalanceImported, LiquidityThresholdBreached;
- FundTransferRequested, FundTransferApproved, FundTransferSubmitted, FundTransferCompleted, FundTransferFailed;
- CashConcentrationRequested, CashConcentrationCompleted;
- ForecastPublished, ForecastExceptionOpened;
- BankReconciliationCompleted, ProviderReconciliationCompleted, TreasuryExceptionOpened/Resolved;
- FXExposureRecorded, TreasuryControlBreached; and
- ReserveFunded, ReserveReleased, ReserveUtilized.

## Contract

Events include ID/version, account/source/destination, entity/country, currency, amount, purpose, provider/bank reference, restrictions, FX/fee, policy version, occurred/effective time, actor/system, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. Treasury events do not directly change customer/vendor/partner/reward balances or GL without approved workflow, accounting mapping, and reconciliation.

## Related Documents

- [000-index.md](000-index.md)
- [008-fund-transfers.md](008-fund-transfers.md)
- [009-bank-reconciliation.md](009-bank-reconciliation.md)
- [014-treasury-controls.md](014-treasury-controls.md)
