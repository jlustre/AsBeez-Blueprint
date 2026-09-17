# Refund API

> **Document:** 12-financial-system/130-refunds-returns-and-cancellations/015-refund-api.md

---

## Purpose

The Refund API exposes authenticated refund, return, cancellation, eligibility, execution, and status workflows without allowing clients to write balances or bypass policy.

## Read Operations

- retrieve refund/return/cancellation status, reasons, line scope, amount, tax, fee, payment route, credit note, and downstream effects;
- retrieve customer-safe execution and reconciliation status; and
- retrieve reward, vendor, partner, wallet, and payout impact where authorized.

## Commands

Request refund/return/cancellation, submit evidence, approve/reject, select permitted destination, retry/query uncertain execution, and dispute decision. Commands require authorization, idempotency, server-side calculation, policy validation, and audit correlation.

## Rules

Clients cannot set final refund amount, bypass eligibility/fraud/compliance, mark provider execution complete, erase original events, reverse rewards directly, or alter vendor/partner/GL mappings.

## Related Documents

- [000-index.md](000-index.md)
- [002-refund-domain-model.md](002-refund-domain-model.md)
- [003-refund-eligibility.md](003-refund-eligibility.md)
- [016-refund-events.md](016-refund-events.md)
