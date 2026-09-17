# Testing

> **Document:** 12-financial-system/360-testing/000-index.md

---

## Purpose

This section defines Financial System testing strategy across unit, domain rule, ledger, double-entry, integration, API, event, contract, reconciliation, close, idempotency, concurrency, replay, performance, load, security, compliance, and disaster-recovery testing.

## Structure

- [001-testing-strategy.md](001-testing-strategy.md) - Testing Strategy
- [002-unit-testing.md](002-unit-testing.md) - Unit Testing
- [003-domain-rule-testing.md](003-domain-rule-testing.md) - Domain Rule Testing
- [004-ledger-testing.md](004-ledger-testing.md) - Ledger Testing
- [005-double-entry-validation.md](005-double-entry-validation.md) - Double Entry Validation
- [006-integration-testing.md](006-integration-testing.md) - Integration Testing
- [007-api-testing.md](007-api-testing.md) - API Testing
- [008-event-testing.md](008-event-testing.md) - Event Testing
- [009-contract-testing.md](009-contract-testing.md) - Contract Testing
- [010-reconciliation-testing.md](010-reconciliation-testing.md) - Reconciliation Testing
- [011-financial-close-testing.md](011-financial-close-testing.md) - Financial Close Testing
- [012-idempotency-testing.md](012-idempotency-testing.md) - Idempotency Testing
- [013-concurrency-testing.md](013-concurrency-testing.md) - Concurrency Testing
- [014-replay-testing.md](014-replay-testing.md) - Replay Testing
- [015-performance-testing.md](015-performance-testing.md) - Performance Testing
- [016-load-testing.md](016-load-testing.md) - Load Testing
- [017-security-testing.md](017-security-testing.md) - Security Testing
- [018-compliance-testing.md](018-compliance-testing.md) - Compliance Testing
- [019-disaster-recovery-testing.md](019-disaster-recovery-testing.md) - Disaster Recovery Testing
- [020-test-data-management.md](020-test-data-management.md) - Test Data Management
- [021-future-roadmap.md](021-future-roadmap.md) - Future Roadmap

## Design Authority

Financial Testing owns test strategy, invariant coverage, evidence, environments, fixtures, quality gates, contract compatibility, resilience validation, security/compliance validation, and release confidence. Domain owners define expected behavior; the General Ledger and control authorities define financial truth.

## Testing Authority

A technically successful request is insufficient. Tests must prove balanced immutable accounting, authorized state transitions, one financial effect per idempotency scope, event/integration correctness, reconciliation, close, privacy, security, performance, and recovery. Failures remain visible and require disposition.

## Implementation Sequence

1. Establish strategy, unit/domain rules, financial invariants, test data, evidence, and quality gates.
2. Test ledger, double-entry, APIs, integrations, events, contracts, reconciliation, close, idempotency, concurrency, and replay.
3. Test performance, load, security, compliance, disaster recovery, backup/restore, and provider uncertainty.
4. Connect tests to observability, incidents, audit, remediation, release gates, and country/entity/provider certification.
5. Revalidate material policy, schema, architecture, provider, data, AI, and regional changes.

## Related Documents

- [001-testing-strategy.md](001-testing-strategy.md)
- [004-ledger-testing.md](004-ledger-testing.md)
- [010-reconciliation-testing.md](010-reconciliation-testing.md)
- [019-disaster-recovery-testing.md](019-disaster-recovery-testing.md)
- [020-test-data-management.md](020-test-data-management.md)
- [../290-architecture/005-double-entry-ledger-architecture.md](../290-architecture/005-double-entry-ledger-architecture.md)
