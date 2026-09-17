# Account Recommendation

> **Document:** 12-financial-system/330-ai-capabilities/004-account-recommendation.md

---

## Purpose

AI may recommend Chart of Accounts mappings for new transactions, recurring sources, fees, tax, vendor/partner allocations, reserves, and operational expenses.

## Output

Return candidate account/dimension, confidence, rationale, similar approved examples, chart version, effective date, entity/country, policy constraints, and whether human approval is mandatory.

## Controls

Recommendations cannot directly post, change a posted account, repurpose an account, bypass dimensions, or select an unrestricted account. Material, novel, cross-country, tax-sensitive, revenue, reserve, and low-confidence mappings require authorized review and separation of duties. Accepted mappings are versioned, effective-dated, and audited.

## Related Documents

- [000-index.md](000-index.md)
- [003-transaction-classification.md](003-transaction-classification.md)
- [018-human-approval.md](018-human-approval.md)
- [../300-data-model/002-financial-accounts-schema.md](../300-data-model/002-financial-accounts-schema.md)
