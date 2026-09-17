# Budget API

> **Document:** 12-financial-system/200-budgeting-and-forecasting/016-budget-api.md

---

## Purpose

The Budget API exposes authenticated budgets, forecasts, scenarios, assumptions, allocations, approvals, revisions, variances, and reports without allowing clients to alter actual accounting or execute cash movement.

## Read Operations

- retrieve plan, forecast, scenario, actual, commitment, variance, assumption, approval, and revision status;
- retrieve entity/country/currency/account/dimension scope and source freshness; and
- retrieve certified or provisional planning reports.

## Commands

Create draft, submit, approve/reject, publish, revise, run scenario, upload assumption, acknowledge variance, and request report. Commands require authorization, scope validation, versioning, idempotency, and audit correlation.

## Rules

Clients cannot mark actuals, alter posted ledger data, approve their own material plan, authorize payment/payout/transfer, release reserves, or convert forecast values into payables through API fields.

## Related Documents

- [000-index.md](000-index.md)
- [002-budget-domain-model.md](002-budget-domain-model.md)
- [013-budget-approvals.md](013-budget-approvals.md)
- [017-budget-events.md](017-budget-events.md)
