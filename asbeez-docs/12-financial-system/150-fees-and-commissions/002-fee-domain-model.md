# Fee Domain Model

> **Document:** 12-financial-system/150-fees-and-commissions/002-fee-domain-model.md

---

## Purpose

The Fee and Commission domain models fee plans, assessments, invoices, allocations, commissions, beneficiaries, caps, tax, reserves, adjustments, and reconciliation.

## Entities

| Entity | Responsibility |
| --- | --- |
| Fee Plan | service, basis, rate, effective period, payer, tax, and policy |
| Fee Assessment | calculated amount for a source transaction or service |
| Commission Rule | qualification, rate, cap, funding, and beneficiary |
| Commission Obligation | approved amount owed after qualification |
| Allocation | distribution of source amount among fee, tax, vendor, partner, reserve, and reward effects |
| Adjustment | correction linked to original fee or commission |
| Fee/Commission Statement | participant and finance view |

## Invariants

- one assessment references one source scope and policy version;
- amounts and currencies are explicit and reproducible;
- fee is not revenue until service recognition;
- commission is not payable without qualification and approval;
- refunds/chargebacks cannot create duplicate reversals; and
- original assessments remain immutable.

## Lifecycle

```text
Configured -> Assessed -> Reviewed -> Invoiced/Allocated -> Recognized/Payable -> Paid
Assessed -> Held | Rejected | Adjusted | Reversed
```

## Related Documents

- [000-index.md](000-index.md)
- [003-platform-fees.md](003-platform-fees.md)
- [014-fee-calculation.md](014-fee-calculation.md)
- [015-fee-allocation.md](015-fee-allocation.md)
