# Invoice AI Capabilities

> **Document:** 12-financial-system/090-invoicing/019-invoice-ai-capabilities.md

---

## Purpose

AI may assist invoice operations with classification, line extraction, tax anomaly detection, delivery support, payment matching, and collection forecasting while deterministic invoice, tax, accounting, and compliance rules remain authoritative.

## Permitted Assistance

- suggest line classification and account mapping;
- identify duplicate, inconsistent, or unusual invoices;
- propose payment allocations and reconciliation matches;
- explain invoice status and missing information; and
- forecast billing, collection, tax, and overdue patterns.

## Prohibited Actions

AI must not issue or alter an invoice, assign a legal number, calculate final tax without deterministic policy, mark payment paid, create a credit/debit note, bypass compliance, or represent rewards as cash or income.

## Governance

Recommendations include model/version, evidence scope, confidence, reason, provenance, policy context, and human approval where material. Customer, tax, payment, and identity data is minimized and access-controlled.

## Related Documents

- [000-index.md](000-index.md)
- [016-invoice-compliance.md](016-invoice-compliance.md)
- [017-invoice-api.md](017-invoice-api.md)
- [018-invoice-events.md](018-invoice-events.md)
