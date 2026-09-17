# Testing Reference

> **Document:** 12-financial-system/999-reference/019-testing-reference.md

---

## Purpose

This reference summarizes testing expectations; the testing domain governs exact test strategy, evidence, environments, and release gates.

## Test Matrix

Unit/domain rules; ledger/double-entry; API/integration/event/contract; reconciliation/close; idempotency/concurrency/replay; performance/load; security/compliance; disaster recovery; and test-data management.

## Required Assertions

Balanced immutable postings, one financial effect per idempotency scope, authorized transitions, provider uncertainty, event compatibility, reconciliation/control totals, period/close correctness, privacy/security, country/entity isolation, performance, and recoverability.

## Rules

A successful HTTP/provider response is not financial correctness. Use deterministic fixtures, masked/synthetic data, fault injection, sandbox providers, property/boundary cases, and retained evidence with version/scope/owner/result.

## Related Documents

- [000-index.md](000-index.md)
- [005-journal-entry-reference.md](005-journal-entry-reference.md)
- [014-example-scenarios.md](014-example-scenarios.md)
- [../360-testing/000-index.md](../360-testing/000-index.md)
