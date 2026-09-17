# Payout Domain Model

> **Document:** 12-financial-system/080-payouts-and-withdrawals/002-payout-domain-model.md

---

## Purpose

The payout domain models approved payable obligations, withdrawal requests, payout destinations, batches, provider attempts, fees, holds, failures, reversals, and reconciliation.

## Entities

| Entity | Responsibility |
| --- | --- |
| Withdrawal Request | recipient request for an approved amount/unit |
| Payable Obligation | settlement or wallet-backed amount eligible for payment |
| Payout Destination | verified bank, provider, or approved wallet reference |
| Payout | execution workflow for an approved obligation |
| Payout Attempt | provider submission and response |
| Payout Batch | grouped execution with independent payout identities |
| Payout Hold | restriction caused by risk, compliance, reserve, dispute, or operations |

## Invariants

- a payout cannot exceed the approved payable or available balance;
- one request/idempotency scope creates one financial effect;
- destination ownership and country/currency compatibility are verified;
- fees, taxes, reserves, and holds are explicit;
- provider success is not assumed from request submission; and
- RP, ABC, AHC, or unclassified reward quantities cannot be paid as money.

## Lifecycle

```text
Requested -> Validated -> Approved -> Queued -> Submitted -> Paid
Requested -> Rejected | Cancelled | Held
Submitted -> Failed -> Retrying | Failed
Paid -> Reversed where provider and policy permit
```

## Related Documents

- [000-index.md](000-index.md)
- [003-withdrawal-requests.md](003-withdrawal-requests.md)
- [006-payout-processing.md](006-payout-processing.md)
- [019-payout-events.md](019-payout-events.md)
