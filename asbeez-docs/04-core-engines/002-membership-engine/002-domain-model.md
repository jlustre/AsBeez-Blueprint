# Domain Model

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Membership Engine |
| Document | Domain Model |
| Document ID | AEDS-ME-002 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Platform Architecture Team |

---

# Introduction

The Membership Engine Domain Model defines the business entities, relationships, rules, and concepts that govern participation within the AsBeez ecosystem.

While the Identity Engine manages digital identities, the Membership Engine manages business participation.

It defines who is a Customer, who qualifies as a Member, how Members are connected, and how participation evolves over time.

This domain model is independent of databases and implementation technologies.

It defines the language of membership.

---

# Domain Responsibility

The Membership Engine owns everything related to participation in the AsBeez ecosystem.

It is responsible for:

- Customer participation
- Membership qualification
- Membership lifecycle
- Membership status
- Sponsorship
- Referrals
- Organizational placement
- Country assignment
- Residency
- Qualification rules
- Participation eligibility
- Membership history

It does **not** own:

- Authentication
- User accounts
- Products
- Orders
- Reward calculations
- Wallets
- Payments

---

# Ubiquitous Language

| Term | Definition |
|------|------------|
| Customer | A participant with an Identity who may purchase products and services but has not yet qualified as a Member. |
| Member | A Customer who has met the qualification requirements and is eligible for membership benefits. |
| Qualified Member | A Customer who has earned at least one ABC and has officially entered the Membership Program. |
| Sponsor | The Member responsible for introducing another participant into the ecosystem. |
| Referral | A participant introduced by another participant. |
| Pending Referral | A referral awaiting activation because the sponsor has not yet qualified as a Member. |
| Membership | The business relationship between a participant and the AsBeez ecosystem. |
| Residency | The country under which a Membership operates. |
| Qualification | The business rules that determine Member eligibility. |

These definitions should be used consistently throughout the platform.

---

# Aggregate Root

The primary Aggregate Root is:

## Membership

The Membership aggregate represents a participant's business relationship with the AsBeez ecosystem.

Every Membership is associated with exactly one Identity.

An Identity may exist without a Membership.

---

# Core Domain Entities

## Membership

Represents a participant's membership record.

### Attributes

- Membership ID
- Identity ID
- Membership Number
- Participation Status
- Membership Status
- Membership Type
- Enrollment Date
- Qualification Date
- Activation Date
- Residency Country
- Sponsor ID

---

## Customer

Represents a participant who has not yet qualified as a Member.

Customers may:

- Purchase products
- Earn Reward Points
- Refer participants
- Build pending referrals

Customers do not receive Member benefits.

---

## Qualified Member

Represents a Customer who has successfully qualified.

Qualification occurs when at least one ABC has been created according to the configured country threshold.

A Qualified Member becomes eligible for:

- Membership benefits
- Referral activation
- Team participation
- Future rewards

---

## Sponsor Relationship

Represents the relationship between a Member and the participant they introduce.

Each Membership may have:

- One Sponsor
- Many Referrals

Sponsor relationships remain historically traceable.

---

## Referral

Represents a participant introduced by another participant.

Referral Statuses include:

- Pending
- Active
- Cancelled
- Archived

Pending referrals become active once qualification requirements are satisfied.

---

## Residency

Represents the country governing the Membership.

Residency determines:

- Qualification thresholds
- Local policies
- Country-specific benefits
- Compliance rules

Residency changes are tracked historically.

---

## Qualification

Represents the participant's progress toward membership.

Examples:

- Current RP
- Required RP
- ABC Count
- Qualification Status
- Qualification Date

Qualification rules are configurable by country.

---

# Value Objects

The Membership Engine uses immutable Value Objects including:

- Membership Number
- Country Code
- Membership Type
- Participation Status
- Membership Status
- Qualification Status
- Residency
- Enrollment Date

Value Objects do not exist independently.

---

# Domain Relationships

```text
                 Identity
                     │
                     ▼
               Membership
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   Qualification  Residency   Sponsor
        │                         │
        ▼                         ▼
 Qualified Member          Referrals
```

The Membership aggregate coordinates all business participation.

---

# Participation States

The Membership Engine recognizes the following participation states:

```text
Identity

      │

      ▼

Customer

      │

      ▼

Customer with Pending Referrals

      │

      ▼

Qualified Member

      │

      ▼

Active Member

      │

      ▼

Inactive Member

      │

      ▼

Archived
```

Participation reflects business engagement rather than authentication.

---

# Membership Status

Possible Membership statuses include:

- Pending Qualification
- Qualified
- Active
- Suspended
- Inactive
- Cancelled
- Archived

Only one Membership Status may exist at any time.

---

# Qualification Rules

Membership qualification follows business rules.

Current rule:

A Customer becomes a Qualified Member after earning at least one ABC.

The RP required to generate one ABC is configurable by country.

Business Rules:

- Threshold is country-specific.
- Threshold must be divisible by 12.
- Qualification occurs when the first ABC is created.
- Pending referrals activate according to platform policies.

Future qualification requirements may be added without redesigning the domain.

---

# Country Configuration

Every Membership belongs to a residency country.

Country configuration may determine:

- ABC qualification threshold
- Membership fees
- Available benefits
- Compliance requirements
- Reward programs
- Business rules

The Membership Engine reads these values from the Configuration Engine.

---

# Domain Events

Important Membership events include:

- CustomerRegistered
- ReferralRecorded
- PendingReferralCreated
- MembershipQualified
- MemberActivated
- MembershipSuspended
- ResidencyChanged
- SponsorAssigned
- MembershipArchived

These events are published through the Event Bus.

---

# Domain Boundaries

The Membership Engine collaborates with other Platform Engines while respecting ownership boundaries.

| Platform Engine | Relationship |
|-----------------|-------------|
| Identity Engine | Provides authenticated identities. |
| Rewards Engine | Publishes ABC creation events used for qualification. |
| Commerce Engine | Provides purchases that generate RP. |
| Financial Engine | Uses Membership for commissions and payouts. |
| Notification Engine | Sends membership notifications. |
| Analytics Engine | Measures participation and growth. |
| AI Engine | Predicts qualification, retention, and engagement. |

---

# AI Within the Domain

Artificial Intelligence assists by:

- Predicting qualification
- Identifying inactive Members
- Detecting referral anomalies
- Recommending engagement actions
- Forecasting retention
- Analyzing organizational health

AI supports decision-making without changing Membership status directly.

---

# Design Principles

The Membership Domain follows these principles:

- Business Participation First
- Separation of Identity and Membership
- Country Configurable
- Event-Driven
- API-First
- Configuration Over Customization
- Historical Traceability
- Global by Design

---

# Future Domain Expansion

The Membership domain should support:

- Multiple membership programs
- Industry-specific memberships
- Corporate memberships
- Family memberships
- Membership subscriptions
- Multi-country participation
- Membership portability
- AI-assisted qualification

New capabilities should extend the domain without replacing its core concepts.

---

# Closing Statement

The Membership Domain defines how participants belong to the AsBeez ecosystem.

By separating business participation from digital identity, the Membership Engine creates a flexible foundation capable of supporting global expansion, evolving qualification models, and diverse participation programs while maintaining consistency across every Platform Engine.

---

# Domain Principle

> **A Membership represents a participant's business relationship with the AsBeez ecosystem. It is earned through qualification, governed by configurable business rules, and evolves throughout the participant's journey while remaining independent of authentication and other platform capabilities.**

---

# Related Documents

- 000-index.md
- 001-overview.md
- 003-membership-lifecycle.md
- 004-country-residency.md
- 005-referrals-sponsorship.md
- 006-qualifications.md
- 007-membership-policies.md *(Future)*
- 008-api.md
- 009-events.md
- 010-ai-capabilities.md
- 011-future-roadmap.md

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Domain Model for the Membership Engine. |