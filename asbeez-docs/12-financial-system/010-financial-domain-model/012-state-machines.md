# State Machines

## Purpose

State machines make permitted financial transitions explicit. A transition requires a command, validated facts, actor or system identity, timestamp, and reason; invalid transitions are rejected.

## Payment

```text
Initiated -> Authorized -> Captured -> Partially Refunded -> Refunded
Initiated -> Failed
Authorized -> Voided
Captured -> Disputed -> Dispute Won | Dispute Lost
```

## Invoice

```text
Draft -> Issued -> Partially Paid -> Paid
Issued -> Cancelled | Void | Uncollectible
```

## Journal Entry

```text
Prepared -> Approved -> Posted -> Reversed
Prepared -> Rejected
```

## Settlement and Payout

```text
Settlement: Calculated -> Reviewed -> Approved -> Processing -> Settled
Settlement: Calculated -> Rejected | Cancelled
Payout: Requested -> Approved -> Submitted -> Paid
Payout: Requested -> Rejected | Cancelled
Submitted -> Failed -> Retrying | Failed
```

## Wallet Hold

```text
Placed -> Partially Released -> Released
Placed -> Expired
```

## Rules

- Terminal states cannot transition without an explicit correction workflow.
- Provider status is mapped through a versioned translation, never copied blindly into domain state.
- Retries create attempts, not duplicate payouts or ledger effects.
- State transitions and their events are persisted atomically with an outbox record.

## Related Documents

- [003-aggregates.md](003-aggregates.md)
- [010-domain-events.md](010-domain-events.md)
