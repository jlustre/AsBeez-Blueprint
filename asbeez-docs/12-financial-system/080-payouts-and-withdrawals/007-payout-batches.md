# Payout Batches

> **Document:** 12-financial-system/080-payouts-and-withdrawals/007-payout-batches.md

---

## Purpose

A payout batch groups independently approved payouts for operational submission, provider limits, bank processing, and reconciliation. Each payout retains its own identity, amount, destination, and outcome.

## Batch Data

Batch ID, provider, country/entity, currency, payout count, expected gross/fee/net totals, cutoff, preparer, approver, submission time, provider batch reference, and status.

## Rules

- only validated and approved payouts enter a batch;
- batch totals are calculated and checked before submission;
- one payout failure does not conceal other outcomes;
- retries reuse payout idempotency and create attempts, not duplicate obligations; and
- partial provider acceptance is recorded per payout and reconciled.

## Related Documents

- [000-index.md](000-index.md)
- [006-payout-processing.md](006-payout-processing.md)
- [012-payout-retries.md](012-payout-retries.md)
- [015-payout-reconciliation.md](015-payout-reconciliation.md)
