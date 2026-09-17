# Payment Capture

> **Document:** 12-financial-system/070-payments/006-payment-capture.md

---

## Purpose

Capture records the provider’s acceptance of funds for an authorized AsBeez payment. It creates payment evidence and may trigger order allocation, but it does not by itself recognize revenue, vendor entitlement, rewards, or payout.

## Preconditions

Intent is valid, authorization is active, amount is within permitted scope, provider and currency match, fraud/compliance checks pass, and capture idempotency is available.

## Capture Data

Capture ID, payment/intent/attempt IDs, provider reference, captured amount, currency, fees if supplied, timestamp, order/invoice, country/entity, allocation status, and settlement expectation.

## Rules

- partial capture must declare remaining authorization behavior;
- duplicate capture requests return the original result;
- captured funds enter processor/cash clearing until provider settlement is reconciled;
- downstream order, tax, vendor, partner, and reward workflows consume the capture event separately; and
- a failed or uncertain capture is resolved through provider lookup and reconciliation.

## Related Documents

- [000-index.md](000-index.md)
- [005-payment-authorization.md](005-payment-authorization.md)
- [007-payment-settlement.md](007-payment-settlement.md)
- [021-payment-events.md](021-payment-events.md)
