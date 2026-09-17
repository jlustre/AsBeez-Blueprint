# Webhooks

> **Document:** 12-financial-system/340-integrations/014-webhooks.md

---

## Purpose

Webhook integrations receive or deliver event notifications between AsBeez and approved providers, partners, banking systems, payment gateways, payout providers, tax services, and internal consumers.

## Contract

Each message includes event ID/type/version, resource and aggregate reference, source, occurred/received time, entity/country/currency, correlation/causation, sequence where applicable, signature metadata, payload hash, and provider reference. Raw callback and normalized event are stored separately.

## Reliability and Security

Verify signatures, timestamps, certificates, replay protection, endpoint identity, schema/version, and source scope. Use idempotency, deduplication, timeout, retry/backoff, ordering policy, dead-letter queues, rate limits, and observability. Do not trust callback delivery as proof of payment, payout, settlement, or accounting completion.

## Related Documents

- [000-index.md](000-index.md)
- [015-integration-security.md](015-integration-security.md)
- [016-integration-monitoring.md](016-integration-monitoring.md)
- [../320-events/002-event-contracts.md](../320-events/002-event-contracts.md)
