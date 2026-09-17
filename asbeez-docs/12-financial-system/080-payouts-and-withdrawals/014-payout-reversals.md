# Payout Reversals

> **Document:** 12-financial-system/080-payouts-and-withdrawals/014-payout-reversals.md

---

## Purpose

A payout reversal records the approved counter-effect when a paid or submitted payout is returned, rejected after submission, duplicated, or otherwise requires financial correction.

## Rules

- the original payout, provider attempt, destination, and source obligation remain immutable;
- reversal requires provider/bank evidence or approved investigation;
- wallet, vendor, partner, member, reward, reserve, settlement, and GL effects are evaluated separately;
- a returned amount is not automatically available until reconciliation and compliance pass; and
- reversal fees, currency differences, and tax effects are explicit.

## Outcomes

Returned funds may restore an approved payable, remain in clearing, create a new hold, or require an operational exception. A reversal cannot create a new reward or payout entitlement without a separate policy-approved event.

## Related Documents

- [000-index.md](000-index.md)
- [013-payout-failures.md](013-payout-failures.md)
- [015-payout-reconciliation.md](015-payout-reconciliation.md)
- [019-payout-events.md](019-payout-events.md)
