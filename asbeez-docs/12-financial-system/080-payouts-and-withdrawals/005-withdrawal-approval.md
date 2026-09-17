# Withdrawal Approval

> **Document:** 12-financial-system/080-payouts-and-withdrawals/005-withdrawal-approval.md

---

## Purpose

Withdrawal approval authorizes an already validated payout request for provider submission or controlled batch processing.

## Approval Requirements

Approval considers amount, source obligation, member/vendor/partner status, country, currency, destination, fees, tax, reserves, holds, risk, compliance, and exception history.

## Separation of Duties

The requester, validator, approver, payout operator, and reconciler are separated according to amount and risk. Manual overrides require reason, evidence, elevated permission, expiry, and later review.

## Rules

Approval does not change the source balance or prove payment. It creates an approved payable reservation that can be cancelled or rejected before submission. Any material change to amount, destination, currency, or source requires revalidation and approval.

## Related Documents

- [000-index.md](000-index.md)
- [004-withdrawal-validation.md](004-withdrawal-validation.md)
- [006-payout-processing.md](006-payout-processing.md)
- [017-payout-security.md](017-payout-security.md)
