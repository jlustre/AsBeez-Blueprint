# Qualifications

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Membership Engine |
| Document | Qualifications |
| Document ID | AEDS-ME-006 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Membership Platform Team |

---

# Introduction

The Qualification subsystem defines the business rules that determine when a Customer becomes a Qualified Member of the AsBeez ecosystem.

Qualification is one of the most important business events in the platform.

Registration does not create a Membership.

Qualification creates a Membership.

This distinction ensures that Membership represents demonstrated participation rather than simple account creation.

---

# Purpose

The Qualification subsystem exists to:

- Define Membership eligibility.
- Establish qualification requirements.
- Support country-specific qualification policies.
- Ensure fair participation.
- Maintain a consistent qualification process.
- Enable future qualification models without changing platform architecture.

---

# Guiding Principle

> **Membership is earned through measurable participation, not granted through registration.**

---

# Qualification Model

Every participant follows the same business journey.

```text
Visitor
    │
    ▼
Identity
    │
    ▼
Customer
    │
    ▼
Customer with Pending Referrals
    │
    ▼
Qualification Achieved
    │
    ▼
Qualified Member
    │
    ▼
Active Member
```

Only Qualified Members participate in the Membership Program.

---

# Qualification Requirements

A Customer becomes a Qualified Member after satisfying all required qualification criteria.

## Current Qualification Rule

The Customer must earn at least **one (1) ABC**.

No Membership is created before this milestone.

---

# ABC Qualification

ABC is the qualifying unit used by the Membership Engine.

The Rewards Engine is responsible for creating ABCs.

The Membership Engine recognizes the creation of the first ABC as the qualification event.

Business Event:

```text
ABCCreated
        │
        ▼
MembershipQualified
```

---

# Country-Based Qualification

The Reward Points (RP) required to create one ABC are configurable by country.

Examples:

| Country | RP Required |
|----------|------------:|
| United States | 120 |
| Canada | 60 |
| Philippines | 36 |

Additional countries may define different thresholds.

---

# Qualification Rule

The RP threshold:

- Is configurable.
- Is country-specific.
- Must always be divisible by **12**.

Examples of valid values:

- 24
- 36
- 48
- 60
- 72
- 84
- 96
- 108
- 120
- 144

This ensures whole-number reward calculations throughout the platform.

---

# Why Divisible by Twelve?

Using values divisible by twelve provides:

- Whole-number calculations
- No fractional ABC values
- Consistent accounting
- Easier auditing
- Simpler reporting

This requirement applies globally.

---

# Pending Referrals

Customers may begin referring participants before qualifying.

Those referrals remain attached to the Customer.

Status:

```text
Pending Referral
```

Pending referrals are preserved.

They become active according to platform policy once the Customer qualifies.

---

# Membership Activation

Qualification alone does not perform every business action.

Instead, qualification publishes business events.

Example:

```text
Customer

      │

Earn RP

      │

ABC Created

      │

Membership Qualified

      │

Member Activated

      │

Pending Referrals Activated

      │

Member Benefits Enabled
```

Each Platform Engine reacts independently.

---

# Qualification States

Possible qualification states include:

- Not Qualified
- In Progress
- Qualified
- Disqualified (future)
- Expired (future)

Only one Qualification State may exist at a time.

---

# Business Rules

## Q-001

Registration creates an Identity.

It does not create a Membership.

---

## Q-002

Every authenticated participant begins as a Customer.

---

## Q-003

Customers may purchase products and services.

---

## Q-004

Customers may refer other participants.

---

## Q-005

Customers are not Members.

---

## Q-006

Customers become Qualified Members only after earning at least one ABC.

---

## Q-007

The Rewards Engine creates ABCs.

The Membership Engine recognizes qualification.

---

## Q-008

ABC qualification thresholds are configurable by country.

---

## Q-009

ABC thresholds must always be divisible by twelve.

---

## Q-010

Pending referrals are preserved until qualification.

---

## Q-011

Pending referrals become eligible for activation after qualification according to platform policy.

---

## Q-012

Qualification rules should be configurable whenever possible.

---

# Qualification Progress

The Membership Engine tracks qualification progress.

Examples:

- Current RP
- Required RP
- Remaining RP
- ABC Earned
- Estimated Qualification Date

This information supports participant dashboards and AI recommendations.

---

# Qualification Events

The Qualification subsystem publishes:

- QualificationStarted
- QualificationProgressUpdated
- ABCThresholdReached
- MembershipQualified
- MemberActivated

These events enable other Platform Engines to respond independently.

---

# Responsibilities

The Membership Engine is responsible for:

- Qualification rules
- Qualification status
- Qualification history
- Membership eligibility

The Rewards Engine is responsible for:

- RP accumulation
- ABC calculation
- ABC creation

The two engines collaborate through business events.

---

# AI Assistance

Artificial Intelligence may assist by:

- Predicting qualification dates.
- Recommending qualifying purchases.
- Identifying stalled Customers.
- Forecasting Member conversion.
- Recommending engagement activities.

AI does not qualify Members.

Only platform business rules determine qualification.

---

# Future Expansion

Future qualification models may include:

- Multiple Membership Programs
- Industry-specific qualifications
- Subscription requirements
- Certification requirements
- Compliance requirements
- Business performance requirements

New requirements should extend the qualification model without redesigning the platform.

---

# Long-Term Vision

Qualification should evolve into a configurable rules engine capable of supporting multiple countries, industries, membership programs, and future business models.

Business administrators should be able to adjust qualification policies through configuration rather than software development.

---

# Closing Statement

Qualification represents the transition from participation to Membership.

By requiring measurable engagement before Membership is granted, the AsBeez Platform creates a fair, transparent, and globally adaptable participation model.

This document serves as the authoritative definition of Membership eligibility across the entire ecosystem.

---

# Guiding Principle

> **Membership is earned through measurable participation. Qualification is governed by configurable business rules that recognize meaningful engagement while supporting global flexibility, fairness, and long-term platform sustainability.**

---

# Related Documents

- 002-domain-model.md
- 003-membership-lifecycle.md
- 004-country-residency.md
- 005-referrals-sponsorship.md
- Rewards Engine – RP Engine
- Rewards Engine – ABC Engine
- Rewards Engine – Business Events

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial qualification architecture for the Membership Engine. |