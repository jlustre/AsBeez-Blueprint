# KYC AML Providers

> **Document:** 12-financial-system/340-integrations/011-kyc-aml-providers.md

---

## Purpose

KYC/AML-provider integrations support identity/business verification, sanctions and PEP screening, source-of-funds, adverse media, transaction monitoring, case evidence, and regulatory workflow assistance.

## Adapter Contract

Map subject/entity, jurisdiction, check type, provider case/reference, request and evidence status, result class, confidence, policy/version, expiry/re-screen date, consent/legal basis, and review outcome. Keep raw evidence, normalized result, and AsBeez decision distinct.

## Rules

Provider results are evidence and may trigger a hold or review under policy; they are not an automatic final legal/compliance decision unless a documented deterministic control applies. Sensitive identity and AML data is minimized, encrypted, access-controlled, retained by jurisdiction, and never exposed to unauthorized consumers.

## Related Documents

- [000-index.md](000-index.md)
- [010-fraud-providers.md](010-fraud-providers.md)
- [015-integration-security.md](015-integration-security.md)
- [../260-compliance-and-governance/012-kyc-financial-controls.md](../260-compliance-and-governance/012-kyc-financial-controls.md)
