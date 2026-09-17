# AI Settings

> **Document:** 12-financial-system/390-configuration/020-ai-settings.md

---

## Purpose

AI settings define approved use case, model/prompt/rule version, data scope, risk tier, confidence/review threshold, human approval, tool permissions, country/entity restrictions, retention, monitoring, and retirement.

## Rules

AI may explain, forecast, detect, prioritize, classify, retrieve, summarize, and recommend. Settings cannot permit AI to directly post, approve, pay, alter balances, release/freeze funds, certify, close, make final fraud/compliance/legal decisions, or bypass controls. Tool calls are read-only or approval-gated and re-enter normal authorization.

## Change Control

Changes require model/data/security/privacy evaluation, accuracy/calibration/fairness/drift tests, human workflow review, auditability, incident/rollback plan, approval, effective version, and monitoring. Historical outputs retain settings used.

## Related Documents

- [000-index.md](000-index.md)
- [019-risk-settings.md](019-risk-settings.md)
- [021-feature-flags.md](021-feature-flags.md)
- [../330-ai-capabilities/019-ai-governance.md](../330-ai-capabilities/019-ai-governance.md)
