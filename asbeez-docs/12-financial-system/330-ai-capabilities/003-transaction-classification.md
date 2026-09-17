# Transaction Classification

> **Document:** 12-financial-system/330-ai-capabilities/003-transaction-classification.md

---

## Purpose

AI may classify transactions, descriptions, merchants, products, fees, tax candidates, and source records to improve routing, review, reconciliation, and reporting.

## Output

Return candidate category/account/tax/merchant, confidence, alternatives, rationale, source features, model/rule version, effective date, country/entity scope, and required human review. Classification is a recommendation until accepted by an authorized process.

## Controls

Do not alter posted journals, historical tax decisions, balances, revenue recognition, vendor/partner allocation, or account meaning automatically. Low confidence, novel patterns, cross-country ambiguity, material amounts, and policy conflicts route to review. Accepted classifications retain actor, approval, model output, and audit evidence.

## Related Documents

- [000-index.md](000-index.md)
- [004-account-recommendation.md](004-account-recommendation.md)
- [006-anomaly-detection.md](006-anomaly-detection.md)
- [../300-data-model/002-financial-accounts-schema.md](../300-data-model/002-financial-accounts-schema.md)
