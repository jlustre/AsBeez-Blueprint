# Transaction Risk

> **Document:** 12-financial-system/250-fraud-risk-and-controls/003-transaction-risk.md

---

## Purpose

Transaction risk evaluates an order, payment, refund, payout, transfer, wallet movement, reward event, settlement, or tax operation for unusual, unauthorized, prohibited, or high-exposure behavior.

## Signals

Amount, velocity, device/session, identity, location, currency, payment method, provider, destination, order/vendor/partner relationship, refund/chargeback history, reward patterns, sanctions, and policy context.

## Controls

Allow, authenticate, limit, hold, review, reject, freeze, or escalate. Control decisions carry reason code, evidence, score/confidence, rule/model version, actor/system, expiry, and appeal/release path.

## Rules

A risk decision does not edit transaction history, create accounting, determine liability, or prove fraud. Customer and participant rights, privacy, and false-positive review are mandatory.

## Related Documents

- [000-index.md](000-index.md)
- [014-risk-scoring.md](014-risk-scoring.md)
- [015-transaction-monitoring.md](015-transaction-monitoring.md)
- [016-holds-and-freezes.md](016-holds-and-freezes.md)
