# Payment Settings

> **Document:** 12-financial-system/390-configuration/008-payment-settings.md

---

## Purpose

Payment settings define supported methods/providers, routing, authorization/capture behavior, retries, timeouts, limits, fees, settlement, risk, country/currency, and callback policy.

## Rules

Settings cannot alter customer-calculated amount, tax, allocation, revenue treatment, or posted history. Provider capability/status mappings are versioned and tested. Retry settings use provider idempotency and unknown-state reconciliation; route changes preserve source, fee, currency, country, and audit evidence.

## Change Control

Assess provider, fraud, compliance, performance, refund/dispute, settlement, ledger, and reconciliation impact. Require sandbox/contract tests, approval, effective date, staged rollout, monitoring, rollback, and expiry/review.

## Related Documents

- [000-index.md](000-index.md)
- [007-wallet-settings.md](007-wallet-settings.md)
- [009-payout-settings.md](009-payout-settings.md)
- [../340-integrations/002-payment-gateways.md](../340-integrations/002-payment-gateways.md)
