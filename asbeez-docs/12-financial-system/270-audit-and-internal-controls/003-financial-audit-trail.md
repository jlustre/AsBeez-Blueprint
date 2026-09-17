# Financial Audit Trail

> **Document:** 12-financial-system/270-audit-and-internal-controls/003-financial-audit-trail.md

---

## Purpose

The financial audit trail links source business activity, commands, decisions, policies, calculations, approvals, ledger entries, subledgers, reports, controls, and corrections.

## Required Fields

Record ID, source context, actor/system, action, before/after state where permitted, amount/unit/currency, entity/country, policy/rule/model version, correlation/causation, timestamp, effective/posting period, approval, evidence reference, integrity metadata, and access history.

## AsBeez Trace Path

```text
Order/Activity -> Payment/Reward/Settlement/Tax Event -> Journal/Subledger
-> Reconciliation -> Report/Payout/Wallet -> Control/Audit Decision
```

## Rules

Audit entries are append-only, privacy-aware, tamper-evident, searchable by authorized users, and retained under applicable schedule/legal hold.

## Related Documents

- [000-index.md](000-index.md)
- [002-audit-domain-model.md](002-audit-domain-model.md)
- [014-audit-evidence.md](014-audit-evidence.md)
- [018-audit-reporting.md](018-audit-reporting.md)
