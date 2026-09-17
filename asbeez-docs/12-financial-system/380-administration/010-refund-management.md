# Refund Management

> **Document:** 12-financial-system/380-administration/010-refund-management.md

---

## Purpose

Refund administration manages eligibility, approvals, full/partial requests, provider status, returns/cancellations, tax/fee/reward/vendor/partner effects, and exceptions.

## Permitted Actions

Review refundable value and prior refunds, approve within authority, cancel before submission, query uncertain provider state, request retry/compensation, communicate, and reconcile.

## Rules

Refunds cannot exceed refundable amount or delete the original transaction/journal. Administrators cannot alter tax, fee, reward, allocation, reserve, or revenue treatment directly. Every action is idempotent, authorized, linked to source/correlation, and followed through reconciliation.

## Related Documents

- [000-index.md](000-index.md)
- [007-payment-management.md](007-payment-management.md)
- [011-dispute-management.md](011-dispute-management.md)
- [../300-data-model/009-refund-schema.md](../300-data-model/009-refund-schema.md)
