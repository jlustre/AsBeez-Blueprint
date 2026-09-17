# Partner Payouts

> **Document:** 12-financial-system/120-partner-finance/010-partner-payouts.md

---

## Purpose

Partner payouts execute approved partner settlement obligations through a verified destination and provider. They do not calculate commission, bonus, incentive, or settlement eligibility.

## Preconditions

Settlement approved, partner account active, destination verified, country/entity/currency compatible, tax and compliance passed, limits/fees/reserves/holds calculated, and idempotency established.

## Rules

Provider submission is not confirmed payment. Attempts, failures, returns, fees, reversals, and reconciliation remain separate. A payout cannot exceed approved payable or create a new partner earning, reward, or revenue effect.

## Correction

Returned or reversed funds remain attributable to the partner and original settlement. Restoration of payout availability requires provider evidence, reconciliation, compliance, and a new approved workflow.

## Related Documents

- [000-index.md](000-index.md)
- [009-partner-settlement.md](009-partner-settlement.md)
- [013-partner-reconciliation.md](013-partner-reconciliation.md)
- [015-partner-api.md](015-partner-api.md)
