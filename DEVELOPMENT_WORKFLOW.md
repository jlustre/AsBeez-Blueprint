# AsBeez Development Workflow

> **Status:** Active working workflow
> **Version:** 1.0.0
> **Date:** 2026-09-17
> **Purpose:** Move AsBeez from governed documentation to controlled implementation, validation, launch, and scale.

## 1. How to Use This Workflow

Work phase by phase and module by module. Do not begin a downstream module until its dependency gate is accepted. Every module produces decisions, requirements, schemas, APIs/events, tests, operational procedures, and evidence before implementation is considered complete.

The workflow is intentionally commerce-first and control-first:

```text
Authority and Research
        -> Product and Legal Decisions
        -> Domain Rules and Requirements
        -> Architecture and Data
        -> APIs, Events, UI/UX
        -> Implementation and Tests
        -> Operations and Pilot
        -> Controlled Launch and Scale
```

## 2. Non-Negotiable Development Rules

1. Legal, privacy, tax, security, and country restrictions are release gates.
2. The General Ledger is authoritative for posted monetary effects.
3. Posted journals and audit facts are immutable; corrections use reversals or compensating entries.
4. RP, ABC, and AHC are not money by default and are never marketed as guaranteed income, investment, ownership, currency, or return.
5. All effectful commands are authorized, idempotent, concurrency-safe, auditable, and reconciled.
6. Provider responses are evidence until mapped and reconciled.
7. AI may explain, forecast, detect, prioritize, retrieve, classify, summarize, and recommend; it cannot independently post, approve, pay, release/freeze funds, certify, close, or bypass controls.
8. No production launch occurs without tested rollback, monitoring, support, incident response, backup/restore, and disaster recovery.

## 3. Delivery Roles

| Role | Primary accountability |
| --- | --- |
| Product | Problem, scope, user outcomes, prioritization, acceptance |
| Domain owner | Business language, rules, aggregates, workflows, decisions |
| Legal/Compliance | Jurisdiction, contracts, disclosures, privacy, tax, regulatory gates |
| Finance/Accounting | Chart, ledger, recognition, liabilities, reserves, close, reporting |
| Treasury/Risk | Liquidity, provider exposure, fraud, limits, holds, losses |
| Architecture/Engineering | Boundaries, data, APIs, events, implementation, reliability |
| Security/Privacy | Threats, access, secrets, data protection, incident controls |
| Operations/Support | Runbooks, queues, service, escalation, continuity, recovery |
| QA/Testing | Invariants, contracts, failure, performance, release evidence |
| Marketing/Investor | Approved claims, audience communication, disclosure compliance |

## Phase 0: Mobilize and Establish Authority

### Modules

- Principles and founder intent
- Business blueprint and platform strategy
- Legal/compliance baseline
- Research register
- Standards and templates
- Architecture decisions and business rules

### Steps

1. Confirm the canonical documentation map and ownership for every domain.
2. Create a decision register for unresolved legal, reward, Matrix, country, financial, provider, and launch questions.
3. Assign owners and reviewers for each implementation module.
4. Establish naming, ID, documentation, API, database, security, versioning, research, and asset standards.
5. Identify conflicts and resolve them through approved ADRs or business rules.
6. Mark every assumption as verified, estimated, open, rejected, or requiring legal review.
7. Approve the initial launch country, vertical, customer segment, vendor segment, and deferred scope.

### Gate 0: Authority Ready

Accepted principles, decision log, owners, scope, standards, research register, risk register, and legal/compliance blockers are visible. No unresolved blocker is disguised as a requirement.

## Phase 1: Define the Launch Product

### Modules

- Marketplace commerce
- Customer experience
- Membership
- Vendor engine
- Rewards and loyalty
- Beehive Matrix
- Partner platform

### Steps

1. Define the launch customer problem and measurable outcome.
2. Define customer, member, vendor, partner, operator, and administrator roles.
3. Document end-to-end journeys: discovery, onboarding, order, payment, fulfillment, refund, support, reward, referral, and payout.
4. Define product/catalog/order/fulfillment ownership and state transitions.
5. Define vendor onboarding, product approval, agreement, fees, tax, settlement, support, and payout requirements.
6. Define membership, country assignment/migration, referral, reward, and Matrix rules.
7. Validate all claims, reward language, member benefits, vendor promises, and customer disclosures with Legal/Compliance.
8. Convert journeys into product requirements, user stories, acceptance criteria, UI/UX flows, APIs, and events.

### Gate 1: Product Scope Ready

A single launch scope exists with approved roles, journeys, business rules, legal assumptions, country scope, acceptance criteria, out-of-scope list, and measurable success metrics.

## Phase 2: Design Financial and Control Foundations

### Modules

- Financial domain model
- Chart of Accounts
- General Ledger
- Subledgers and wallets
- Reward finance
- Payments and payouts
- Invoicing, revenue, refunds, disputes
- Tax, FX, reserves, treasury
- Reconciliation, reporting, close

### Steps

1. Define legal entities, country ownership, currencies, calendars, accounting policies, and reporting basis.
2. Define the Chart of Accounts, dimensions, control accounts, and posting mappings.
3. Define journal preparation, validation, approval, posting, reversal, compensation, periods, and close.
4. Define wallet types, monetary units, holds, reserves, limits, statements, and reward-unit separation.
5. Define payment authorization/capture/settlement and provider evidence/reconciliation.
6. Define vendor/partner entitlements, fees, commissions, tax, reserves, settlement, and payout.
7. Define invoice, revenue recognition, refund, chargeback, dispute, and compensation treatment.
8. Define tax, FX, treasury, liquidity, and country-specific controls.
9. Define reconciliation scopes, control totals, exception resolution, certification, reports, and close checklists.
10. Define financial APIs, events, data schemas, audit, observability, and tests.

### Gate 2: Financial Control Ready

Every monetary effect has an approved source, account mapping, policy/version, entity/country/currency, period, journal treatment, correction method, subledger, reconciliation path, audit evidence, and test scenarios.

## Phase 3: Establish Architecture and Platform Foundations

### Modules

- System architecture and bounded contexts
- Database and migrations
- API and authentication
- Events and outbox
- Security/privacy
- Observability
- AI/platform services

### Steps

1. Establish modular-monolith module boundaries and data ownership.
2. Define aggregate boundaries, consistency, concurrency, idempotency, and saga/orchestration rules.
3. Implement environment, secrets, identity, authorization, MFA, audit, logging, tracing, metrics, and alerts.
4. Create database schemas, constraints, indexes, partitions, migrations, retention, backups, and restore procedures.
5. Define API envelopes, errors, pagination, versioning, rate limits, webhooks, and contract tests.
6. Define event envelopes, schema versions, outbox, consumers, replay, dead letters, and event monitoring.
7. Establish integration adapters for payment, banking, payout, tax, FX, risk, KYC/AML, accounting, warehouse, and notification providers.
8. Implement AI Services only as read-only or approval-gated capabilities with provider, prompt, RAG, governance, privacy, and security controls.

### Gate 3: Platform Foundation Ready

Local environments, CI checks, schema migration path, authentication/authorization, observability, event delivery, API contracts, secrets, backups, test data, and recovery procedures are demonstrated.

## Phase 4: Build the Vertical Slice

Build one complete, narrow path before broad feature expansion.

### Recommended Slice

Customer -> vendor product -> cart -> server-side pricing -> checkout -> payment -> order -> fulfillment evidence -> refund path -> ledger/reconciliation -> support.

### Steps

1. Implement customer/vendor identity and authorization.
2. Implement one product category and one country configuration.
3. Implement vendor onboarding and one approved product/service flow.
4. Implement cart, server-side pricing, tax estimate, and checkout confirmation.
5. Integrate one payment provider in sandbox and persist provider evidence.
6. Create order/payment events and idempotent consumers.
7. Implement invoice/order allocation and vendor entitlement projections.
8. Post approved financial effects through the ledger workflow.
9. Implement refund request and provider-unknown handling.
10. Reconcile payment/provider/order/ledger/subledger records.
11. Expose customer, vendor, admin, support, and operational UI states.
12. Test the full slice with synthetic data and failure injection.

### Gate 4: Vertical Slice Ready

The slice works end to end in a non-production environment, with balanced journals, reconciled sources, correct permissions, privacy-safe UI, audit lineage, failure handling, support runbooks, and evidence for each acceptance criterion.

## Phase 5: Add Controlled Domain Modules

Implement modules in dependency order.

### Module 1: Identity and Access

1. Implement authentication, MFA, roles, permissions, country/entity scope, consent, terms acceptance, and access audit.
2. Test recovery, revocation, privilege escalation, separation of duties, and privacy.
3. Gate: unauthorized access and cross-scope access are rejected and audited.

### Module 2: Marketplace and Orders

1. Implement catalog, vendor approval, product/service, cart, pricing, promotions, order, cancellation, and fulfillment.
2. Add server-side calculation, snapshots, status transitions, and event contracts.
3. Gate: order totals, tax context, country, vendor, and source evidence are reproducible.

### Module 3: Payments and Invoicing

1. Implement payment intent, authorization, capture, settlement evidence, invoices, fees, and tax integration.
2. Add retries, callbacks, unknown state, idempotency, reconciliation, and customer/vendor status.
3. Gate: no duplicate payment or false success; payment, invoice, tax, and revenue remain distinct.

### Module 4: Wallets and Rewards

1. Implement typed wallets, balances, holds, reserves, statements, RP/ABC/AHC displays, qualification events, and reward reversals.
2. Add legal/country configuration and Reward Finance mapping where applicable.
3. Gate: reward units cannot be mistaken for money and wallet movements reconcile to ledger/subledgers.

### Module 5: Vendor/Partner Settlement and Payouts

1. Implement allocation, fees, commissions, reserves, settlement, statements, payout eligibility, approval, batches, and provider integration.
2. Add sanctions/tax/risk/destination controls, returns, compensation, and reconciliation.
3. Gate: provider status is not assumed final and payout/liability/cash control totals reconcile.

### Module 6: Refunds, Disputes, Tax, FX, and Treasury

1. Implement full/partial refunds, chargebacks, evidence, liability, reserves, tax adjustments, FX records, bank/cash, liquidity, and transfers.
2. Add country/entity rules, reporting, close, incident, support, and legal escalation.
3. Gate: corrections preserve history, tax/cash/reserve treatment is explicit, and unresolved risk remains visible.

### Module 7: Reporting, Reconciliation, Administration, and AI

1. Implement certified reports, projections, dashboards, reconciliation runs, close checklists, exceptions, audit, and administrative controls.
2. Add AI explanations, forecasts, prioritization, retrieval, and recommendations only with human approval boundaries.
3. Gate: reports disclose lineage/freshness, administration cannot bypass controls, and AI cannot create authoritative financial effects.

## Phase 6: Quality, Security, and Operational Readiness

### Steps

1. Run unit, domain, ledger, double-entry, API, integration, event, contract, reconciliation, close, idempotency, concurrency, and replay tests.
2. Run performance, load, security, privacy, compliance, accessibility, data-residency, and disaster-recovery tests.
3. Test provider outage, unknown callback, duplicate request, data corruption, region loss, key compromise, queue loss, and projection rebuild.
4. Validate dashboards, alerts, SLOs, runbooks, support queues, incident response, continuity, backup/restore, and escalation.
5. Complete legal, tax, privacy, security, risk, finance, operations, and product release reviews.
6. Resolve critical defects and record accepted residual risks with authority.

### Gate 5: Production Candidate

All critical acceptance criteria pass; material risks are accepted or mitigated; monitoring and rollback are ready; support/operations are trained; legal/compliance approvals exist; and recovery has been exercised.

## Phase 7: Country and Provider Pilot

### Steps

1. Select one launch country, entity, currency, vertical, provider set, and bounded cohort.
2. Validate registrations, tax, privacy/residency, payments, banking, payouts, rewards, vendors, support, reporting, reconciliation, close, and DR.
3. Run sandbox and controlled production pilot with limits and enhanced monitoring.
4. Review conversion, repeat purchase, vendor quality, payment success, refunds, disputes, fraud, support, compliance alerts, liquidity, reconciliation, cost, and incidents.
5. Hold a formal go/no-go review and record evidence and unresolved risks.
6. Expand only after thresholds and remediation are approved.

### Gate 6: Pilot Acceptance

Pilot data reconciles, controls work, customer/vendor/member outcomes are acceptable, legal/compliance obligations are satisfied, incidents are resolved, and expansion authority approves the next cohort.

## Phase 8: Controlled Scale and Continuous Improvement

### Steps

1. Add countries, vendors, providers, categories, and user cohorts through readiness gates.
2. Revalidate capacity, provider concentration, liquidity, tax, privacy, security, support, operations, and recovery.
3. Track financial correctness, revenue quality, liabilities, loss/fraud, refunds, payouts, reconciliation, close, SLOs, cost, acquisition, retention, and satisfaction.
4. Use research and incidents to update requirements, business rules, ADRs, configuration, runbooks, tests, and training.
5. Extract bounded contexts or regional services only when contracts, ownership, reconciliation, observability, SLOs, security, and operations are mature.
6. Retire stale features, providers, policies, flags, assets, and documentation through controlled versioning.

### Gate 7: Scale Readiness

Growth decisions are evidence-based, unit economics and liquidity are understood, country/provider controls are certified, capacity and recovery are tested, and no material unresolved financial/control/legal blocker exists.

## 4. Definition of Done for Every Module

A module is done only when:

- scope, owner, dependencies, non-goals, and business rules are approved;
- legal, privacy, security, tax, country, and financial impacts are reviewed;
- database/data ownership and migration are defined;
- APIs/events/errors/idempotency/versioning are defined and tested;
- UI/UX states, accessibility, localization, and support are defined;
- unit/integration/contract/failure/security/performance tests pass as appropriate;
- observability, alerts, SLOs, runbooks, support, incident, and recovery are ready;
- financial effects reconcile and reports disclose source/freshness/status;
- documentation, assets, decisions, research, and evidence are linked; and
- product/domain/engineering/operations/legal/finance approvals are recorded.

## 5. Weekly Execution Cadence

1. Review blockers, decisions, dependencies, risks, incidents, and evidence.
2. Select one module slice and define its gate for the week.
3. Implement the smallest end-to-end increment.
4. Run focused tests and update documentation immediately.
5. Demonstrate behavior to product/domain owners.
6. Reconcile data and review security/privacy/legal impacts.
7. Record decisions, defects, residual risk, and next dependencies.

## 6. First Execution Backlog

Start with these concrete slices:

1. Confirm launch country, vertical, entity, customer segment, vendor segment, and deferred scope.
2. Resolve RP/ABC/AHC legal/economic classification, funding, liability, conversion, and payout policy.
3. Approve the first end-to-end marketplace/payment/order/refund financial slice.
4. Finalize Chart of Accounts and posting mappings for that slice.
5. Implement identity, authorization, country scope, terms, privacy, and audit.
6. Implement database schemas, migrations, API contracts, events/outbox, and idempotency.
7. Implement customer/vendor checkout and payment sandbox flow.
8. Implement ledger posting, reconciliation, refund, support, monitoring, and runbooks.
9. Execute security, compliance, financial, accessibility, load, and recovery tests.
10. Run a bounded pilot and decide whether to expand, pause, or revise.

## Related Documents

- [AsBeez Documentation Roadmap](asbeez-docs/ROADMAP.md)
- [Master Index](asbeez-docs/MASTER_INDEX.md)
- [Product Requirements](asbeez-docs/15-product-requirements/000-index.md)
- [Business Rules](asbeez-docs/24-business-rules/000-index.md)
- [Research](asbeez-docs/26-research/000-index.md)
- [Architecture Decisions](asbeez-docs/23-architecture-decisions/000-index.md)
- [Financial System](asbeez-docs/12-financial-system/001-overview/000-index.md)
