# Sanctions Screening

> **Document:** 12-financial-system/260-compliance-and-governance/013-sanctions-screening.md

---

## Purpose

Sanctions screening identifies restricted parties, countries, vessels, entities, destinations, and transactions before or during permitted financial activity.

## Rules

Screening scope, source/list version, timestamp, subject, country, match quality, reviewer, decision, escalation, false-positive resolution, and retention are recorded. Potential match is not confirmed violation; release requires authorized review. Screening can block or hold payment, payout, transfer, wallet, settlement, or fund activity.

## Lifecycle

```text
Submitted -> Screened -> Clear | Potential Match -> Reviewed -> Released | Restricted | Reported
```

Every decision retains list/version, evidence, reviewer, reason, effective time, affected operation, and audit reference.

## Related Documents

- [000-index.md](000-index.md)
- [011-aml-controls.md](011-aml-controls.md)
- [012-kyc-financial-controls.md](012-kyc-financial-controls.md)
- [015-separation-of-duties.md](015-separation-of-duties.md)
