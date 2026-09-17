# Fee Settings

> **Document:** 12-financial-system/390-configuration/013-fee-settings.md

---

## Purpose

Fee settings define platform, transaction, subscription, listing, service, payment, withdrawal, FX, vendor, partner, referral, and commission calculation and allocation policies.

## Required Metadata

Fee/commission type, payer/payee, basis, rate/flat amount, currency, minimum/maximum, tax treatment, rounding/allocation, effective date, country/entity, product/channel, exemption, account mapping, owner, approval, and version.

## Rules

Fees and commissions are calculated deterministically, disclosed where required, idempotent, and linked to source transactions and ledger treatment. Changes cannot rewrite historical calculations, create negative/unsupported allocations, or convert RP/ABC/AHC into money without approved conversion policy.

## Related Documents

- [000-index.md](000-index.md)
- [008-payment-settings.md](008-payment-settings.md)
- [014-tax-settings.md](014-tax-settings.md)
- [../150-fees-and-commissions/001-overview.md](../150-fees-and-commissions/001-overview.md)
