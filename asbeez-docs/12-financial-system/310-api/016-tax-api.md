# Tax API

> **Document:** 12-financial-system/310-api/016-tax-api.md

---

## Purpose

The Tax API exposes jurisdiction, registration, classification, calculation, exemption, withholding, filing, remittance, and tax-reconciliation operations.

## Queries

Retrieve tax decision, jurisdiction, registration, tax code, taxable base, rate, tax amount, exemption, withholding, calculation version, provider evidence, filing, and remittance status.

## Commands

Request tax calculation, validate exemption, record registration, approve adjustment, create filing/remittance package, or resolve tax exception. Commands require effective policy, address/classification inputs, entity/country scope, currency, authorization, and idempotency.

## Rules

Tax collected or withheld is not revenue. Historical decisions retain input snapshots and cannot be overwritten. API results identify estimate versus authoritative calculation, provider evidence versus approved decision, rounding, and ledger/payable/receivable mapping.

## Related Documents

- [000-index.md](000-index.md)
- [013-invoice-api.md](013-invoice-api.md)
- [014-refund-api.md](014-refund-api.md)
- [../300-data-model/011-tax-schema.md](../300-data-model/011-tax-schema.md)
- [../160-taxes/001-overview.md](../160-taxes/001-overview.md)
