# Payout Failures

> **Document:** 12-financial-system/080-payouts-and-withdrawals/013-payout-failures.md

---

## Purpose

Payout failures record why a payout did not complete and whether the approved source remains payable, held, reversed, or requires investigation.

## Failure Classes

- invalid or closed destination;
- provider rejection or bank return;
- compliance, sanctions, tax, or risk block;
- amount, currency, fee, or beneficiary mismatch;
- timeout or unknown provider result;
- duplicate/idempotency conflict; and
- insufficient available or reserved funding.

## Rules

A failed submission does not prove that no funds moved. Provider inquiry, bank evidence, wallet/subledger state, and GL clearing are reconciled before release or retry. Customer/member/vendor/partner communication uses safe status language and does not promise payment time.

## Related Documents

- [000-index.md](000-index.md)
- [012-payout-retries.md](012-payout-retries.md)
- [014-payout-reversals.md](014-payout-reversals.md)
- [015-payout-reconciliation.md](015-payout-reconciliation.md)
