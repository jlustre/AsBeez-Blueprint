# Overview

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Membership Engine |
| Document | Overview |
| Document ID | AEDS-ME-001 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Platform Architecture Team |

---

# Introduction

The Membership Engine manages the complete participation lifecycle within the AsBeez ecosystem.

While the Identity Engine establishes a participant's digital identity, the Membership Engine determines whether that participant qualifies as a Member and how they participate within the platform.

Membership is a business relationship.

It is not automatically granted when someone registers an account.

Every participant begins with an Identity.

Most participants become Customers.

Only qualified Customers become Members.

---

# Vision

To build a fair, scalable, and globally adaptable membership platform that rewards meaningful participation while supporting sustainable growth across every country, industry, and business model within the AsBeez ecosystem.

---

# Mission

To manage the complete lifecycle of Customers and Members by providing consistent rules for qualification, participation, referrals, sponsorships, residency, organizational relationships, and membership status.

---

# Why the Membership Engine Exists

Without a dedicated Membership Engine:

- Identity becomes mixed with business participation.
- Qualification rules become duplicated.
- Referral logic becomes inconsistent.
- Country-specific membership rules become difficult to manage.
- Rewards become tightly coupled to authentication.
- Future industries cannot reuse the same participation model.

The Membership Engine centralizes these responsibilities into one reusable platform capability.

---

# Core Philosophy

Membership is earned.

Registration creates an Identity.

Participation creates a Customer.

Qualification creates a Member.

This distinction allows the platform to reward commitment rather than simple registration.

---

# Participation Model

Every participant progresses through the following business journey.

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
```

This model separates authentication from business participation.

---

# Customer vs Member

One of the fundamental principles of the AsBeez Platform is the distinction between Customers and Members.

## Customer

A Customer is a participant who has:

- A valid Identity.
- Access to the platform.
- The ability to purchase products or services.
- The ability to refer others.
- No active Membership status.

Customers may accumulate Reward Points and generate referrals.

However, they are not yet considered Members.

---

## Qualified Member

A Customer becomes a Qualified Member only after earning at least one ABC.

Until this milestone is reached:

- Referrals remain in Pending status.
- Member-specific benefits are unavailable.
- Membership privileges are not activated.

The creation of the first ABC is the business event that transforms a Customer into a Member.

---

# Membership Qualification

Membership qualification is determined by business rules rather than account registration.

Current qualification rule:

- A participant must earn at least one ABC.

The Reward Point (RP) threshold required to generate an ABC is configurable by country.

Each country's threshold must be divisible by twelve to ensure whole-number calculations throughout the reward system.

Examples include:

| Country | ABC Qualification Threshold |
|----------|----------------------------:|
| Country A | 120 RP |
| Country B | 60 RP |
| Country C | 36 RP |

Qualification rules are documented in **006-qualifications.md**.

---

# Pending Referrals

Customers may begin referring participants before qualifying as Members.

Those referrals are preserved.

They are recorded as Pending Referrals.

Once the Customer becomes a Qualified Member:

- Pending referrals become active according to platform policies.
- Eligibility calculations begin.
- Member benefits become available.

This ensures that early participation is recognized without bypassing qualification requirements.

---

# Responsibilities

The Membership Engine is responsible for:

- Customer participation
- Membership qualification
- Membership lifecycle
- Membership status
- Membership history
- Sponsorship relationships
- Referral relationships
- Country assignment
- Residency
- Organizational placement
- Membership transfers
- Membership policies
- Participation eligibility

---

# Responsibilities Outside This Engine

The Membership Engine intentionally does not manage:

| Responsibility | Platform Engine |
|---------------|-----------------|
| Authentication | Identity Engine |
| Authorization | Identity Engine |
| Products & Orders | Commerce Engine |
| RP Calculation | Rewards Engine |
| ABC Creation | Rewards Engine |
| Wallets | Financial Engine |
| Payments | Financial Engine |

The Membership Engine determines **who qualifies as a Member**, but it does not calculate the rewards used to qualify them.

---

# Relationship to Other Platform Engines

```text
                 Identity Engine
                        │
                        ▼
                   Customer
                        │
                 Membership Engine
                        │
        Membership Qualification
                        │
                        ▼
                 Qualified Member
                        │
      ┌─────────┬─────────┬─────────┐
      ▼         ▼         ▼         ▼
 Commerce   Rewards   Financial   Vendor
```

The Membership Engine acts as the bridge between identity and ecosystem participation.

---

# Design Principles

The Membership Engine follows the architectural principles of the AsBeez Platform.

- Build Engines Once
- Configuration Over Customization
- API-First
- Event-Driven
- AI-Native
- Global by Design
- Business Rule Driven

Membership rules should be configurable rather than hard-coded whenever possible.

---

# Success Metrics

The Membership Engine should be evaluated using metrics such as:

- Customer-to-Member conversion rate
- Time to qualification
- Membership retention
- Active Members
- Pending Referrals
- Membership transfers
- Qualification success rate
- Country participation
- Referral activation rate

These metrics help evaluate the health and growth of the ecosystem.

---

# Long-Term Vision

The Membership Engine will evolve into a globally configurable participation platform capable of supporting multiple countries, industries, qualification models, and membership programs while preserving a consistent participant experience.

As AsBeez expands, the engine should enable new opportunities without changing its foundational principles.

---

# Closing Statement

The Membership Engine transforms platform users into meaningful participants.

By distinguishing Customers from Members and requiring qualification through measurable participation, the platform promotes fairness, sustainability, and long-term engagement.

This engine defines not only who belongs to the AsBeez ecosystem, but how that relationship grows, evolves, and creates value for every participant.

---

# Guiding Principle

> **Membership is earned through meaningful participation. Identity grants access, Customer status enables participation, and qualification establishes Membership within the AsBeez ecosystem.**

---

# Related Documents

- 000-index.md
- 002-domain-model.md
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
| 1.0.0 | YYYY-MM-DD | Initial overview of the Membership Engine. |