# AsBeez Enterprise Documentation
## Master Index

> **Version:** 2.0
> **Status:** Active Development
> **Last Updated:** 2026-09-17

## Purpose

This is the canonical navigation map for the AsBeez documentation. The numbered folders are the documentation domains; each domain owns the detailed material within its folder. Use [`ROADMAP.md`](ROADMAP.md) for sequencing, dependencies, and unresolved decisions.

## Canonical Domain Map

| Domain | Area | Entry point |
| --- | --- | --- |
| 00 | The AsBeez Principles | [000-index.md](00-the-asbeez-principles/000-index.md) |
| 01 | Founder Vision | [000-index.md](01-founder-vision/000-index.md) |
| 02 | Business Blueprint | [000-index.md](02-business-blueprint/000-index.md) |
| 03 | Platform Strategy | [000-index.md](03-platform-strategy/000-index.md) |
| 04 | Core Engines | [000-index.md](04-core-engines/000-index.md) |
| 05 | Industry Verticals | [000-index.md](05-industry-verticals/000-index.md) |
| 06 | Partner Platform | [000-index.md](06-partner-platform/000-index.md) |
| 07 | Marketplace | [000-index.md](07-marketplace/000-index.md) |
| 08 | Membership | [000-index.md](08-membership/000-index.md) |
| 09 | Vendor Engine | [000-index.md](09-vendor-engine/000-index.md) |
| 10 | Rewards and Loyalty | [000-index.md](10-rewards-loyalty/000-index.md) |
| 11 | Beehive Matrix | [Foundation index](11-beehive-matrix/000-foundation/000-index.md) |
| 12 | Financial System | [Overview index](12-financial-system/001-overview/000-index.md) |
| 13 | Platform Services | [AI services index](13-platform-services/ai-services/000-index.md) |
| 14 | Legal and Compliance | [index.md](14-legal-compliance/index.md) |
| 15 | Product Requirements | [index.md](15-product-requirements/index.md) |
| 16 | System Architecture | [index.md](16-system-architecture/index.md) |
| 17 | Database | [index.md](17-database/index.md) |
| 18 | API | [index.md](18-api/index.md) |
| 19 | UI and UX | [index.md](19-ui-ux/index.md) |
| 20 | Operations | [index.md](20-operations/index.md) |
| 21 | Marketing | [index.md](21-marketing/index.md) |
| 22 | Investor Relations | [index.md](22-investor-relations/index.md) |
| 23 | Architecture Decisions | [index.md](23-architecture-decisions/index.md) |
| 24 | Business Rules | [index.md](24-business-rules/index.md) |
| 25 | Standards | [index.md](25-standards/index.md) |
| 26 | Research | [index.md](26-research/index.md) |
| 27 | Assets | Folder only; contents are grouped by asset type |
| 28 | Templates | Folder only; contents are grouped by template type |

## Conceptual Dependency

```text
Principles and Founder Vision
        |
        v
Business Blueprint
        |
        v
Platform Strategy and Core Engines
        |
        +--> Industry, Partner, Marketplace, Membership, and Vendor Domains
        |
        +--> Rewards, Beehive Matrix, and Financial System
        |
        v
Legal, Requirements, Rules, and Architecture
        |
        v
Database, API, UI/UX, Operations, and Go-to-Market
```

## Documentation Principles

- Preserve one definition for each business term.
- Keep principles, business rules, architecture decisions, and implementation details in their owning domains.
- Treat legal and financial constraints as release gates, not late-stage appendices.
- Prefer configuration over duplicated country or industry implementations.
- Record immutable financial and reward history separately from derived views.
- Link claims, assumptions, and decisions to dated research or an approved decision record.

## Authority and Conflict Resolution

When documents conflict, resolve the conflict in this order:

1. Legal and compliance constraints.
2. The AsBeez Principles and explicit founder intent.
3. Approved architecture decisions and business rules.
4. Domain specifications and implementation documents.
5. Marketing, investor, and presentation materials.

Record the resolution in [Architecture Decisions](23-architecture-decisions/index.md) or [Business Rules](24-business-rules/index.md), then link the affected documents back to that record.

## Current State

The corpus is in active development. The largest completed domain is the Financial System, while several product and implementation domains contain empty entry documents or incomplete indexes. The roadmap identifies the order for resolving those gaps; file count alone does not indicate business readiness.
