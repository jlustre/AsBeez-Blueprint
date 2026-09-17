# Audit Assistance

> **Document:** 12-financial-system/330-ai-capabilities/014-audit-assistance.md

---

## Purpose

AI assists internal and external audit by retrieving evidence, mapping controls, summarizing populations, identifying exceptions, drafting requests, and tracing source-to-report lineage.

## Output

Return evidence IDs, source systems, period/entity/country, population and sampling basis, control mapping, completeness, timestamps, access authority, confidence, gaps, and human review status. Preserve original evidence and hashes where applicable.

## Controls

AI cannot certify controls, conclude audit opinions, alter evidence, close findings, suppress exceptions, or replace auditor judgment. Access follows least privilege, legal hold, privacy, retention, and segregation-of-duties rules. Prompts, outputs, reviewer decisions, and exports are logged where material.

## Related Documents

- [000-index.md](000-index.md)
- [012-financial-explanations.md](012-financial-explanations.md)
- [019-ai-governance.md](019-ai-governance.md)
- [../300-data-model/017-audit-schema.md](../300-data-model/017-audit-schema.md)
