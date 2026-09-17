# Aggregates

## Purpose

Aggregates are consistency boundaries. Each aggregate has one root, accepts behavior through the root, and protects its own invariants. Cross-aggregate workflows use domain services and events.

## Aggregate Catalog

| Aggregate root | Main members | Key invariant |
| --- | --- | --- |
| Payment | attempts, provider references, refund requests | one idempotency key has one financial effect |
| Invoice | lines, tax lines, allocations, credit notes | allocated amount cannot exceed collectible amount |
| Journal Entry | lines, source reference, posting metadata | posted entry balances debits and credits |
| Wallet | holds, reservations, balance projection | available balance never falls below permitted limit |
| Settlement | lines, fees, taxes, reserves, approvals | net amount is reproducible from immutable lines |
| Payout | attempts, destination snapshot, provider response | only an approved payable amount can be executed |
| Reconciliation Session | statement lines, matches, exceptions | every imported line has a match or exception outcome |
| Tax Assessment | taxable components, rate evidence, jurisdiction | tax result references rule and effective period |
| Reward Liability | reward obligation lines, release/reversal history | liability changes only through sourced events |

## Consistency Rules

- Keep aggregates small enough to transact without loading an entire account history.
- Do not use a wallet balance as the accounting source of truth.
- Do not post a journal entry from a partially validated aggregate.
- Use optimistic versioning or an equivalent concurrency control on mutable roots.
- Store an append-only history for every root state transition.

## Transaction Boundary

The application transaction may atomically persist an aggregate change, its outbox event, and an idempotency record. External provider calls are outside the database transaction and must be reconciled through explicit attempt states.

## Related Documents

- [004-entities.md](004-entities.md)
- [011-invariants.md](011-invariants.md)
- [012-state-machines.md](012-state-machines.md)
