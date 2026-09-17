# Compliance Events

> **Document:** 12-financial-system/320-events/017-compliance-events.md

---

## Purpose

Compliance events communicate identity, business verification, sanctions, AML, source-of-funds, tax, country gate, hold, review, escalation, approval, and case outcomes.

## Event Catalog

`KYCRequested`, `KYCCompleted`, `KYBRequested`, `KYBCompleted`, `SanctionsScreeningCompleted`, `SourceOfFundsRequested`, `ComplianceHoldPlaced`, `ComplianceHoldReleased`, `ComplianceReviewOpened`, `ComplianceReviewEscalated`, and `ComplianceCaseClosed`.

## Payload and Rules

Events include subject/case, check type, jurisdiction/country, provider/reference, result class, risk tier, policy/version, decision authority, expiry/review time, reason code, and correlation. Sensitive evidence is minimized, encrypted, access-controlled, and never exposed to unauthorized consumers. A compliance event may gate a financial command but does not itself post accounting.

## Related Documents

- [000-index.md](000-index.md)
- [003-account-events.md](003-account-events.md)
- [018-security-events.md](018-security-events.md)
- [../300-data-model/017-audit-schema.md](../300-data-model/017-audit-schema.md)
