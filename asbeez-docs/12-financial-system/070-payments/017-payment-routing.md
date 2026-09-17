# Payment Routing

> **Document:** 12-financial-system/070-payments/017-payment-routing.md

---

## Purpose

Payment routing selects an approved provider and method based on country, currency, entity, product/order type, availability, cost, risk, capability, and resilience policy.

## Routing Inputs

Country/jurisdiction, currency, legal entity, order amount/type, vendor or marketplace context, customer method, provider health, risk/compliance result, settlement capability, fees, and fallback rules.

## Rules

- routing cannot bypass country, sanctions, risk, or method restrictions;
- provider choice and reason are recorded for audit and reconciliation;
- fallback creates a new attempt while preserving the original intent;
- routing never changes order price, tax, vendor allocation, or reward qualification; and
- provider concentration, failure rate, settlement delay, and cost are monitored.

## Related Documents

- [000-index.md](000-index.md)
- [003-payment-methods.md](003-payment-methods.md)
- [016-payment-provider-integration.md](016-payment-provider-integration.md)
- [019-payment-security.md](019-payment-security.md)
