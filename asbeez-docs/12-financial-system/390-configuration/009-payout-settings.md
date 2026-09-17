# Payout Settings

> **Document:** 12-financial-system/390-configuration/009-payout-settings.md

---

## Purpose

Payout settings define methods/providers, eligibility, limits, fees, batches, timing, reserves, holds, approval thresholds, country/currency, compliance, and failure/return behavior.

## Rules

Settings cannot bypass identity, sanctions, tax, risk, reserve, balance, approval, destination lock, idempotency, or reconciliation. Provider paid/returned mapping remains evidence until reconciled. Material threshold or destination changes require dual control and staged testing.

## Change Control

Record owner, scope, current/target values, reason, entity/country/currency impact, effective dates, provider capability, liquidity impact, tests, approvals, monitoring, rollback, and review expiry.

## Related Documents

- [000-index.md](000-index.md)
- [008-payment-settings.md](008-payment-settings.md)
- [015-reserve-settings.md](015-reserve-settings.md)
- [../340-integrations/004-payout-providers.md](../340-integrations/004-payout-providers.md)
