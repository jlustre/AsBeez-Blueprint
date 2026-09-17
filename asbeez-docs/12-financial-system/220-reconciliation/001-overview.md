# Overview

> **Document:** 12-financial-system/220-reconciliation/001-overview.md

---

## Purpose

Reconciliation proves that AsBeez financial records are complete, accurate, attributed, timely, authorized, and consistent across General Ledger, subledgers, source domains, external providers, and reports.

## AsBeez Boundary

Reconciliation does not edit source history or force totals to match. It identifies matched facts, timing differences, missing/duplicate records, classification errors, provider differences, and owned exceptions for controlled resolution.

## Principles

- reconcile both monetary amounts and non-monetary populations such as RP, ABC, AHC, orders, cases, and reward events;
- preserve source, entity, country, currency, policy, account, and attribution context;
- a balanced amount does not prove correct vendor, partner, member, reward, tax, or country attribution;
- every exception has owner, age, evidence, severity, action, and resolution; and
- corrections use source fixes, compensating entries, or approved adjustments, never destructive edits.

## Related Documents

- [000-index.md](000-index.md)
- [002-reconciliation-domain-model.md](002-reconciliation-domain-model.md)
- [013-reconciliation-rules.md](013-reconciliation-rules.md)
- [014-exceptions.md](014-exceptions.md)
