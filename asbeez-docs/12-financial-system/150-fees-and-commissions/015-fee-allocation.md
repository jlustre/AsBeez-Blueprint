# Fee Allocation

> **Document:** 12-financial-system/150-fees-and-commissions/015-fee-allocation.md

---

## Purpose

Fee allocation distributes a source amount among customer consideration, tax, vendor entitlement, platform fee, partner/referral commission, payment/withdrawal/FX cost, reserve, reward effect, and residual clearing.

## Rules

- allocation references one source order/payment/invoice/service/settlement;
- components, currency, rounding, policy, country/entity, and beneficiaries are explicit;
- tax and amounts held for others are not silently treated as revenue;
- allocation cannot create a commission without qualification or a reward liability without classification;
- total allocated value reconciles to source, with residual clearing explicitly owned; and
- refunds, chargebacks, cancellations, and corrections create linked reallocation events.

## Output

The allocation result includes components, amounts, account mappings, subledger effects, recognition conditions, payable/receivable status, exceptions, and idempotency key. It does not post the GL directly; the posting workflow validates and commits approved monetary effects.

## Related Documents

- [000-index.md](000-index.md)
- [014-fee-calculation.md](014-fee-calculation.md)
- [016-fee-reconciliation.md](016-fee-reconciliation.md)
- [003-platform-fees.md](003-platform-fees.md)
