# Vendor Payouts

> **Document:** 12-financial-system/110-vendor-finance/009-vendor-payouts.md

---

## Purpose

Vendor payouts execute approved vendor settlement obligations through a verified destination and provider. They do not calculate earnings or independently release holds/reserves.

## Preconditions

Settlement approved, vendor account active, destination verified, country/entity/currency compatible, tax and compliance passed, limits/fees/reserves/holds calculated, and payout idempotency established.

## Rules

Payout submission is not confirmed payment. Provider attempts, failures, returns, fees, and reconciliation are recorded separately. A vendor payout cannot exceed approved payable or create a new earning, reward, or revenue effect.

## Correction

Returned or reversed funds remain attributable to the vendor and original settlement. Restoration of payout availability requires provider evidence, reconciliation, compliance, and a new approved workflow.

## Related Documents

- [000-index.md](000-index.md)
- [008-vendor-settlement.md](008-vendor-settlement.md)
- [014-vendor-reconciliation.md](014-vendor-reconciliation.md)
- [016-vendor-api.md](016-vendor-api.md)
