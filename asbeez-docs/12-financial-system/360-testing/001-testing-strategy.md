# Testing Strategy

> **Document:** 12-financial-system/360-testing/001-testing-strategy.md

---

## Purpose

Financial testing proves that AsBeez monetary effects are correct, authorized, balanced, idempotent, recoverable, observable, compliant, and auditable across contexts, providers, countries, currencies, and periods.

## Test Layers

Use unit and domain-rule tests for deterministic behavior; ledger/property tests for accounting invariants; integration/API/event/contract tests for boundaries; reconciliation/close tests for control processes; concurrency/replay/resilience tests for failure; and security/compliance/performance/DR tests for operational risk.

## Quality Gates

No release proceeds with unexplained ledger imbalance, duplicate financial effect, unauthorized state transition, unresolved critical reconciliation difference, unsafe migration, broken contract, material security/compliance failure, or untested recovery path. Test evidence identifies version, scope, data, environment, result, owner, and exceptions.

## Related Documents

- [000-index.md](000-index.md)
- [004-ledger-testing.md](004-ledger-testing.md)
- [010-reconciliation-testing.md](010-reconciliation-testing.md)
- [019-disaster-recovery-testing.md](019-disaster-recovery-testing.md)
- [020-test-data-management.md](020-test-data-management.md)
