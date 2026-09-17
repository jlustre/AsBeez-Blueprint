# Terminology

> **Document:** 11-beehive-matrix/000-foundation/005-terminology.md

---

# Introduction

This document defines the official terminology used throughout the **Beehive Matrix Engine**.

These definitions establish a common language for:

- Business stakeholders
- Product Managers
- Software Engineers
- QA Engineers
- Financial Analysts
- AI Engineers
- Customer Support
- Documentation Teams
- Third-party Integrators
- Auditors

Every document within the Beehive Matrix module should use these terms consistently.

Whenever ambiguity exists, the definitions in this document take precedence.

---

# A

## ABC (AsBeez Business Cell)

The fundamental earning unit within the Beehive Matrix.

An ABC is created automatically when a member accumulates the required Reward Points (RP) threshold for their country.

Characteristics:

- Unique identifier
- Permanently assigned
- Country-specific
- Immutable identity
- Independently participates in the matrix
- Can receive AHC

A member may own unlimited ABCs.

---

## ABC Creation

The automated process of converting accumulated Reward Points into one or more Business Cells.

ABC creation occurs only after validation of all business rules.

---

## ABC Generation Threshold

The minimum Reward Points required to generate one Business Cell.

Example:

United States

120 RP

↓

1 ABC

Thresholds are configurable by country.

---

## ABC Lifecycle

The complete sequence of states through which a Business Cell progresses.

Typical lifecycle:

```text
Generated

↓

Validated

↓

Placed

↓

Qualified

↓

Active

↓

Inactive (if applicable)

↓

Archived
```

---

## AHC (AsBeez Hive Credits)

The reward units distributed throughout the Beehive Matrix.

AHC represents the financial value earned by qualified Business Cells.

AHC characteristics:

- Immutable
- Append-only
- Auditable
- Wallet compatible
- Country-specific accounting

---

## Ancestor

Any Business Cell located above another Business Cell within the genealogy hierarchy.

Ancestors may qualify to receive AHC distributions.

---

## Audit Trail

The permanent record of every financial and operational event performed by the Beehive Matrix Engine.

Audit records are never deleted.

---

# B

## Beehive Matrix

The structured compensation network that organizes Business Cells into a predefined hierarchy.

Default configuration:

- Width: 3
- Depth: 12

Every country maintains an independent Beehive Matrix.

---

## Breadth-First Placement

A placement strategy that fills the current matrix level before creating positions on deeper levels.

The default placement algorithm may use breadth-first traversal unless otherwise configured.

---

## Business Cell

See **ABC (AsBeez Business Cell).**

---

## Business Rule

A configurable policy that governs system behavior.

Examples include:

- RP thresholds
- Qualification rules
- Referral unlock levels
- Distribution percentages

Business rules should be configuration-driven whenever possible.

---

# C

## Child Node

A Business Cell directly positioned beneath another Business Cell.

A parent may have multiple child nodes depending on matrix width.

---

## Company Holding Account

A system-owned account that temporarily receives AHC when no qualified Business Cell exists to receive the distribution.

The account preserves financial integrity and ensures every generated liability is accounted for.

---

## Compression

A logical process that bypasses inactive or ineligible Business Cells during reward distribution while preserving historical records.

Compression does not delete data.

---

## Configuration

A collection of business settings controlling matrix behavior without requiring software code changes.

---

## Country Matrix

An independent Beehive Matrix belonging to a single country.

Country matrices never merge.

Each country may define:

- RP threshold
- Tax rules
- Distribution settings
- Compliance policies

---

# D

## Descendant

Any Business Cell located below another Business Cell within the matrix hierarchy.

---

## Deterministic Algorithm

An algorithm that always produces the same result given identical inputs.

All financial calculations within the Beehive Matrix should be deterministic.

---

## Distribution

The allocation of AHC from a newly created Business Cell to qualified ancestor Business Cells.

---

## Distribution Event

A domain event representing the successful allocation of AHC.

Example:

```text
AHCDistributed
```

---

# E

## Economic Activity

Any qualifying commercial transaction that contributes toward Reward Point generation.

Examples:

- Product purchase
- Service purchase
- Subscription
- Marketplace transaction

---

## Event

An immutable record describing something that has already occurred.

Examples:

- BusinessCellGenerated
- BusinessCellPlaced
- AHCDistributed

---

## Event Sourcing

An architectural pattern where system state is reconstructed from historical events.

Selected Beehive Matrix components may implement event sourcing.

---

# F

## Financial Liability

The company's obligation to distribute earned AHC according to published business rules.

---

## Forced Matrix

A matrix structure with predefined width and depth.

The default Beehive Matrix is a **3 × 12 forced matrix**.

---

# G

## Genealogy

The complete relationship hierarchy among Business Cells.

Includes:

- parent
- child
- ancestor
- descendant
- sponsor
- placement

---

## Generation

The process of creating a new Business Cell after sufficient Reward Points have accumulated.

---

# H

## Holding Account

See **Company Holding Account**.

---

## Horizontal Scaling

The ability to increase system capacity by adding additional servers or computing resources.

The Beehive Matrix is designed for horizontal scalability.

---

# I

## Immutable Ledger

An append-only financial ledger.

Transactions are never modified.

Corrections are performed through adjustment entries.

---

## Inactive Business Cell

A Business Cell temporarily unable to participate in reward distribution due to business rules.

Historical ownership remains unchanged.

---

## Inheritance

The authorized transfer of Business Cell ownership following the death of a member according to approved beneficiary policies.

---

# L

## Ledger

A permanent financial record of transactions.

Examples:

- RP Ledger
- AHC Ledger
- Wallet Ledger

---

## Level

The distance between a Business Cell and another Business Cell within the matrix.

Example:

Root

↓

Level 1

↓

Level 2

↓

Level 3

---

## Liability

See **Financial Liability**.

---

# M

## Matrix Capacity

The maximum number of Business Cells supported by a matrix.

Default:

```text
3 × 12

797,161 Business Cells
```

---

## Matrix Node

A physical position within the Beehive Matrix occupied by exactly one Business Cell.

---

## Matrix Placement

The assignment of a Business Cell to a matrix node.

Placement occurs only once.

---

## Member

A registered participant within the AsBeez ecosystem.

Members may own multiple Business Cells.

---

## Migration

The movement of a member from one country to another according to approved business policies.

Historical Business Cells remain associated with their original country unless migration policies explicitly define otherwise.

---

# N

## Node

A position within the Beehive Matrix.

Each node contains:

- one Business Cell
- parent reference
- child references
- level
- placement metadata

---

# P

## Parent Node

The Business Cell immediately above another Business Cell.

---

## Placement

The process of assigning a Business Cell to its permanent location within the matrix.

---

## Placement Algorithm

The deterministic logic used to determine matrix positions.

---

## Placement Order

The sequence in which Business Cells enter the matrix.

---

## Promotion

A temporary business campaign that may alter qualification or reward rules.

Promotions remain configuration-driven.

---

# Q

## Qualified Business Cell

A Business Cell meeting all conditions necessary to receive AHC distributions.

---

## Qualified Referral

A referral that satisfies the platform's requirements for unlocking additional qualified matrix levels.

---

## Qualified Level

A matrix level eligible to receive AHC based on referral qualification rules.

---

## Qualifying Purchase

A marketplace transaction eligible to generate Reward Points.

Not every purchase necessarily qualifies.

---

# R

## Referral

A relationship where one member introduces another to the platform.

Referrals unlock earning potential but do not directly generate compensation.

---

## Referral Unlock Rule

The business rule determining how many matrix levels become eligible based on qualified referrals.

---

## Reward Points (RP)

Units representing accumulated marketplace value.

RP are converted into Business Cells once country thresholds are reached.

RP are not currency.

---

## Roll-Up

A process that redirects AHC to the next qualified Business Cell when an intermediate Business Cell is ineligible.

---

# S

## Sponsor

The member responsible for referring another member into the platform.

Sponsor relationships are independent of matrix placement.

---

## Spillover

The placement of Business Cells beneath another Business Cell when direct positions are already occupied.

Spillover follows deterministic placement rules.

---

## State Transition

A change from one Business Cell lifecycle state to another.

Example:

Generated

↓

Placed

↓

Qualified

---

# T

## Threshold

A configurable requirement that must be satisfied before a business event occurs.

Examples:

- RP threshold
- Referral threshold
- Withdrawal threshold

---

## Transaction

A recorded business event affecting one or more ledgers.

Transactions are immutable.

---

## Tree

The complete hierarchical representation of the Beehive Matrix.

---

# U

## Upline

All ancestor Business Cells above another Business Cell within the matrix.

Uplines may qualify for AHC distributions.

---

# V

## Validation

The process of verifying that business rules have been satisfied before an operation proceeds.

Examples:

- ABC generation
- Placement
- Distribution
- Withdrawal

---

## Vector (Analytics)

A multidimensional data representation used by AI models for forecasting and recommendations.

Not to be confused with matrix nodes.

---

# W

## Wallet

The financial account where finalized AHC balances are stored.

Wallets receive completed distributions but do not calculate rewards.

---

## Width

The maximum number of direct child positions beneath each Business Cell.

Default:

```text
Width = 3
```

---

# Cross-Module Terminology

The following concepts originate from other engines but are heavily referenced within the Beehive Matrix.

| Term | Primary Engine |
|-------|----------------|
| Member | Membership Engine |
| Marketplace | Marketplace Engine |
| Vendor | Vendor Engine |
| Wallet | Wallet Engine |
| Reward Points | Rewards & Loyalty Engine |
| Financial Ledger | Financial Governance |
| Notification | Notification Engine |
| AI Agent | AI Engine |
| Audit Log | Administration Framework |

---

# Reserved Terms

The following terminology should always retain their exact capitalization throughout the platform.

- AsBeez
- Beehive Matrix
- Business Cell
- ABC
- Reward Points
- RP
- AsBeez Hive Credits
- AHC
- Company Holding Account
- Wallet
- Marketplace
- Country Matrix

---

# Naming Conventions

The following naming conventions should be used consistently.

| Preferred | Avoid |
|-----------|-------|
| Business Cell | Cell |
| Beehive Matrix | Matrix Tree |
| Reward Points | Reward Tokens |
| AHC | Credits |
| Country Matrix | National Tree |
| Qualified Business Cell | Active Node |
| Company Holding Account | Company Wallet |

---

# Documentation Standards

All future Beehive Matrix documents should:

- Use these definitions consistently.
- Avoid introducing conflicting terminology.
- Reference existing terms rather than redefining them.
- Maintain capitalization standards.
- Preserve financial terminology accuracy.

---

# Summary

The terminology defined in this document establishes the official business language of the Beehive Matrix Engine. By providing precise definitions for Business Cells, Reward Points, Beehive Matrices, AHC distributions, genealogy, placement, qualification, financial governance, and supporting concepts, this glossary ensures consistent communication across business, engineering, finance, AI, compliance, documentation, and customer support teams.

Maintaining a single authoritative vocabulary reduces ambiguity, improves documentation quality, simplifies software implementation, and strengthens the long-term maintainability of the AsBeez ecosystem.