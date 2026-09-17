# Tax API

> **Document:** 12-financial-system/160-taxes/018-tax-api.md

---

## Purpose

The Tax API exposes authenticated tax assessments, exemption, registration, filing, remittance, and reconciliation views without allowing clients to write tax amounts or authority status directly.

## Read Operations

- retrieve assessment, tax line, jurisdiction, rate, exemption, registration, filing, remittance, and reconciliation status;
- retrieve invoice/order/settlement references permitted to the caller; and
- retrieve tax-safe explanations and exception status.

## Commands

Request assessment, submit exemption/registration evidence, approve review, submit filing/remittance, amend assessment, and resolve exception. Commands require authorization, idempotency, effective policy, server-side calculation, and audit correlation.

## Rules

Clients cannot supply final tax, bypass jurisdiction or exemption validation, mark remittance complete, alter historical assessment, or classify tax as AsBeez revenue or reward value through API fields.

## Related Documents

- [000-index.md](000-index.md)
- [011-tax-calculation.md](011-tax-calculation.md)
- [013-tax-invoices.md](013-tax-invoices.md)
- [019-tax-events.md](019-tax-events.md)
