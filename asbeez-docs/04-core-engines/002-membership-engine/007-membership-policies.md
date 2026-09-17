# Membership Policies

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Membership Engine |
| Document | Membership Policies |
| Document ID | AEDS-ME-007 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Membership Governance Team |

---

# Introduction

The Membership Policies document defines the governing rules that control membership within the AsBeez ecosystem.

Unlike qualification rules, which determine how a Customer becomes a Member, Membership Policies govern how Memberships are maintained, transferred, suspended, reactivated, lapsed, and archived throughout their lifetime.

These policies provide a consistent framework that ensures fairness, transparency, and long-term sustainability.

---

# Purpose

Membership Policies exist to:

- Govern Membership behavior.
- Protect Sponsor integrity.
- Prevent duplicate Memberships.
- Define reactivation rules.
- Define lapsed Membership rules.
- Preserve historical records.
- Ensure fairness across all countries.

---

# Guiding Principle

> **One person. One active Membership. One trusted relationship with the AsBeez ecosystem.**

---

# Core Policies

## MP-001 — One Active Membership

A participant may have only one Active Membership at any given time.

Multiple concurrent Memberships are prohibited.

---

## MP-002 — Identity Before Membership

Every Membership must be associated with a valid Identity.

Identity is permanent.

Membership is a business relationship.

---

## MP-003 — Registration Does Not Create Membership

Registration creates an Identity.

Participation creates a Customer.

Qualification creates a Membership.

---

## MP-004 — Membership Qualification

A Customer becomes a Qualified Member only after satisfying the configured qualification requirements.

Current qualification requires:

- At least one (1) ABC.

Future qualification requirements may be configured.

---

## MP-005 — Pending Referrals

Customers may refer participants before qualifying.

These referrals remain in Pending status.

Pending referrals are preserved.

They become eligible according to platform policy after Membership qualification.

---

# Sponsor Policies

## MP-101 — Sponsor Assignment

Every Membership has one Sponsor.

The Sponsor relationship is established when the participant first registers through a referral.

---

## MP-102 — Earliest Registration Prevails

If the same individual registers multiple times using different email addresses, authentication providers, or contact information, the earliest valid registration determines the official Sponsor.

Subsequent registrations do not change Sponsor ownership.

---

### Example

| Date | Sponsor | Result |
|------|---------|--------|
| January 10 | Alice | Valid Sponsor |
| January 20 | Bob | Ignored |

Alice remains the Sponsor.

---

## MP-103 — Sponsor Protection

Changing:

- Email
- Mobile number
- Authentication provider
- Personal information

does not change Sponsor ownership.

---

## MP-104 — Sponsor Changes

Sponsor changes are exceptional administrative actions.

They require:

- Administrative approval
- Audit trail
- Business justification

Sponsor changes are never automatic.

---

# Duplicate Membership Policies

## MP-201 — Duplicate Registration

A participant may register multiple times.

The platform should attempt to determine whether registrations belong to the same individual.

Identity matching may use:

- Verified email history
- Verified mobile number
- Legal name
- Date of birth
- Government identification (where applicable)
- AI-assisted identity matching

---

## MP-202 — Duplicate Membership Prevention

If a participant already has an Active Membership:

- Additional Memberships are not created.
- Existing Membership remains authoritative.

---

# Lapsed Membership

## MP-301 — Active Member

A Member is considered Active while meeting the platform's participation requirements.

Participation requirements are configurable.

---

## MP-302 — Inactive Member

A Member becomes Inactive after failing to meet the configured participation requirements.

Examples may include:

- No qualifying purchases
- No RP generation
- No qualifying business activity

The inactivity period is configurable.

---

## MP-303 — Lapsed Member

A Membership enters the Lapsed state after remaining Inactive for the configured lapsed period.

Examples:

- 180 consecutive days
- 365 consecutive days

The period is configurable by Membership Policy.

---

## MP-304 — New Sponsorship Eligibility

Once a Membership has entered the Lapsed state, the participant may become eligible for a new Membership under a different Sponsor.

Eligibility depends on:

- Platform policy
- Country policy
- Compliance requirements

---

## MP-305 — Historical Preservation

Lapsing a Membership never deletes historical information.

Previous Memberships remain permanently archived for auditing and reporting.

---

# Country Policies

Membership policies may vary by country.

Examples include:

- ABC qualification threshold
- Inactive period
- Lapsed period
- Reactivation requirements
- Membership fees
- Compliance requirements

Country-specific policies are configuration-driven.

---

# Membership Transfers

Members may transfer:

- Country
- Residency
- Organization

Transfers never change historical Sponsor relationships unless approved by policy.

---

# Reactivation

A Lapsed or Inactive Membership may be reactivated.

Requirements are configurable.

Examples:

- Identity verification
- Compliance review
- Outstanding obligations
- Administrative approval

---

# Membership History

Every Membership maintains a permanent history including:

- Registration
- Qualification
- Sponsor assignment
- Referral activity
- Country changes
- Qualification history
- Status changes
- Lapsed periods
- Reactivations

Historical information is immutable.

---

# Business Events

The Membership Engine publishes:

- MembershipQualified
- MembershipActivated
- MembershipSuspended
- MembershipReactivated
- MembershipLapsed
- MembershipArchived
- SponsorAssigned
- ReferralActivated

---

# AI Assistance

Artificial Intelligence may assist by:

- Detecting duplicate identities.
- Predicting lapse risk.
- Identifying unusual referral activity.
- Detecting sponsorship abuse.
- Recommending re-engagement.
- Monitoring organizational health.

AI provides recommendations.

Business policies determine outcomes.

---

# Configuration

The following policies should be configurable:

- Qualification requirements
- ABC threshold
- Inactive period
- Lapsed period
- Sponsor change policy
- Country-specific rules
- Reactivation requirements
- Duplicate detection sensitivity

Configuration is managed through the Configuration Engine.

---

# Long-Term Vision

The Membership Policy framework should evolve into a configurable governance engine capable of supporting multiple Membership Programs, countries, industries, and future business models without requiring software changes.

---

# Closing Statement

Membership Policies provide the governance framework that protects the integrity of the AsBeez ecosystem.

By separating policy from implementation, the platform can evolve while maintaining fairness, consistency, historical accuracy, and long-term trust among all participants.

---

# Guiding Principle

> **Membership is governed by transparent, configurable, and auditable policies that protect participants, preserve historical relationships, and ensure fairness throughout the entire lifecycle of every Membership.**

---

# Related Documents

- 003-membership-lifecycle.md
- 004-country-residency.md
- 005-referrals-sponsorship.md
- 006-qualifications.md
- Configuration Engine
- Rewards Engine

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Membership Policies specification. |