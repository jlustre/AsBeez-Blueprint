# Future Roadmap

> **Document:** 12-financial-system/070-payments/023-future-roadmap.md

---

## Near Term

- define launch countries, currencies, entities, methods, and providers;
- implement intent, authorization, capture, refund, dispute, and settlement lifecycles;
- connect payment provider subledger, customer/order, tax, vendor/partner, reward, wallet, and GL mappings;
- establish idempotency, webhook verification, reconciliation, and exception operations; and
- implement security, API, event, and audit controls.

## Medium Term

- add regional payment methods and resilient provider routing;
- support partial, split, offline, and bank payment workflows;
- automate provider settlement, refund, dispute, and fee reconciliation;
- improve fraud and failure detection; and
- publish member, customer, vendor, and operations payment views.

## Long Term

- support multi-entity regional payment orchestration;
- provide explainable AI-assisted routing and reconciliation;
- improve payment cost, settlement, and liquidity forecasting; and
- expose governed payment capabilities to approved partners.

## Roadmap Gate

No payment feature may trigger order completion, reward qualification, vendor/partner settlement, revenue, wallet credit, or payout without a validated state, source evidence, policy approval, and reconciliation path.

## Related Documents

- [000-index.md](000-index.md)
- [018-payment-reconciliation.md](018-payment-reconciliation.md)
- [019-payment-security.md](019-payment-security.md)
