# Payout Processing

> **Document:** 12-financial-system/080-payouts-and-withdrawals/006-payout-processing.md

---

## Purpose

Payout processing submits an approved payable to an authorized provider or bank and records each attempt, response, fee, and resulting state.

## Processing Steps

1. confirm approved request and reserved amount;
2. recheck destination, compliance, limits, holds, and provider availability;
3. create an idempotent provider attempt;
4. submit using secured credentials and correlation IDs;
5. map provider response to pending, paid, failed, or unknown;
6. create wallet/subledger/GL effects according to policy; and
7. reconcile provider confirmation and statement evidence.

## Rules

Submission is not payment completion. A timeout requires provider lookup before retry. Processing cannot exceed the approved amount or release an unrelated reserve. Fees and currency conversion are separately recorded.

## Related Documents

- [000-index.md](000-index.md)
- [005-withdrawal-approval.md](005-withdrawal-approval.md)
- [007-payout-batches.md](007-payout-batches.md)
- [012-payout-retries.md](012-payout-retries.md)
