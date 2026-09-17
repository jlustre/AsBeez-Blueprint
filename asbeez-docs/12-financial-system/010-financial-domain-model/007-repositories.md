# Repositories

## Purpose

Repositories provide persistence-oriented access to aggregate roots without leaking database structure into domain behavior. They are owned by the bounded context that owns the aggregate.

## Repository Interfaces

| Repository | Required operations |
| --- | --- |
| PaymentRepository | find by ID, idempotency key, provider reference; save versioned payment |
| InvoiceRepository | find, save, query collectible invoices, lock for allocation |
| JournalRepository | save draft, approve, post, find by source reference, query period |
| WalletRepository | find, save versioned wallet, lock for reservation |
| SettlementRepository | find batch, save calculation, query payable obligations |
| PayoutRepository | find request, save attempt, query retryable failures |
| TaxAssessmentRepository | save and retrieve assessment by source and rule version |
| ReconciliationRepository | persist sessions, statement lines, matches, exceptions |
| RewardLiabilityRepository | find obligation, append release/reversal, query outstanding liability |

## Persistence Rules

- Repositories persist aggregate state and version, not arbitrary field updates.
- All writes include an outbox event or an equivalent durable publication record.
- Posted journals and audit evidence are append-only.
- Queries that span contexts use reporting projections, not cross-context joins.
- Repository methods expose domain identifiers and value objects, not ORM models.

## Concurrency and Idempotency

Updates require an expected version. A stale version is rejected and retried by the application workflow. Idempotency keys are unique within their caller scope and retain the original result for safe replay.

## Related Documents

- [003-aggregates.md](003-aggregates.md)
- [010-domain-events.md](010-domain-events.md)
- [011-invariants.md](011-invariants.md)
