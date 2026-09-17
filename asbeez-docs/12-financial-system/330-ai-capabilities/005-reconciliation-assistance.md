# Reconciliation Assistance

> **Document:** 12-financial-system/330-ai-capabilities/005-reconciliation-assistance.md

---

## Purpose

AI assists reconciliation by proposing matches, grouping differences, identifying timing patterns, summarizing evidence, prioritizing exceptions, and drafting resolution options.

## Output

Return candidate match keys, confidence, amount/currency tolerance, source snapshots, timing rationale, exception category, likely owner, proposed action, unresolved risk, and references to ledger, subledger, bank, provider, wallet, tax, reserve, vendor, partner, or country records.

## Controls

AI cannot mark a difference resolved, edit balances, certify a run, approve a write-off, or post an adjustment. Human reviewers validate evidence, policy, period, materiality, and segregation of duties. Accepted decisions record reviewer, rationale, model/version, and control-total impact.

## Related Documents

- [000-index.md](000-index.md)
- [006-anomaly-detection.md](006-anomaly-detection.md)
- [018-human-approval.md](018-human-approval.md)
- [../300-data-model/014-reconciliation-schema.md](../300-data-model/014-reconciliation-schema.md)
