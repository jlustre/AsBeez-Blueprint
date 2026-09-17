# Withdrawal Requests

> **Document:** 12-financial-system/080-payouts-and-withdrawals/003-withdrawal-requests.md

---

## Purpose

A withdrawal request asks to convert or transfer an approved monetary balance or payable obligation to an authorized destination. It does not create eligibility or convert reward units by itself.

## Required Data

Request ID, requester/member/vendor/partner, source wallet or settlement, amount and currency, reward/commission source where applicable, destination, country/entity, tax status, fees, reason, idempotency key, and policy versions.

## Rules

- source must be monetary and approved for withdrawal;
- RP, ABC, and AHC require an approved conversion event before request;
- requested amount cannot exceed available/approved amount after fees, tax, holds, reserves, and limits;
- destination is verified before approval; and
- duplicate requests return the original decision.

## States

```text
Draft -> Submitted -> Validating -> Approved -> Processing -> Paid
Submitted -> Rejected | Cancelled | Held
```

## Related Documents

- [000-index.md](000-index.md)
- [004-withdrawal-validation.md](004-withdrawal-validation.md)
- [005-withdrawal-approval.md](005-withdrawal-approval.md)
- [018-payout-api.md](018-payout-api.md)
