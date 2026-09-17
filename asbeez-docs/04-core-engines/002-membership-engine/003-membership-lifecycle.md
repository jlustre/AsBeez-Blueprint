# Membership Lifecycle

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Membership Engine |
| Document | Membership Lifecycle |
| Document ID | AEDS-ME-003 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Platform Architecture Team |

---

# Introduction

The Membership Lifecycle defines the business journey of a participant within the AsBeez ecosystem.

Unlike the Identity Lifecycle, which manages digital identities, the Membership Lifecycle governs how a participant progresses from being a Customer to becoming a Qualified Member and continues throughout their participation in the platform.

Membership is not created during registration.

Membership is earned through qualification.

---

# Purpose

The Membership Lifecycle exists to:

- Define the stages of participation.
- Establish qualification rules.
- Govern membership transitions.
- Preserve business consistency.
- Support country-specific policies.
- Provide a common lifecycle across all industries.

---

# Guiding Principle

> **Identity provides access. Participation creates opportunity. Qualification creates Membership.**

---

# Lifecycle Overview

```text
Visitor
    │
    ▼
Identity Registered
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
 ┌──┼───────────────┐
 ▼  ▼               ▼
Suspended   Inactive   Country Transfer
 │               │            │
 └──────┬────────┴────────────┘
        ▼
 Reactivated
        │
        ▼
 Archived
```

---

# Lifecycle Stages

## 1. Visitor

A person who has not yet registered.

### Typical Activities

- Browse public content
- View products
- Learn about AsBeez

No Identity exists.

---

## 2. Identity Registered

The participant has created an account through the Identity Engine.

The participant can:

- Log in
- Manage their profile
- Access customer features

At this stage they are **not** a Customer until they engage with the platform according to business rules.

---

## 3. Customer

A Customer is an authenticated participant who may:

- Purchase products
- Purchase services
- Earn Reward Points (RP)
- Refer others
- Build a referral network

A Customer is **not** a Member.

Member benefits are unavailable.

---

## 4. Customer with Pending Referrals

Customers may begin referring others before qualifying as Members.

The platform records these referrals.

However:

- Referral relationships remain pending.
- Member-specific benefits are not activated.
- Organizational calculations follow platform policy.
- Qualification has not yet occurred.

Pending referrals remain attached to the Customer.

---

## 5. Qualified Member

A Customer becomes a Qualified Member after meeting the platform's qualification requirements.

### Current Qualification Rule

The Customer must earn at least one ABC.

The Reward Points (RP) required to generate an ABC are configurable by country.

The threshold must always be divisible by twelve.

Examples:

| Country | RP Required |
|----------|------------:|
| Country A | 120 |
| Country B | 60 |
| Country C | 36 |

The Rewards Engine creates the ABC.

The Membership Engine recognizes the qualification.

---

## 6. Active Member

Once qualified, the participant becomes an Active Member.

The platform activates:

- Membership benefits
- Referral eligibility
- Organizational participation
- Member privileges
- Country-specific programs

Pending referrals are processed according to platform policies.

---

## 7. Suspended

Membership may be temporarily suspended.

Examples:

- Policy violations
- Fraud investigation
- Administrative action
- Compliance review

Historical data is preserved.

---

## 8. Inactive

A Member who is no longer actively participating.

Examples:

- No recent activity
- No qualifying activity
- Voluntary inactivity

Inactive Members retain historical records.

Platform policies determine which benefits remain available.

---

## 9. Country Transfer

A Member may permanently relocate.

The Membership Engine updates:

- Residency
- Country configuration
- Qualification rules (where applicable)
- Local benefits
- Compliance requirements

Historical residency remains auditable.

---

## 10. Reactivated

Suspended or inactive Members may return.

Reactivation requirements are defined by platform policy.

Examples include:

- Identity verification
- Compliance review
- Outstanding requirements
- Administrative approval

---

## 11. Archived

Membership ends.

Archived Memberships:

- Cannot participate.
- Cannot receive benefits.
- Cannot sponsor new Members.
- Retain complete historical records.

Historical information is preserved for auditing and reporting.

---

# Qualification Transition

The most important lifecycle transition is qualification.

```text
Customer

      │

Earn RP

      │

ABC Created

      │

Membership Qualified

      │

Active Member
```

Membership is activated only after qualification.

---

# Pending Referral Transition

```text
Customer

      │

Refers Participant

      │

Pending Referral

      │

ABC Created

      │

Membership Qualified

      │

Referral Activated
```

Pending referrals are never lost.

They become eligible according to platform policies after qualification.

---

# Lifecycle Events

The Membership Lifecycle publishes business events.

Examples include:

- CustomerCreated
- ReferralRecorded
- PendingReferralCreated
- MembershipQualified
- MembershipActivated
- MembershipSuspended
- MembershipReactivated
- MembershipArchived
- ResidencyChanged

These events allow other Platform Engines to react independently.

---

# Country Configuration

Country-specific configuration may affect:

- RP threshold for one ABC
- Membership policies
- Qualification requirements
- Available benefits
- Compliance rules

Business rules remain configurable rather than hard-coded.

---

# AI Assistance

The AI Engine may assist by:

- Predicting qualification
- Identifying disengaged Customers
- Recommending actions to reach qualification
- Forecasting Member retention
- Detecting abnormal referral activity

AI supports the lifecycle but does not change participant status.

---

# Success Metrics

The Membership Lifecycle should be measured by:

- Customer → Member conversion rate
- Average time to qualification
- Pending referral activation rate
- Active Member retention
- Country participation
- Membership growth
- Reactivation rate

---

# Long-Term Vision

The Membership Lifecycle should evolve to support:

- Multiple membership programs
- Industry-specific qualification models
- Corporate memberships
- Family memberships
- Membership subscriptions
- Country-specific lifecycle rules
- AI-guided onboarding

The lifecycle should remain flexible while preserving the principle that Membership is earned through qualification.

---

# Closing Statement

The Membership Lifecycle defines how participants become part of the AsBeez ecosystem.

By separating Customers from Members and requiring measurable qualification before Membership is granted, the platform creates a fair, transparent, and globally adaptable participation model.

This lifecycle provides the foundation for every referral, reward, qualification, and long-term relationship within the ecosystem.

---

# Lifecycle Principle

> **Every participant follows a clearly defined journey from Customer to Qualified Member. Membership is earned through qualification, governed by configurable business rules, and supported by a transparent lifecycle that balances fairness, sustainability, and global scalability.**

---

# Related Documents

- 000-index.md
- 001-overview.md
- 002-domain-model.md
- 004-country-residency.md
- 005-referrals-sponsorship.md
- 006-qualifications.md
- 008-api.md
- 009-events.md
- 010-ai-capabilities.md
- 011-future-roadmap.md

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Membership Lifecycle definition. |