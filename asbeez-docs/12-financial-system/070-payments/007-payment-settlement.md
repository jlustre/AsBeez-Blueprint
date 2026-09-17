# Payment Settlement

> **Document:** 12-financial-system/070-payments/007-payment-settlement.md

---

## Purpose

Payment settlement records provider movement of captured funds into an AsBeez bank, processor balance, or other approved destination. It is distinct from vendor/order settlement and revenue recognition.

## Required Data

Provider settlement ID, provider account, captured payment references, gross amount, provider fee, net amount, currency, settlement date, bank/processor destination, country/entity, statement evidence, and reconciliation status.

## Rules

- provider settlement is external evidence and must be matched to captures;
- fees are separately identified from customer, tax, vendor, partner, and reward amounts;
- unmatched or short/over settlement becomes an owned exception;
- settlement does not automatically authorize vendor payout; and
- currency conversion records source/target amounts, rate, source, timestamp, and rounding.

## Related Documents

- [000-index.md](000-index.md)
- [006-payment-capture.md](006-payment-capture.md)
- [016-payment-provider-integration.md](016-payment-provider-integration.md)
- [018-payment-reconciliation.md](018-payment-reconciliation.md)
