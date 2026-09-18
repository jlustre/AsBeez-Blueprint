# Refund Operations

## Purpose

Refund operations manage requests, eligibility, approvals, full/partial processing, provider status, returns/cancellations, tax/fee/reward/vendor/partner effects, customer communication, exceptions, and reconciliation.

## Procedure

Validate order/payment/invoice, requester, reason, refundable amount, prior refunds, tax/fees, entitlements, rewards, reserves, risk, country, currency, and authority. Submit idempotent provider command; monitor pending/unknown; query or reconcile before retry; create approved compensating effects; communicate and close.

## Rules

Refunds cannot exceed refundable value or delete original history. Provider response is evidence until mapped/reconciled. Operators cannot alter accounting, tax, reward, fee, vendor/partner, reserve, or wallet effects directly. Fraud, dispute, legal, privacy, and material cases escalate.

## Evidence

Retain request, eligibility calculation, approval, provider reference/status, idempotency, source order/payment, tax/fee/reward/entitlement treatment, ledger/reconciliation references, communication, error, and resolution.

## Related Documents

- [index.md](index.md)
- [002-customer-support.md](002-customer-support.md)
- [005-fraud-operations.md](005-fraud-operations.md)
- [../12-financial-system/370-operations/006-refund-operations.md](../12-financial-system/370-operations/006-refund-operations.md)
