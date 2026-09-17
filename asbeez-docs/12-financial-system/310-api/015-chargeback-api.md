# Chargeback API

> **Document:** 12-financial-system/310-api/015-chargeback-api.md

---

## Purpose

The Chargeback API exposes dispute cases, deadlines, evidence, representment, liability decisions, reserve state, and reconciliation status.

## Queries

Retrieve case, payment/order, provider reason, amount/currency, stage, response deadline, evidence checklist, reserve, liability, fee, outcome, and audit status within authorized scope.

## Commands

Open or acknowledge case, upload evidence, submit representment, request review, accept liability, dispute an outcome, or resolve an exception. Commands require case authority, deadline validation, idempotency, evidence integrity, and separation of duties.

## Rules

Provider case state is evidence until mapped to an approved accounting outcome. Chargeback effects link payment reversal, reserves, fees, vendor/partner/customer liability, recovery, loss, tax, and ledger journals. Evidence cannot be deleted or silently replaced.

## Related Documents

- [000-index.md](000-index.md)
- [011-payment-api.md](011-payment-api.md)
- [018-reserve-api.md](018-reserve-api.md)
- [../300-data-model/010-chargeback-schema.md](../300-data-model/010-chargeback-schema.md)
- [../140-chargebacks-and-disputes/001-overview.md](../140-chargebacks-and-disputes/001-overview.md)
