# Payment Authorization

> **Document:** 12-financial-system/070-payments/005-payment-authorization.md

---

## Purpose

Authorization records a provider’s approval or decline for a payment intent under a permitted amount, method, currency, customer, country, and risk context.

## Authorization Data

Attempt ID, intent ID, provider, provider reference, authorized amount, currency, expiry, method reference, response code, customer action requirement, risk result, and timestamps.

## Rules

Authorization reserves or approves provider capacity; it does not move settled funds or create AsBeez revenue. Authorization may be captured only within amount, time, and provider rules. A decline, expiry, or void remains auditable and cannot be treated as a successful order or reward source.

## Security

Step-up authentication, fraud screening, sanctions/identity requirements, and idempotency apply before and during authorization. Provider response data is mapped through a versioned status contract.

## Related Documents

- [000-index.md](000-index.md)
- [002-payment-domain-model.md](002-payment-domain-model.md)
- [006-payment-capture.md](006-payment-capture.md)
- [019-payment-security.md](019-payment-security.md)
