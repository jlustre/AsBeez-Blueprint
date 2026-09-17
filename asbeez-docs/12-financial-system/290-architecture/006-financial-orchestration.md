# Financial Orchestration

> **Document:** 12-financial-system/290-architecture/006-financial-orchestration.md

---

## Purpose

Financial orchestration coordinates cross-context workflows such as order-to-payment allocation, refund, vendor/partner settlement, reward treatment, payout, tax, reserve, reconciliation, and close.

## Orchestrator Rules

- orchestration coordinates; it does not own another context’s domain decision;
- each step has command, event, timeout, retry, compensation, and status;
- workflows are idempotent and resumable;
- external provider calls are outside database transactions and reconciled; and
- financial posting occurs only after approved source facts and policy validation.

## Example

```text
Order Completed -> Payment Captured -> Tax Assessed -> Allocation
-> Vendor/Partner Settlement -> Reward Financial Treatment
-> Ledger Posting -> Payout/Wallet -> Reconciliation
```

## Related Documents

- [000-index.md](000-index.md)
- [007-saga-patterns.md](007-saga-patterns.md)
- [009-idempotency.md](009-idempotency.md)
- [011-consistency-model.md](011-consistency-model.md)
