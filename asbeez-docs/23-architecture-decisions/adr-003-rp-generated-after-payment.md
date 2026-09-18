# ADR-003: RP Generated After Payment

## Status

Accepted, subject to reward/legal/accounting policy.

## Context

Reward qualification before payment completion can create liabilities for abandoned, failed, refunded, disputed, fraudulent, or reversed commerce. Payment intent alone is not customer value received and does not prove qualifying activity.

## Decision

Generate RP only after the payment reaches the approved qualifying state defined by country and reward policy, normally successful capture/acceptance with required fraud, tax, order, and eligibility checks. Payment authorization or intent creation alone does not generate RP. Settlement timing, refund windows, holds, or provisional rewards may be configured only by explicit policy and must remain clearly provisional.

## Consequences

Rewards are less exposed to abandoned or failed payments, but issuance may be delayed and may require pending/provisional status. Refunds, chargebacks, fraud, cancellation, expiry, and policy breach produce explicit reversal, suspension, or adjustment events. RP remains a program unit, not money.

## Controls

Use idempotent source event/payment reference, order/member/country/policy version, qualification rules, fraud/compliance status, and audit correlation. Reward Finance evaluates any approved monetary consequence separately; APIs and UI disclose pending, reversed, expired, and unavailable states.

## Related Documents

- [index.md](index.md)
- [adr-002-multi-vendor-checkout.md](adr-002-multi-vendor-checkout.md)
- [../12-financial-system/060-reward-finance/001-overview.md](../12-financial-system/060-reward-finance/001-overview.md)
- [../12-financial-system/070-payments/006-payment-capture.md](../12-financial-system/070-payments/006-payment-capture.md)
