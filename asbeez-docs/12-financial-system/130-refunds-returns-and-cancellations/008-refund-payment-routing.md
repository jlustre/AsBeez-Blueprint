# Refund Payment Routing

> **Document:** 12-financial-system/130-refunds-returns-and-cancellations/008-refund-payment-routing.md

---

## Purpose

Refund payment routing selects the approved destination for returning customer value: original payment method, bank transfer, external provider, approved monetary wallet, credit note, or another lawful method.

## Routing Inputs

Original payment/provider, captured amount, refund amount, customer ownership, country, currency, entity, provider capability, wallet type, tax/credit-note policy, compliance, fraud, and destination availability.

## Rules

- original method is preferred where policy and provider support require it;
- alternate destination requires customer authorization, ownership verification, country and compliance checks;
- RP, ABC, and AHC cannot be routed as cash without approved conversion;
- routing does not change refund amount or downstream vendor/reward effects; and
- provider submission, wallet credit, and credit-note issuance remain separate execution states.

## Related Documents

- [000-index.md](000-index.md)
- [004-full-refunds.md](004-full-refunds.md)
- [009-wallet-refunds.md](009-wallet-refunds.md)
- [013-refund-reconciliation.md](013-refund-reconciliation.md)
