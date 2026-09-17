# Payment Methods

> **Document:** 12-financial-system/070-payments/003-payment-methods.md

---

## Purpose

Payment methods describe how a customer funds an AsBeez order or approved financial operation. A method is represented by a secure provider token/reference, not raw credentials.

## Method Families

- cards and network tokens;
- bank transfer and local bank rails;
- approved digital wallets;
- cash or offline collection where supported; and
- provider-specific regional methods.

## Required Data

Method type, provider, token/reference, country, currency support, customer ownership/verification, expiry or status, risk metadata, and consent. Sensitive payment data is tokenized and access-controlled.

## Rules

Availability is determined by country, currency, customer, order, provider, risk, and legal policy. A stored method cannot be used for a different customer or entity without authorization. Method selection does not guarantee authorization or capture.

## Related Documents

- [000-index.md](000-index.md)
- [004-payment-intents.md](004-payment-intents.md)
- [016-payment-provider-integration.md](016-payment-provider-integration.md)
- [019-payment-security.md](019-payment-security.md)
