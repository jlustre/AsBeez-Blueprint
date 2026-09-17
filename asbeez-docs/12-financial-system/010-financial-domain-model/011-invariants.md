# Invariants

## Purpose

Invariants are conditions that must remain true regardless of workflow, retry, provider behavior, or deployment topology. Violations block the operation and create an alert or exception.

## Accounting Invariants

- Every posted journal entry has total debits equal to total credits.
- Posted entries, source amounts, and audit evidence are immutable.
- Every adjustment references the fact it corrects and uses a compensating entry.
- Each financial effect has one source reference and one idempotency scope.
- An accounting period cannot accept ordinary posting after close.

## Balance and Settlement Invariants

- Wallet projections are derived from ledger-backed credits, debits, holds, and reservations.
- Available balance cannot exceed ledger-supported balance.
- A hold or reservation cannot be released more than once.
- Settlement net equals gross less fees, tax, reserves, holds, and adjustments using recorded rounding.
- Payout execution cannot exceed an approved settlement obligation.

## Currency and Compliance Invariants

- Every monetary amount has one explicit currency and scale.
- Cross-currency operations record source amount, rate, target amount, and rate source.
- A transaction is blocked when required jurisdiction, tax, identity, or sanctions facts are absent.
- Reward liabilities cannot be created from unqualified, duplicated, reversed, or ineligible activity.

## Failure Handling

An invariant failure is a typed domain error containing the violated rule, aggregate, source reference, and remediation path. It must not be converted into a successful zero-value result.

## Related Documents

- [003-aggregates.md](003-aggregates.md)
- [005-value-objects.md](005-value-objects.md)
- [012-state-machines.md](012-state-machines.md)
