# Payout Events

> **Document:** 12-financial-system/080-payouts-and-withdrawals/019-payout-events.md

---

## Purpose

Payout events are immutable facts for withdrawal, approval, provider execution, wallet/subledger movement, reconciliation, and reversal workflows.

## Event Catalog

- WithdrawalRequested, WithdrawalValidated, WithdrawalRejected, WithdrawalHeld;
- WithdrawalApproved, WithdrawalCancelled, WithdrawalExpired;
- PayoutQueued, PayoutSubmitted, PayoutPending, PayoutPaid;
- PayoutFailed, PayoutRetryScheduled, PayoutReturned, PayoutReversed;
- PayoutDestinationVerified, PayoutHoldPlaced, PayoutHoldReleased;
- PayoutReconciled, PayoutExceptionOpened, PayoutExceptionResolved; and
- PayoutBatchCreated, PayoutBatchSubmitted, PayoutBatchPartiallyCompleted.

## Contract

Events include event ID/version, request/payout/attempt/batch IDs, source wallet/settlement, recipient and destination references, amount/currency, country/entity, fee/tax, provider reference, state, occurred/effective time, policy versions, idempotency, correlation, and causation IDs.

## Rules

Consumers are idempotent. Provider events are evidence and are mapped through a versioned adapter. PayoutPaid does not remove source history and cannot be emitted without approved provider confirmation or a controlled manual evidence workflow.

## Related Documents

- [000-index.md](000-index.md)
- [002-payout-domain-model.md](002-payout-domain-model.md)
- [006-payout-processing.md](006-payout-processing.md)
- [015-payout-reconciliation.md](015-payout-reconciliation.md)
