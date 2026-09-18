# Identifier Conventions

## Purpose

Identifiers provide stable, non-sensitive references across APIs, data, events, integrations, audit, support, and financial lineage.

## Rules

Use globally unique, non-semantic IDs for records; human-readable numbers only where business numbering is required. Never encode secrets, payment credentials, identity data, mutable meaning, or authorization in IDs. Separate resource ID, business number, provider reference, correlation ID, causation ID, trace ID, and idempotency key.

## Financial Identifiers

Journal, line, account, wallet, payment, payout, invoice, refund, dispute, tax, FX, reserve, reconciliation, period, event, and audit IDs remain immutable references. Provider IDs are scoped by provider/entity/country and are evidence, not AsBeez authority. Idempotency keys are scoped to actor/client/operation/resource/entity/country.

## Lifecycle

IDs are never reused. Migrations preserve old/new references and provenance. Public identifiers are access-controlled and should not reveal sequence, volume, or sensitive identity. Logs/events expose only authorized and masked references.

## Related Documents

- [index.md](index.md)
- [002-naming-conventions.md](002-naming-conventions.md)
- [005-api-standards.md](005-api-standards.md)
- [../12-financial-system/290-architecture/009-idempotency.md](../12-financial-system/290-architecture/009-idempotency.md)
