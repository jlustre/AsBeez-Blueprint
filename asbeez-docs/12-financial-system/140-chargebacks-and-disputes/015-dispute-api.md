# Dispute API

> **Document:** 12-financial-system/140-chargebacks-and-disputes/015-dispute-api.md

---

## Purpose

The Dispute API exposes authenticated case, evidence, deadline, outcome, reserve, liability, and reconciliation views without allowing clients to alter provider or accounting state directly.

## Read Operations

- retrieve dispute status, reason, amount, currency, deadlines, evidence status, and outcome;
- retrieve permitted payment/order/refund/vendor/partner references;
- retrieve reserve, hold, liability, fee, accounting, and reconciliation status; and
- retrieve customer/vendor/partner-safe case explanations.

## Commands

Open case, upload evidence, submit representment, respond to pre-arbitration, approve liability/settlement action, request review, and acknowledge outcome. Commands require authorization, idempotency, deadline validation, secure evidence handling, and audit correlation.

## Rules

Clients cannot mark a case won/lost, alter disputed amount, assign vendor/platform liability, release reserves, reverse payment, or create accounting effects through API fields.

## Related Documents

- [000-index.md](000-index.md)
- [004-dispute-evidence.md](004-dispute-evidence.md)
- [005-representment.md](005-representment.md)
- [016-dispute-events.md](016-dispute-events.md)
