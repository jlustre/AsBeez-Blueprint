# Referrals & Sponsorship

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Membership Engine |
| Document | Referrals & Sponsorship |
| Document ID | AEDS-ME-005 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Membership Platform Team |

---

# Introduction

The Referrals & Sponsorship subsystem manages the business relationships that connect participants within the AsBeez ecosystem.

These relationships define how participants enter the ecosystem, who introduced them, and how organizational structures are established.

The Membership Engine owns these relationships.

It does **not** calculate commissions, rewards, or financial benefits derived from them.

---

# Purpose

The Referrals & Sponsorship subsystem exists to:

- Record sponsor relationships.
- Record referral relationships.
- Preserve organizational history.
- Support qualification.
- Support genealogy.
- Support future organizational structures.
- Provide relationship data to other Platform Engines.

---

# Guiding Principle

> **Relationships belong to the Membership Engine. Rewards belong to the Rewards Engine.**

---

# Business Definitions

## Sponsor

A Sponsor is the Qualified Member responsible for introducing another participant into the AsBeez ecosystem.

Every Membership has at most one Sponsor.

A Sponsor relationship is permanent unless changed through an approved administrative process.

---

## Referral

A Referral is a participant introduced by another participant.

Referrals establish organizational relationships.

Referral relationships are preserved permanently.

---

## Customer Referral

Customers may refer other participants before becoming Qualified Members.

Those referrals are accepted and recorded.

However, they remain in a Pending Referral state.

---

## Pending Referral

A Pending Referral is a valid referral that cannot yet participate fully because the referring Customer has not yet qualified as a Member.

Pending referrals are never discarded.

They remain attached to the Customer until qualification occurs.

---

# Referral Lifecycle

```text
Customer

      │

Refers Participant

      │

Pending Referral

      │

Customer Qualifies

      │

Referral Activated

      │

Historical Relationship
```

---

# Sponsorship Lifecycle

```text
Qualified Member

        │

Sponsors Customer

        │

Customer Registered

        │

Customer Qualified

        │

Member Activated

        │

Permanent Sponsor Relationship
```

---

# Relationship Rules

The Membership Engine governs the following business rules.

---

## Rule 1

Every participant may have only one Sponsor.

---

## Rule 2

A Sponsor relationship is permanent.

Administrative exceptions require audit approval.

---

## Rule 3

Customers may refer participants before becoming Members.

---

## Rule 4

Those referrals remain Pending until qualification.

---

## Rule 5

Qualification occurs only after at least one ABC has been created.

---

## Rule 6

Once qualification occurs, Pending Referrals become Active according to platform policy.

---

## Rule 7

Referral activation does not require re-registration.

The original referral relationship is preserved.

---

# Relationship Types

The Membership Engine recognizes multiple relationship types.

Current relationships include:

- Sponsor
- Referral
- Organizational Parent
- Organizational Child

Future relationships may include:

- Mentor
- Coach
- Team Leader
- Corporate Sponsor

The architecture should support future expansion without redesign.

---

# Organizational Structure

The Membership Engine stores organizational relationships.

Example:

```text
Alice

 ├── Bob

 │     ├── David

 │     └── Emma

 └── Carol

       ├── Frank

       └── Grace
```

The Membership Engine owns this structure.

Other Platform Engines consume it.

---

# Organizational History

Relationships should be historically traceable.

Examples include:

- Sponsor assigned
- Referral recorded
- Referral activated
- Organizational transfer
- Administrative correction

History is immutable.

---

# Domain Ownership

The Membership Engine owns:

- Sponsor relationships
- Referral relationships
- Organizational hierarchy
- Pending referrals
- Relationship history

The Membership Engine does **not** own:

- RP calculations
- ABC creation
- AHC calculations
- Commission calculations
- Financial payouts

Those responsibilities belong to the Rewards and Financial Engines.

---

# Business Events

The subsystem publishes events such as:

- SponsorAssigned
- ReferralRecorded
- PendingReferralCreated
- ReferralActivated
- SponsorChanged
- OrganizationalRelationshipUpdated

These events enable other Platform Engines to react independently.

---

# Country Considerations

Referral policies may vary by country.

Examples include:

- Qualification requirements
- Eligibility rules
- Sponsor restrictions
- Compliance requirements

Country-specific policies should be configurable.

---

# AI Capabilities

Artificial Intelligence may assist by:

- Detecting duplicate referrals.
- Detecting referral fraud.
- Identifying organizational anomalies.
- Predicting qualification.
- Recommending sponsorship improvements.
- Monitoring organizational health.

AI assists but does not modify relationships directly.

---

# Future Expansion

The subsystem should support:

- Multiple sponsorship programs
- Corporate sponsorship
- Cross-country sponsorship
- Team leadership structures
- Mentor relationships
- Community groups
- Industry-specific organizational models

These capabilities should extend the existing relationship model.

---

# Closing Statement

Referrals and Sponsorship form the social structure of the AsBeez ecosystem.

By separating relationship management from rewards and financial calculations, the Membership Engine provides a stable and reusable organizational foundation that can support future industries, countries, and business models.

---

# Guiding Principle

> **The Membership Engine owns relationships, not compensation. Every sponsorship and referral represents a permanent business relationship that other Platform Engines may use to calculate rewards, qualifications, and participation while preserving a single source of truth for organizational structure.**

---

# Related Documents

- 002-domain-model.md
- 003-membership-lifecycle.md
- 004-country-residency.md
- 006-qualifications.md
- Rewards Engine – RP Engine
- Rewards Engine – ABC Engine
- Rewards Engine – Compensation Engine

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Referrals & Sponsorship architecture. |