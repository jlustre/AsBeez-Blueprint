# Payment Provider Strategy

> **Document:** 12-financial-system/400-strategy/005-payment-provider-strategy.md

---

## Purpose

Payment-provider strategy balances coverage, reliability, authorization/capture performance, cost, settlement, refunds/disputes, fraud, country/currency support, data, resilience, and portability.

## Provider Portfolio

Use canonical AsBeez payment contracts and adapters; select primary/fallback providers by country, currency, method, risk, capability, limits, fee, latency, settlement, legal, data, and recovery criteria. Avoid provider lock-in through versioned mappings, evidence retention, and exit tests.

## Decision Gates

Sandbox/contract/security/compliance tests, tokenization, idempotency, callback verification, failure/unknown handling, settlement/fee reconciliation, chargeback/refund support, reporting, SLOs, incident/DR, commercial terms, and country/entity approval precede production routing.

## Related Documents

- [000-index.md](000-index.md)
- [006-banking-strategy.md](006-banking-strategy.md)
- [010-risk-management-strategy.md](010-risk-management-strategy.md)
- [../340-integrations/002-payment-gateways.md](../340-integrations/002-payment-gateways.md)
