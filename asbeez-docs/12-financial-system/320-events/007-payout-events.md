# Payout Events

> **Document:** 12-financial-system/320-events/007-payout-events.md

---

## Purpose

Payout events communicate withdrawal requests, validation, holds, approvals, submission, provider observations, completion, failure, return, reversal, and reconciliation.

## Event Catalog

`PayoutRequested`, `PayoutValidated`, `PayoutHeld`, `PayoutApproved`, `PayoutSubmitted`, `PayoutProviderObserved`, `PayoutPaid`, `PayoutFailed`, `PayoutReturned`, `PayoutReversed`, and `PayoutReconciled`.

## Payload and Rules

Events include payout/recipient IDs, source wallet, amount/currency, fee/reserve, destination token reference, provider/batch reference, entity/country, approval, policy, idempotency, and ledger/wallet references. Provider success is not authoritative until reconciliation. Events cannot bypass balance, sanctions, tax, risk, approval, or separation-of-duties controls.

## Related Documents

- [000-index.md](000-index.md)
- [005-wallet-events.md](005-wallet-events.md)
- [006-payment-events.md](006-payment-events.md)
- [../300-data-model/007-payout-schema.md](../300-data-model/007-payout-schema.md)
