# Payout Providers

> **Document:** 12-financial-system/340-integrations/004-payout-providers.md

---

## Purpose

Payout-provider integrations adapt approved withdrawals and disbursements to provider methods, batches, recipients, destinations, status callbacks, returns, fees, and settlement reports.

## Adapter Contract

Map payout ID, recipient token, amount/currency, entity/country, method, batch, provider reference, submission, processing, paid, failed, returned, and reversal states. Store request/response, callback, fee, timing, destination, capability, and reconciliation evidence.

## Rules

Provider credentials and destination data are tokenized and scoped. Payout submission requires AsBeez approval, balance/reserve, identity, sanctions, tax, risk, limits, country, currency, separation-of-duties, and idempotency controls. Provider paid status is evidence until reconciled; failures/returns use explicit compensating effects.

## Related Documents

- [000-index.md](000-index.md)
- [002-payment-gateways.md](002-payment-gateways.md)
- [015-integration-security.md](015-integration-security.md)
- [../080-payouts-and-withdrawals/001-overview.md](../080-payouts-and-withdrawals/001-overview.md)
