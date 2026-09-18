# AsBeez Documentation Roadmap

> **Status:** Active working document  
> **Last Updated:** 2026-09-17

This roadmap defines the order in which the AsBeez documentation should become authoritative. The numbered folders are the source structure for the documentation; [`MASTER_INDEX.md`](MASTER_INDEX.md) is the navigation map, and this file records sequencing, dependencies, and unresolved decisions.

For the implementation sequence from approved documentation into product delivery, use [`DEVELOPMENT_WORKFLOW.md`](../DEVELOPMENT_WORKFLOW.md).

## Documentation Domains

| Order | Domain | Purpose | Current priority |
| --- | --- | --- | --- |
| 00 | [The AsBeez Principles](00-the-asbeez-principles/000-index.md) | Purpose, promises, values, and non-negotiables | Establish authority |
| 01 | [Founder Vision](01-founder-vision/000-index.md) | Problem, opportunity, vision, and long-term direction | Establish authority |
| 02 | [Business Blueprint](02-business-blueprint/000-index.md) | Business model, participants, value exchange, and operating model | Define before build |
| 03 | [Platform Strategy](03-platform-strategy/000-index.md) | Platform boundaries, engines, configuration, and expansion | Define before build |
| 04 | [Core Engines](04-core-engines/000-index.md) | Reusable domain capabilities | Define ownership |
| 05 | [Industry Verticals](05-industry-verticals/000-index.md) | Industry-specific capabilities and rollout sequence | Limit initial scope |
| 06 | [Partner Platform](06-partner-platform/000-index.md) | Partner onboarding, integrations, and settlements | Define after core model |
| 07 | [Marketplace](07-marketplace/000-index.md) | Catalog, discovery, orders, and commerce rules | MVP scope |
| 08 | [Membership](08-membership/000-index.md) | Member lifecycle and participation | MVP scope |
| 09 | [Vendor Engine](09-vendor-engine/000-index.md) | Vendor lifecycle and operations | MVP scope |
| 10 | [Rewards and Loyalty](10-rewards-loyalty/000-index.md) | RP, ABC, AHC, qualification, and reward reporting | Resolve financial meaning |
| 11 | [Beehive Matrix](11-beehive-matrix/000-foundation/000-index.md) | Matrix placement, genealogy, cycles, and distribution | Resolve policy and compliance |
| 12 | [Financial System](12-financial-system/001-overview/000-index.md) | Ledgers, wallets, settlement, payout, tax, and reconciliation | Control plane |
| 13 | [Platform Services](13-platform-services/ai-services/000-index.md) | Notifications, search, reporting, audit, and shared services | Support core domains |
| 14 | [Legal and Compliance](14-legal-compliance/000-index.md) | Jurisdiction, consumer, privacy, tax, and compensation controls | Blocking gate |
| 15 | [Product Requirements](15-product-requirements/000-index.md) | Testable functional and non-functional requirements | Derive from decisions |
| 16 | [System Architecture](16-system-architecture/000-index.md) | Runtime boundaries and deployment architecture | Derive from ownership |
| 17 | [Database](17-database/000-index.md) | Persistent data model and constraints | Derive from invariants |
| 18 | [API](18-api/000-index.md) | External and internal contracts | Derive from workflows |
| 19 | [UI and UX](19-ui-ux/000-index.md) | User-facing experiences | Derive from roles |
| 20 | [Operations](20-operations/000-index.md) | Support, incidents, compliance operations, and recovery | Operational readiness |
| 21 | [Marketing](21-marketing/000-index.md) | Positioning, acquisition, and launch | After offer is defined |
| 22 | [Investor Relations](22-investor-relations/000-index.md) | Investor narrative, model, and diligence | Use verified assumptions |
| 23 | [Architecture Decisions](23-architecture-decisions/000-index.md) | Durable technical decisions and trade-offs | Record decisions |
| 24 | [Business Rules](24-business-rules/000-index.md) | Cross-domain policies and invariants | Single source of truth |
| 25 | [Standards](25-standards/000-index.md) | Naming, API, database, security, and documentation standards | Apply consistently |
| 26 | [Research](26-research/000-index.md) | Evidence supporting product and business assumptions | Cite and date evidence |
| 27 | Assets | Diagrams, mockups, financial models, and media | Keep linked to decisions |
| 28 | Templates | Reusable document and operating templates | Keep aligned with standards |

## Recommended Build Sequence

1. Establish the authoritative principles, founder intent, business model, and platform boundary in domains 00–03.
2. Define participants, money/value units, ownership, qualification, and legal constraints across domains 04–14.
3. Convert those decisions into testable requirements and invariants in domains 15 and 24.
4. Derive the system, database, API, and experience specifications in domains 16–19.
5. Define operations, launch, investor, decision, and standards documentation in domains 20–25.
6. Attach research evidence, assets, and templates in domains 26–28.

## Decisions That Must Be Resolved Before Implementation

- What is the exact legal and economic nature of RP, ABC, and AHC in each launch jurisdiction?
- Is the Beehive Matrix an optional loyalty mechanism, a compensation plan, or a required participation path?
- What activity funds AHC distributions, and what happens when the available pool is insufficient?
- Which country owns a member, Business Cell, order, wallet, ledger entry, and tax obligation when parties cross borders?
- What is the single authoritative lifecycle for refunds, chargebacks, qualification reversal, matrix placement, and payout?
- Which vertical is the initial launch scope, and which planned verticals are explicitly deferred?

## Governance

When documents conflict, resolve them in this order:

1. Legal and compliance constraints.
2. The AsBeez Principles and explicit founder intent.
3. Approved architecture decisions and business rules.
4. Domain documents and implementation specifications.
5. Marketing, investor, and presentation materials.

Every resolved conflict should be recorded in [Architecture Decisions](23-architecture-decisions/000-index.md) or [Business Rules](24-business-rules/000-index.md), with links from affected documents.
