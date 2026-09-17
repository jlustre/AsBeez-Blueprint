# Best Practices

> **Document:** 12-financial-system/999-reference/020-best-practices.md

---

## Purpose

These practices summarize reliable AsBeez financial implementation and operations.

## Best Practices

- use General Ledger authority and immutable balanced postings;
- distinguish money, rewards, GMV, revenue, tax, reserves, settlement, payout, and provider evidence;
- use explicit entity/country/currency/period/policy/version/source/actor/correlation/idempotency;
- communicate through APIs/events/outbox, not direct cross-context writes;
- design retries, concurrency, replay, reconciliation, close, observability, security, and recovery from the beginning;
- preserve local statutory history and effective-dated policy; and
- keep AI advisory and approval-gated.

## Anti-Patterns

Manual balance edits, mutable posted journals, hidden exceptions, blind provider retries, unscoped exports, reused policy without version, silent metric changes, direct AI side effects, and treating technical success as financial success.

## Related Documents

- [000-index.md](000-index.md)
- [001-glossary.md](001-glossary.md)
- [021-troubleshooting.md](021-troubleshooting.md)
- [../400-strategy/001-financial-system-strategy.md](../400-strategy/001-financial-system-strategy.md)
