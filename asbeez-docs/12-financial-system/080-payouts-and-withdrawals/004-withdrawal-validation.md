# Withdrawal Validation

> **Document:** 12-financial-system/080-payouts-and-withdrawals/004-withdrawal-validation.md

---

## Purpose

Withdrawal validation proves that a request is payable, permitted, correctly calculated, and safe to submit to a payout provider.

## Validation Gates

- source wallet or settlement is active and reconciled;
- amount, currency, country, entity, and beneficiary match;
- reward/commission conversion and classification are approved where applicable;
- available balance covers amount, fee, reserve, and hold requirements;
- minimum/maximum, velocity, and program limits pass;
- identity, KYC/KYB, sanctions, tax, and source-of-funds checks pass;
- destination is verified and supported; and
- no duplicate, dispute, fraud, or unresolved exception blocks payment.

## Decision

Validation returns approved, rejected, held, or requires-review with reason codes, evidence, policy versions, reviewer/system, and expiry. A passing validation reserves value; it does not submit a provider transfer.

## Related Documents

- [000-index.md](000-index.md)
- [003-withdrawal-requests.md](003-withdrawal-requests.md)
- [009-minimum-and-maximum-payouts.md](009-minimum-and-maximum-payouts.md)
- [016-payout-compliance.md](016-payout-compliance.md)
