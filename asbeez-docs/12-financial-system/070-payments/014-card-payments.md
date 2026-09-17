# Card Payments

> **Document:** 12-financial-system/070-payments/014-card-payments.md

---

## Purpose

Card payments use tokenized card or network references for customer funding while preserving authorization, capture, 3-D Secure or equivalent authentication, fees, refunds, disputes, and provider settlement evidence.

## Rules

- raw PAN, security codes, and sensitive authentication data are not stored;
- authorization, capture, refund, and chargeback states remain separate;
- card fees and provider settlement differences are recorded separately;
- failed or disputed card payments do not qualify as completed commerce without policy approval; and
- chargebacks propagate to customer, vendor, partner, reward, reserve, and payout workflows.

## Authentication and Disputes

3-D Secure or equivalent authentication is recorded with the authorization attempt where applicable. Dispute evidence, liability shift, issuer reason, customer communication, and final outcome are retained in the payment and reconciliation records.

## Related Documents

- [000-index.md](000-index.md)
- [003-payment-methods.md](003-payment-methods.md)
- [005-payment-authorization.md](005-payment-authorization.md)
- [019-payment-security.md](019-payment-security.md)
