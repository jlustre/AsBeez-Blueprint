# Financial Sequence Diagrams

> **Document:** 12-financial-system/999-reference/008-financial-sequence-diagrams.md

---

## Purpose

These sequences summarize cross-context financial workflows for implementation, operations, testing, and incident review.

## Order-to-Cash

```text
Order/Commerce Event -> Payment Intent -> Authorization/Capture
-> Tax/Fees/Allocation -> Vendor/Partner/Reward Treatment
-> Journal Preparation/Approval/Posting -> Settlement/Reconciliation
-> Wallet/Payout/Reporting
```

## Refund/Dispute

```text
Request/Case -> Eligibility/Evidence -> Approval/Provider Action
-> Payment/Tax/Entitlement/Reserve Effects -> Ledger Compensation
-> Reconciliation -> Communication/Closure
```

## Control Rules

Each step is scoped, idempotent, correlated, observable, and compensatable. External calls are outside authoritative transactions; unknown results pause/reconcile. A sequence is guidance, not permission to skip policy, approval, ledger, tax, risk, or audit controls.

## Related Documents

- [000-index.md](000-index.md)
- [007-financial-state-diagrams.md](007-financial-state-diagrams.md)
- [005-journal-entry-reference.md](005-journal-entry-reference.md)
- [../290-architecture/006-financial-orchestration.md](../290-architecture/006-financial-orchestration.md)
