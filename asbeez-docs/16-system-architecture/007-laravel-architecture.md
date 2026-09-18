# Laravel Architecture

## Purpose

Laravel is an implementation framework option for the initial modular monolith. Framework conventions must serve domain boundaries, contracts, security, testing, operations, and financial correctness rather than become the architecture itself.

## Application Structure

Use modules/bounded contexts with domain, application, infrastructure, interfaces, migrations, policies, jobs, events, listeners, and tests separated by ownership. Controllers remain thin; commands/use cases validate and authorize; repositories do not expose cross-context tables; integrations use adapters.

Use Livewire and Alpine.js for server-driven administration, support, operations, reconciliation, close, configuration, and other authenticated workflows. Use React and TypeScript for customer, member, vendor, and partner experiences that require richer client-side composition. Tailwind CSS is the shared styling and design-token layer.

React, Livewire, and Alpine.js are presentation clients. None owns financial truth, authorization decisions, balances, posted journals, provider outcomes, or reconciliation state.

## Financial Rules

Use database transactions for aggregate and outbox atomicity, integer minor units, strict constraints, optimistic/concurrency controls, append-only posted journals, idempotency records, queues, durable events, audit, and reconciliation. External calls are not held inside authoritative database transactions.

## Operations and Security

Use environment/secrets management, queues, scheduler, health checks, structured logs, traces, correlation IDs, rate limits, authorization policies, MFA integration, encryption, backups, failure handling, and tested deployment/rollback. No debug output or secrets in production financial paths.

## Extraction Readiness

Modules expose versioned contracts and can later be extracted only after data ownership, consistency, observability, SLO, security, migration, recovery, and reconciliation evidence is sufficient.

## Related Documents

- [index.md](index.md)
- [004-bounded-contexts.md](004-bounded-contexts.md)
- [008-scalability.md](008-scalability.md)
- [../12-financial-system/290-architecture/001-system-architecture.md](../12-financial-system/290-architecture/001-system-architecture.md)
