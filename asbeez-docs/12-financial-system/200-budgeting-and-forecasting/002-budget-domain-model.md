# Budget Domain Model

> **Document:** 12-financial-system/200-budgeting-and-forecasting/002-budget-domain-model.md

---

## Purpose

The Budget domain models plans, budgets, forecasts, assumptions, scenarios, allocations, approvals, revisions, actuals, variances, and reporting dimensions.

## Entities

| Entity | Responsibility |
| --- | --- |
| Budget | approved financial plan for scope and period |
| Forecast | forward-looking estimate with confidence and assumptions |
| Scenario | alternate assumptions and modeled outcome |
| Budget Line | account, dimension, period, amount, and driver |
| Assumption | rate, volume, timing, policy, or business input |
| Allocation | distribution across country, department, product, channel, or program |
| Variance | difference between plan/forecast and actual or prior version |
| Approval | authority, decision, time, and evidence |

## Invariants

- every line has entity, country, currency, period, account/dimension, owner, and version;
- budgets cannot be posted as accounting entries or spent without separate controls;
- forecasts identify assumptions, confidence, source, and freshness;
- scenarios do not mutate actuals; and
- revisions preserve prior approved versions and variance history.

## Related Documents

- [000-index.md](000-index.md)
- [003-budget-cycles.md](003-budget-cycles.md)
- [011-scenario-planning.md](011-scenario-planning.md)
- [014-budget-revisions.md](014-budget-revisions.md)
