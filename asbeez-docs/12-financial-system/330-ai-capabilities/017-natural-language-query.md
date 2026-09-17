# Natural Language Query

> **Document:** 12-financial-system/330-ai-capabilities/017-natural-language-query.md

---

## Purpose

Natural-language query translates authorized questions into bounded read-only queries over approved financial projections, reports, statements, and analytics.

## Controls

Resolve user, role, entity/country, period, currency, data classification, and permitted dataset before execution. Present interpreted filters, source, freshness, calculation, uncertainty, and generated query or explanation where appropriate. Ambiguity, unsupported joins, sensitive data, and excessive scope require clarification or refusal.

## Prohibited Actions

Natural-language query cannot mutate data, post journals, approve/pay/release funds, change mappings, certify reports, close periods, bypass authorization, or infer private information outside the user’s scope. Read results never become commands without a separately authorized workflow.

## Related Documents

- [000-index.md](000-index.md)
- [002-financial-copilot.md](002-financial-copilot.md)
- [003-authorization.md](../310-api/003-authorization.md)
- [019-ai-governance.md](019-ai-governance.md)
