# Financial State Diagrams

> **Document:** 12-financial-system/999-reference/007-financial-state-diagrams.md

---

## Purpose

These state diagrams summarize common financial lifecycle states. Domain documents and policies govern exact transitions.

## Payment/Refund/Payout State

```text
Requested -> Validating -> Authorized/Approved -> Submitted
-> Processing -> Completed/Settled
				  |-> Failed/Cancelled/Returned/Unknown -> Reconciled
```

Refunds, disputes, reserves, wallets, invoices, and periods use explicit pending, held, failed, reversed, compensated, exception, and certified states rather than implicit success.

## Ledger State

```text
Draft -> Prepared -> Validated -> Approved -> Posted -> Reversed/Compensated
```

Posted journals are immutable and balanced. Projections and reports are derived and may be stale or rebuilt.

## State Rules

Every transition identifies actor/service, policy/version, scope, source, correlation, idempotency, approval, and evidence. Provider state is evidence until mapped/reconciled; no state diagram authorizes bypassing controls.

## Related Documents

- [000-index.md](000-index.md)
- [004-transaction-type-catalog.md](004-transaction-type-catalog.md)
- [008-financial-sequence-diagrams.md](008-financial-sequence-diagrams.md)
- [../320-events/001-event-overview.md](../320-events/001-event-overview.md)
