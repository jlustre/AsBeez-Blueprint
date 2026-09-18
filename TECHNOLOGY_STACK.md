# AsBeez Technology Stack

> **Status:** Recommended baseline; material choices require an ADR before implementation.
> **Date:** 2026-09-17
> **Principle:** Start with a modular monolith and extraction-ready contracts. Add infrastructure only when a measured requirement justifies it.

## 1. Recommended Initial Stack

| Area | Recommendation | Reason |
| --- | --- | --- |
| Source control | GitHub repositories, pull requests, CODEOWNERS, branch protection | Review, ownership, history, and release control |
| Backend | PHP + Laravel modular monolith | Matches the documented Laravel architecture and supports fast domain delivery |
| Backend/admin UI | Laravel + Livewire + Alpine.js | Server-driven workflows for administration, support, operations, and financial controls |
| Frontend | React + TypeScript | Component ecosystem and clear separation for customer/member/vendor experiences |
| Styling | Tailwind CSS | Consistent responsive, accessible, token-driven UI implementation |
| Mobile | Responsive web/PWA first; Flutter only after validated mobile demand | Avoid two product surfaces before the web journeys are proven |
| Primary database | MySQL 8.4 | Transactions, constraints, JSON support, reporting, and strong financial data integrity |
| Cache/locks | Redis | Cache, rate limits, short-lived locks, and queue support; never financial authority |
| Jobs/queues | Laravel queues with Redis initially; durable broker when scale requires | Simple start with an extraction path |
| Events | Transactional outbox in MySQL; broker delivery through a versioned adapter | Atomic domain change plus durable publication |
| Object storage | S3-compatible object storage with KMS-managed encryption | Documents, evidence, exports, media, backups, and data-room assets |
| Search | MySQL search initially; OpenSearch only when relevance/scale requires | Avoid premature search infrastructure |
| API description | OpenAPI, JSON Schema, generated contract tests | Stable, reviewable, versioned contracts |
| Authentication | OAuth/OIDC provider plus Laravel Sanctum/session model for first-party web where appropriate | Central identity, MFA, revocation, and scoped service access |
| Payments | Provider adapter layer; Stripe-like provider for pilot only after country/legal approval | Provider portability and evidence/reconciliation boundary |
| Infrastructure | Docker for local/CI; one managed cloud provider for production | Reproducible environments and reduced operations burden |
| Infrastructure as code | Terraform or OpenTofu; select one and standardize | Reviewable, repeatable infrastructure changes |
| CI/CD | GitHub Actions, automated tests, migrations, security scans, artifact promotion | Enforced release gates |
| Observability | OpenTelemetry, Prometheus-compatible metrics, Grafana, centralized structured logs, managed error tracking | Correlation across APIs, jobs, providers, events, and financial workflows |
| Testing | PHPUnit/Pest, browser/API contract tests, Playwright, load testing, mutation/property testing where valuable | Financial invariants plus user and system behavior |
| Security scanning | Dependabot/Renovate, SAST, secret scanning, dependency audit, DAST, container scanning | Continuous supply-chain and application security |
| Documentation | Markdown in GitHub, Mermaid/PlantUML diagrams, OpenAPI, ADRs | Versioned single source of truth |
| Analytics | MySQL/reporting projections initially; warehouse/BI after data volume and governance justify it | Preserve lineage before broad analytics tooling |
| AI | Provider adapter, model/prompt registry, RAG over approved sources, evaluation harness, human approval | Governed assistance without autonomous financial effects |

## 2. Development and Collaboration Tools

- VS Code or an equivalent IDE with PHP, Laravel, Livewire, Alpine.js, React, TypeScript, Tailwind CSS, Markdown, Docker, SQL, and OpenAPI support.
- GitHub Issues/Projects for backlog, milestones, dependencies, and release gates.
- Pull requests with CODEOWNERS for Product, Domain, Finance, Legal/Compliance, Security, and Architecture review.
- Markdown, Mermaid, OpenAPI, JSON Schema, and ADR templates from [28-templates](asbeez-docs/28-templates/index.md).
- Figma for UI/UX source files, with exported assets managed under [27-assets](asbeez-docs/27-assets/index.md).
- Postman or Bruno for exploratory API work; automated contract tests remain authoritative.
- DBeaver or TablePlus for authorized development database inspection; never use ad hoc production edits.

## 3. Backend and Domain Implementation

Use Laravel modules aligned with bounded contexts. Use Livewire and Alpine.js for server-driven backend/admin/support/operations workflows; use React + TypeScript for customer/member/vendor-facing experiences that need richer client interaction.

Use Tailwind CSS through a shared design-token/component layer rather than ad hoc page styling.

Application structure:

- Domain: entities, value objects, policies, domain services, domain events.
- Application: commands, queries, handlers, transactions, authorization, idempotency.
- Infrastructure: persistence, queues, providers, mail, storage, external adapters.
- Interfaces: HTTP controllers, CLI commands, workers, webhooks, scheduled jobs.
- Tests: unit, domain, integration, contract, security, failure, reconciliation, and recovery.

Keep controllers thin, use explicit request validation, never use floating-point for money, and never write another context's tables directly.

## 4. Frontend and Interaction Architecture

- React components consume versioned APIs and events through typed client contracts.
- Livewire components are used for authenticated server-driven admin, support, operations, reconciliation, close, and configuration workflows.
- Alpine.js handles small local interactions, progressive disclosure, confirmation, tabs, menus, and transient UI state; it does not own financial truth.
- Tailwind CSS provides responsive layout, semantic design tokens, focus states, accessible contrast, reduced-motion variants, and country/localization-safe components.
- All clients show authoritative pending/failed/unknown/reversed states and prevent duplicate effectful submissions.
- Shared design-system components define money/currency, status, error, table, form, approval, audit, and source/freshness presentations.

## 5. Data and Financial Technology

- MySQL is the source database for transactional aggregates and the initial General Ledger.
- Use migrations, foreign keys, unique constraints, check constraints, optimistic versions, append-only journal lines, and control totals.
- Store monetary amounts as integer minor units plus ISO currency. Preserve original, settlement, and reporting currencies.
- Use Redis only for ephemeral concerns such as cache, rate limiting, locks, and queues. Redis is not the ledger, wallet authority, or reconciliation source.
- Use object storage for documents/evidence with immutable or retention-controlled storage where required.
- Add a warehouse, stream platform, or search cluster only after a measured workload, ownership, privacy, and recovery decision.

## 6. API, Events, and Integrations

- OpenAPI and JSON Schema define external/internal contract shapes.
- Use API versioning, idempotency keys, correlation/causation IDs, safe errors, pagination, rate limits, and country/entity scope.
- Use a transactional outbox paired with state changes.
- Use versioned domain/integration events and idempotent consumers.
- Use adapter interfaces for payment, banking, payout, tax, FX, risk, KYC/AML, accounting, ERP, notifications, and AI providers.
- Store provider request/response/callback evidence separately from authoritative AsBeez state.
- Reconcile provider, bank, subledger, wallet, tax, reserve, and ledger results before declaring final success.

## 7. Cloud and Deployment Baseline

Start with managed services where they reduce undifferentiated operations work:

- managed MySQL with point-in-time recovery;
- managed Redis with encryption and private networking;
- managed object storage with lifecycle, versioning, and KMS/HSM integration;
- managed queue/broker only when Redis queues no longer meet durability or scale needs;
- private networks, secret manager, managed certificates, WAF, backup, and centralized logs;
- separate development, test, staging, and production environments; and
- regional deployment only after country residency, failover, reconciliation, and operational ownership are defined.

### Cloud Decision

Select AWS, Azure, or another provider through an ADR based on country residency, managed MySQL/Redis/object storage, payment/banking connectivity, security/compliance, team capability, cost, resilience, and exit strategy. Do not mix major cloud platforms before a clear requirement exists.

## 8. Security and Privacy Tooling

Use a secrets manager, KMS/HSM, TLS, dependency and container scanning, secret scanning, SAST/DAST, audit logs, privileged access management, MFA, WAF/rate limiting, data classification, masking/tokenization, backup encryption, and access recertification.

Security tooling must support country/entity isolation, retention/legal hold, deletion/anonymization, incident evidence, vendor review, and privacy impact assessment. Tools do not replace security ownership or legal approval.

## 9. Testing and Quality Gates

Required automated gates include:

1. Formatting, linting, static analysis, type checks, and dependency/security scans.
2. Unit and domain-rule tests.
3. Ledger balance and financial invariant tests.
4. API, integration, event, provider, and contract tests.
5. Idempotency, concurrency, replay, and failure-injection tests.
6. Browser/accessibility tests with Playwright or equivalent.
7. Performance/load tests for expected and peak workloads.
8. Privacy, authorization, penetration, compliance, and data-residency tests.
9. Backup/restore, disaster recovery, and projection rebuild tests.
10. Reconciliation and close evidence before production release.

## 10. AI Technology Baseline

Use a provider abstraction, model/prompt registry, approved retrieval sources, evaluation dataset, structured outputs, input/output filtering, cost/rate limits, model/version logging, and human approval gates.

AI tools are read-only or approval-gated by default. AI cannot post, approve, pay, alter balances, release/freeze funds, certify, close, grant unrestricted access, or make final legal/compliance decisions.

## 11. What Not to Build Yet

Do not begin with independent microservices for every domain, multi-region active-active writes, a full event-streaming platform, a separate search cluster, a custom identity platform, native mobile apps, custom AI training, or a large data warehouse unless a measured requirement and approved ADR justify it.

## 12. Technology Decision Checklist

Before adopting a tool or platform, document:

- problem and measurable requirement;
- owning module/context;
- alternatives considered;
- data classification and country/residency;
- security/privacy/compliance impact;
- financial integrity and reconciliation impact;
- performance/capacity need;
- operational owner and SLO;
- testing and recovery plan;
- cost and exit/portability plan;
- migration/rollback; and
- ADR approval.

## Related Documents

- [Development Workflow](DEVELOPMENT_WORKFLOW.md)
- [System Architecture](asbeez-docs/16-system-architecture/000-index.md)
- [Database](asbeez-docs/17-database/000-index.md)
- [API](asbeez-docs/18-api/000-index.md)
- [Operations](asbeez-docs/20-operations/000-index.md)
- [Standards](asbeez-docs/25-standards/000-index.md)
- [Architecture Decisions](asbeez-docs/23-architecture-decisions/000-index.md)
