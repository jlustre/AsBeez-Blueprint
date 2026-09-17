# Digital Wallet Payments

> **Document:** 12-financial-system/070-payments/015-digital-wallet-payments.md

---

## Purpose

Digital wallet payments use an external wallet provider or an approved AsBeez monetary wallet as a payment method. The payment method’s provider, authorization, capture, and settlement states remain distinct from the member wallet balance model.

## Rules

- provider token/reference and customer consent are required;
- external wallet confirmation is not AsBeez ledger posting until reconciled;
- an AsBeez member wallet cannot pay an order unless its type, balance, holds, compliance, and transfer policy permit it;
- RP, ABC, and AHC display quantities are not payment funds unless approved conversion has occurred; and
- refunds return to an approved destination under policy, not necessarily the original method if legally or technically unavailable.

## Related Documents

- [000-index.md](000-index.md)
- [003-payment-methods.md](003-payment-methods.md)
- [016-payment-provider-integration.md](016-payment-provider-integration.md)
- [018-payment-reconciliation.md](018-payment-reconciliation.md)
