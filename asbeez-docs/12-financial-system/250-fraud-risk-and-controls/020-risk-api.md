# Risk API

> **Document:** 12-financial-system/250-fraud-risk-and-controls/020-risk-api.md

---

## Purpose

The Risk API exposes authenticated risk decisions, alerts, cases, controls, holds, scores, evidence, appeals, losses, recoveries, and reporting without allowing clients to bypass financial or customer protections.

## Read Operations

- retrieve risk decision, reason, evidence status, score/confidence, control, hold, case, appeal, loss, recovery, and resolution;
- retrieve safe subject/activity history and reporting status; and
- retrieve model/rule version and review deadlines where authorized.

## Commands

Open case, submit evidence, request review/appeal, place/release approved hold, assign case, record decision, and resolve. Commands require role scope, policy, evidence, idempotency, dual control where material, and audit correlation.

## Rules

Clients cannot set risk scores, mark fraud, deny rights, close cases, release funds, alter accounting, or suppress alerts through arbitrary fields.

## Related Documents

- [000-index.md](000-index.md)
- [015-transaction-monitoring.md](015-transaction-monitoring.md)
- [017-case-management.md](017-case-management.md)
- [021-risk-events.md](021-risk-events.md)
