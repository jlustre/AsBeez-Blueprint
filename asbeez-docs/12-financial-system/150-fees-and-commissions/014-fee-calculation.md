# Fee Calculation

> **Document:** 12-financial-system/150-fees-and-commissions/014-fee-calculation.md

---

## Purpose

Fee calculation determines a fee or commission from a source transaction/service and effective plan without changing source facts.

## Calculation Inputs

Source ID, payer/beneficiary, fee/commission type, basis, rate/fixed amount, tier, minimum/maximum, currency, tax, country/entity, discounts, refund/chargeback status, program/policy version, and rounding.

## Rules

Calculations are server-side, deterministic, versioned, explainable, and idempotent. A calculation returns amount, basis, policy, reason, and exceptions. It does not by itself invoice, recognize revenue, create payable, debit wallet, or trigger payout.

## Corrections

Changes to plans apply from effective time. Recalculation creates a new assessment and adjustment referencing the original; historical assessed, invoiced, recognized, payable, and paid values remain visible.

## Related Documents

- [000-index.md](000-index.md)
- [002-fee-domain-model.md](002-fee-domain-model.md)
- [015-fee-allocation.md](015-fee-allocation.md)
- [016-fee-reconciliation.md](016-fee-reconciliation.md)
