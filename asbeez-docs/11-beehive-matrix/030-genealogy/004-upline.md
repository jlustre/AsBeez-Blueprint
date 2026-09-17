# Upline Relationships

> **Document:** 11-beehive-matrix/030-genealogy/004-upline.md

---

# Overview

The **Upline Relationship Model** defines the complete chain of Business Cells located above a specific **AsBeez Business Cell (ABC)** within the Beehive Matrix genealogy.

An **upline** consists of every ancestor beginning with the immediate parent and extending upward through successive generations until reaching the Matrix Root.

The upline is one of the most important concepts within the Beehive Matrix because it determines:

- reward eligibility
- reward distribution
- hierarchy navigation
- genealogy reporting
- lineage verification
- AI relationship analysis
- historical reconstruction

Unlike referral relationships, an upline is determined solely by **genealogical placement** and never changes once established.

---

# Purpose

The Upline Model exists to:

- define ancestor relationships
- support reward distribution
- enable genealogy traversal
- simplify reporting
- preserve historical hierarchy
- support auditing
- assist AI analysis
- maintain structural integrity

---

# Business Philosophy

Every Business Cell stands upon the Business Cells that came before it.

Its upline represents the chain of ancestors that forms its permanent lineage.

This relationship is not based on referrals, sponsorship, or ownership.

It is based entirely on **genealogical placement**.

---

# Design Principles

## Immutable

The upline never changes after placement.

---

## Deterministic

Every Business Cell has exactly one unique upline.

---

## Ordered

The upline is stored in ascending ancestor order.

---

## Permanent

Historical uplines remain unchanged forever.

---

## Country Isolated

Uplines never cross country matrices.

---

## Event Driven

Every upline relationship originates from immutable placement events.

---

## Replayable

The complete upline can always be reconstructed through event replay.

---

# Definition

For any Business Cell:

```text
Current Business Cell

↓

Immediate Parent

↓

Grandparent

↓

Great Grandparent

↓

...

↓

Matrix Root
```

This complete chain is called the **Upline**.

---

# Immediate Upline

The first member of the upline is always:

```text
Immediate Parent
```

Example:

```text
ABC-250

↓

Parent

ABC-083
```

ABC-083 is the immediate upline.

---

# Complete Upline

Example:

```text
ROOT

↓

ABC-2

↓

ABC-17

↓

ABC-81

↓

ABC-250
```

The upline of ABC-250 is:

- ABC-81
- ABC-17
- ABC-2
- ROOT

---

# Unique Path Rule

Every Business Cell has exactly one path to the Root.

Example:

```text
ABC-600

↓

ABC-201

↓

ABC-70

↓

ABC-18

↓

ROOT
```

There can never be multiple uplines.

---

# Upline Levels

Each ancestor occupies an upline level.

| Upline Level | Relationship |
|--------------|--------------|
| Level 1 | Parent |
| Level 2 | Grandparent |
| Level 3 | Great Grandparent |
| Level 4 | Fourth Ancestor |
| ... | ... |
| Level N | nth Ancestor |

Levels never change.

---

# Upline vs Referral

These concepts are completely different.

| Upline | Referral |
|---------|----------|
| Based on placement | Based on invitation |
| Permanent | Independent relationship |
| Determines reward flow | Determines referral qualification |
| Genealogy relationship | Marketing relationship |
| Immutable | May exist without genealogy |

A referring member is not necessarily part of the Business Cell's upline.

---

# Upline Example

```text
               ROOT

                 │

             ABC-001

                 │

             ABC-010

                 │

             ABC-045

                 │

             ABC-200
```

For ABC-200:

| Level | Business Cell |
|--------|---------------|
| 1 | ABC-045 |
| 2 | ABC-010 |
| 3 | ABC-001 |
| 4 | ROOT |

---

# Reward Distribution

When a new Business Cell is created:

```text
New Business Cell

↓

Immediate Parent

↓

Next Ancestor

↓

Next Ancestor

↓

...

↓

Qualified Levels
```

The Reward Engine traverses the upline to determine eligible recipients.

---

# Qualified Upline

Only qualified ancestors receive rewards.

Example:

```text
ABC-700 Created

↓

Traverse Upline

↓

Qualified?

↓

Yes

↓

Reward
```

If an ancestor is not eligible according to business rules, the Reward Engine applies the configured distribution policy (such as skip, hold, or company allocation).

---

# Upline Traversal

Traversal always proceeds upward.

```text
Current Node

↓

Parent

↓

Grandparent

↓

Great Grandparent

↓

Root
```

Traversal stops when:

- configured reward depth is reached
- Matrix Root is reached
- business rules terminate processing

---

# Traversal Algorithms

Supported algorithms include:

- iterative traversal
- recursive traversal
- breadth-aware traversal
- cached traversal
- event replay traversal

Traversal remains deterministic.

---

# Relationship Persistence

Each upline relationship stores:

| Property | Description |
|----------|-------------|
| Business Cell ID | Current node |
| Ancestor ID | Upline Business Cell |
| Upline Level | Distance from current node |
| Matrix ID | Matrix |
| Country | Country |
| Relationship Timestamp | Creation date |

---

# Upline Snapshot

Example:

```text
Business Cell

ABC-350

↓

Snapshot

Parent

ABC-120

↓

Grandparent

ABC-050

↓

Great Grandparent

ABC-011

↓

Root
```

Snapshots accelerate reporting while remaining rebuildable.

---

# Country Isolation

Example:

```text
USA Matrix

↓

USA Upline
```

and

```text
Canada Matrix

↓

Canada Upline
```

Cross-country uplines are prohibited.

---

# Integrity Rules

The Genealogy Engine guarantees:

- exactly one upline path
- no duplicate ancestors
- no circular references
- immutable lineage
- valid parent chain
- deterministic traversal

---

# Validation

Before persistence:

The engine verifies:

- parent exists
- ancestor chain is valid
- no loops
- correct generation numbering
- same country
- same matrix

---

# Event Flow

```text
Business Cell Created

↓

Placement Completed

↓

Parent Assigned

↓

Upline Calculated

↓

Relationship Stored

↓

Projection Updated
```

---

# Domain Events

Representative events include:

- ParentAssigned
- UplineCalculated
- UplineValidated
- UplineProjectionUpdated
- UplineSnapshotCreated
- GenealogyRebuilt

---

# Reporting

The upline powers reports including:

- ancestor lists
- genealogy reports
- reward lineage
- reward qualification
- hierarchy depth
- branch summaries
- matrix reports

---

# AI Integration

Artificial Intelligence analyzes uplines for:

- reward forecasting
- genealogy optimization
- anomaly detection
- structural analysis
- fraud detection
- branch health
- growth prediction
- earning potential

---

# Administrative Capabilities

Authorized administrators may:

- inspect uplines
- visualize ancestor chains
- replay genealogy
- validate hierarchy
- export lineage
- analyze reward flow

Historical uplines cannot be edited.

---

# APIs

Representative endpoints:

```text
GET /genealogy/{id}/upline

GET /genealogy/{id}/upline/summary

GET /genealogy/{id}/upline/tree

GET /genealogy/{id}/upline/levels

GET /genealogy/{id}/reward-path

GET /genealogy/{id}/ancestors
```

---

# Performance

The Upline Engine supports:

- indexed ancestor lookup
- cached ancestor chains
- asynchronous projections
- replayable reconstruction
- distributed traversal
- millions of hierarchy queries

---

# Business Benefits

## Members

- transparent reward lineage
- understandable genealogy
- permanent historical hierarchy
- reward visibility

---

## Administrators

- simplified investigations
- reward validation
- genealogy auditing
- hierarchy verification

---

## Developers

- deterministic ancestor traversal
- scalable hierarchy queries
- immutable genealogy
- replayable architecture

---

## AI Systems

- branch intelligence
- reward forecasting
- genealogy optimization
- anomaly detection

---

# Best Practices

- Never modify an established upline.
- Traverse uplines only through immutable genealogy.
- Cache ancestor chains for read-heavy operations.
- Keep reward calculations independent of genealogy storage.
- Validate every ancestor chain before persistence.
- Prevent circular relationships.
- Preserve country isolation.
- Rebuild projections from immutable events when necessary.
- Maintain deterministic traversal logic.
- Treat the upline as a permanent historical record.

---

# Related Documents

- 000-index.md
- 001-overview.md
- 002-tree-structure.md
- 003-parent-child.md
- 005-downline.md
- 006-ancestor-traversal.md
- 007-descendant-traversal.md
- 008-tree-queries.md
- 009-tree-visualization.md
- 010-integrity-validation.md
- 011-reporting.md
- 012-events.md
- 013-ai-capabilities.md
- 014-performance.md
- 015-future-roadmap.md

---

# Summary

The Upline Relationship Model defines the complete and immutable chain of ancestors above every AsBeez Business Cell within the Beehive Matrix. Beginning with the immediate parent and extending to the Matrix Root, the upline serves as the authoritative pathway for reward distribution, genealogy traversal, reporting, auditing, and AI analysis. Through deterministic placement, strict validation, event-driven persistence, and country-specific isolation, the Upline Engine guarantees that every Business Cell maintains a permanent, transparent, and fully auditable ancestral lineage throughout the lifetime of the AsBeez ecosystem.