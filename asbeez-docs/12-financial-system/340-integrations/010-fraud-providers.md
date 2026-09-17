# Fraud Providers

> **Document:** 12-financial-system/340-integrations/010-fraud-providers.md

---

## Purpose

Fraud-provider integrations provide risk signals, device/network intelligence, identity signals, transaction screening, case evidence, and decision-support data for payment, wallet, payout, refund, chargeback, vendor, partner, and account-risk workflows.

## Adapter Contract

Map request context, provider reference, score/range, reason codes, signals, model/version, decision class, timestamp, jurisdiction, data use, and response status. Preserve provider evidence separately from AsBeez risk decisions and outcomes.

## Rules

Provider scores are advisory evidence. AsBeez deterministic policies and authorized risk/compliance personnel decide holds, declines, reviews, releases, appeals, and case closure. Calls are consent/privacy aware, idempotent, rate-limited, timeout-safe, and audited. Provider uncertainty cannot silently approve a financial effect.

## Related Documents

- [000-index.md](000-index.md)
- [011-kyc-aml-providers.md](011-kyc-aml-providers.md)
- [016-integration-monitoring.md](016-integration-monitoring.md)
- [../250-fraud-risk-and-controls/022-risk-ai-capabilities.md](../250-fraud-risk-and-controls/022-risk-ai-capabilities.md)
