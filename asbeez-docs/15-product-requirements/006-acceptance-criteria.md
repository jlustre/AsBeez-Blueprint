# Acceptance Criteria

## Purpose

Acceptance criteria define release evidence for product requirements. A feature is accepted only when behavior, controls, legal readiness, operations, data, and recovery are demonstrated for its scope.

## Universal Criteria

- correct actor, role, entity/country, currency, policy, and effective date are applied;
- authorized commands validate inputs, idempotency, concurrency, risk, tax, and approval;
- monetary effects are balanced, immutable, auditable, and reconciled;
- provider callbacks/evidence, events, retries, unknown states, failures, and compensation are tested;
- reports, dashboards, support, notifications, and AI outputs identify source, freshness, uncertainty, and access scope;
- privacy, security, retention, accessibility, consumer, tax, compliance, and legal requirements are approved; and
- monitoring, runbooks, incident response, backup/restore, continuity, and disaster recovery are ready.

## Scenario Examples

### Payment and Order

Given an approved order, when payment is authorized and captured, then tax, fees, vendor/partner allocation, reward treatment, settlement, ledger posting, reconciliation, and customer-safe status are traceable. A timeout must produce pending/unknown state and no duplicate effect.

### Refund or Dispute

Given an eligible refund or chargeback, when approved, then provider evidence, tax/fee/reward/entitlement/reserve treatment, compensating accounting, reconciliation, communication, and audit evidence exist. Original history remains unchanged.

### Country Migration

Given approved residency evidence and administrative review, future activity follows the new country while historical records retain original country/currency/policy; privacy, tax, compliance, wallet, reward, matrix, and reporting impacts are handled.

### AI Assistance

Given an AI recommendation, the output includes source, version, confidence, limitations, and human disposition. AI cannot directly post, approve, pay, release/freeze, certify, close, or bypass controls.

## Evidence

Record requirement ID, scenario, actor/scope, test data, environment, result, defects, approval, exception/risk acceptance, owner, release version, and linked artifacts.

## Related Documents

- [000-index.md](000-index.md)
- [003-user-stories.md](003-user-stories.md)
- [005-non-functional-requirements.md](005-non-functional-requirements.md)
- [../12-financial-system/360-testing/001-testing-strategy.md](../12-financial-system/360-testing/001-testing-strategy.md)
