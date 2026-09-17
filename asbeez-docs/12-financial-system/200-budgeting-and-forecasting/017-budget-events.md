# Budget Events

> **Document:** 12-financial-system/200-budgeting-and-forecasting/017-budget-events.md

---

## Purpose

Budget events are immutable facts for cycle, plan, forecast, scenario, assumption, allocation, approval, revision, publication, variance, and reporting workflows.

## Event Catalog

- BudgetCycleOpened, BudgetDraftCreated, BudgetSubmitted, BudgetReviewed, BudgetApproved, BudgetPublished;
- ForecastCreated, ForecastUpdated, ScenarioCreated, AssumptionPublished;
- BudgetAllocated, BudgetRevisionRequested, BudgetRevisionApproved, BudgetRevisionPublished;
- VarianceDetected, VarianceAcknowledged, VarianceActionAssigned;
- BudgetClosed, ForecastReportPublished, BudgetExceptionOpened/Resolved; and
- BudgetActualsRefreshed.

## Contract

Events include ID/version, plan/forecast/scenario, entity/country/currency, account/dimensions, period, amount, assumptions, model/policy version, owner/approver, occurred/effective time, actor/system, correlation, causation, and idempotency.

## Rules

Consumers are idempotent. Budget events do not post the GL, change actuals, authorize spending, release reserves, or execute transfers.

## Related Documents

- [000-index.md](000-index.md)
- [003-budget-cycles.md](003-budget-cycles.md)
- [014-budget-revisions.md](014-budget-revisions.md)
- [015-forecast-reporting.md](015-forecast-reporting.md)
