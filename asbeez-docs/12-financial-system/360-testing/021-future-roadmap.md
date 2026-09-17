# Future Roadmap

> **Document:** 12-financial-system/360-testing/021-future-roadmap.md

---

## Near Term

- establish test strategy, environments, fixtures, financial invariants, contract tests, evidence, quality gates, and release ownership;
- cover ledger, double-entry, APIs, events, providers, reconciliation, close, idempotency, concurrency, security, compliance, performance, and recovery; and
- connect test results to observability, incidents, audit, reconciliation, and remediation.

## Medium Term

- add property-based, mutation, fault-injection, contract-compatibility, provider-simulation, regional, chaos, load, and continuous-recovery testing;
- improve synthetic/masked data, automated control-total comparison, model/AI testing, and production-like replay; and
- certify country/entity/provider variations and close/tax/settlement scenarios.

## Long Term

- provide continuous financial-control verification across independently deployed contexts;
- use governed automation to detect test gaps and prioritize risk without bypassing human release authority; and
- maintain portable evidence, reproducibility, and auditability through technology and regional change.

## Roadmap Gate

No release or architecture change may proceed with unexplained imbalance, duplicate effect, broken contract, unauthorized path, unresolved material reconciliation/control failure, unsafe data use, or untested recovery.

## Related Documents

- [000-index.md](000-index.md)
- [001-testing-strategy.md](001-testing-strategy.md)
- [019-disaster-recovery-testing.md](019-disaster-recovery-testing.md)
- [020-test-data-management.md](020-test-data-management.md)
