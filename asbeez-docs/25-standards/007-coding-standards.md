# Coding Standards

## Purpose

Coding standards keep AsBeez code readable, testable, secure, modular, observable, and consistent with bounded-context and financial controls.

## Rules

Use clear names, small cohesive units, explicit types/validation, dependency injection, domain/application/infrastructure separation, no hidden global state, secure errors, and focused comments only where needed. Keep controllers/adapters thin and domain rules explicit.

## Financial Code

Never use floating-point for money; use minor units/currency. Make posting, idempotency, concurrency, period, policy, rounding, tax, FX, reserve, and authorization rules explicit and tested. Never mutate posted ledger/audit facts; use reversal/compensation.

## Quality

Require unit/domain, integration/API/event/contract, security, performance, failure/replay, reconciliation, and recovery tests appropriate to risk. Review dependencies, secrets, privacy, logging, accessibility, migrations, observability, and rollback. AI-generated code receives normal human review and tests.

## Related Documents

- [index.md](index.md)
- [005-api-standards.md](005-api-standards.md)
- [006-database-standards.md](006-database-standards.md)
- [../16-system-architecture/007-laravel-architecture.md](../16-system-architecture/007-laravel-architecture.md)
