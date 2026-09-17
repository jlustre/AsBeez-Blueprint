# Vendor API

> **Document:** 12-financial-system/110-vendor-finance/016-vendor-api.md

---

## Purpose

The Vendor Finance API exposes authenticated vendor statements, earnings, settlement, payout, tax, reserve, and reconciliation views without allowing vendors to write financial balances directly.

## Read Operations

- retrieve earnings, fees, taxes, reserves, holds, refunds, chargebacks, settlement, payout, and statement status;
- retrieve order/line and policy references permitted to the vendor;
- retrieve destination, limits, compliance, and reconciliation status; and
- download certified or provisional statements with clear labels.

## Commands

Request payout, submit destination/tax details, acknowledge statement, dispute a line, provide chargeback/refund evidence, and request support review. Commands require authorization, idempotency, server-side calculations, policy checks, and audit correlation.

## Rules

Vendors cannot alter earnings, fees, taxes, reserves, settlement, payout status, account mappings, or reward values through API fields. Responses distinguish estimated, pending, held, approved, payable, paid, failed, reversed, and disputed.

## Related Documents

- [000-index.md](000-index.md)
- [002-vendor-financial-account.md](002-vendor-financial-account.md)
- [013-vendor-statements.md](013-vendor-statements.md)
- [014-vendor-reconciliation.md](014-vendor-reconciliation.md)
