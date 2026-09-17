# Payout API

> **Document:** 12-financial-system/080-payouts-and-withdrawals/018-payout-api.md

---

## Purpose

The Payout API exposes authenticated payout views and commands without allowing clients to write payable balances or provider state directly.

## Read Operations

- retrieve eligible monetary balance or payable status;
- retrieve withdrawal, payout, hold, fee, tax, destination, and reconciliation status;
- retrieve safe failure/review reasons and statements; and
- retrieve reward quantities separately from payoutable monetary value.

## Commands

Create/cancel withdrawal, validate, submit for approval, approve/reject, select or verify destination, request retry, and acknowledge payout result where permitted. Commands require idempotency, authorization, server-side amount calculation, policy validation, and audit correlation.

## Rules

Clients cannot supply balances, bypass holds/compliance/limits, convert RP/ABC/AHC by changing a field, select arbitrary account mappings, or mark a payout paid. Responses distinguish requested, validated, approved, submitted, pending, paid, failed, held, reversed, and unknown.

## Related Documents

- [000-index.md](000-index.md)
- [003-withdrawal-requests.md](003-withdrawal-requests.md)
- [004-withdrawal-validation.md](004-withdrawal-validation.md)
- [017-payout-security.md](017-payout-security.md)
