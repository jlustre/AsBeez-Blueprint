# Business Events

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Membership Engine |
| Document | Business Events |
| Document ID | AEDS-ME-009 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Platform Architecture Team |

---

# Introduction

The Membership Engine communicates with the rest of the AsBeez Platform through immutable business events.

Whenever a significant business activity occurs, the Membership Engine publishes an event to the platform Event Bus.

Other Platform Engines subscribe only to the events they require.

This event-driven architecture enables loose coupling, scalability, independent deployment, and future extensibility.

---

# Purpose

Business Events exist to:

- Notify the platform of membership changes.
- Trigger business workflows.
- Enable platform integrations.
- Support auditing.
- Feed Analytics.
- Enable Artificial Intelligence.
- Decouple Platform Engines.

Business events describe **facts that have already occurred**.

They never instruct another engine what to do.

---

# Guiding Principle

> **Publish completed business facts. Never publish business commands.**

Examples:

✔ MembershipQualified

✔ SponsorAssigned

✔ MembershipLapsed

Avoid:

✘ QualifyMember

✘ CreateSponsor

✘ ActivateReferral

---

# Event Flow

```text
Business Action

      │

      ▼

Membership Engine

      │

      ▼

Business Event

      │

      ▼

Event Bus

      │

 ┌────┼──────────────┬───────────────┐

 ▼    ▼              ▼               ▼

Rewards

Financial

Commerce

AI

Analytics

Notification

Vendor

Partner
```

The Membership Engine has no knowledge of who consumes its events.

---

# Event Categories

Membership events are organized into the following categories:

- Customer Events
- Membership Events
- Qualification Events
- Referral Events
- Sponsorship Events
- Residency Events
- Policy Events
- Administrative Events

---

# Customer Events

## CustomerCreated

Published when a participant becomes a Customer.

Occurs after registration and successful onboarding into the business platform.

---

## CustomerUpdated

Published when customer information changes.

---

## CustomerArchived

Published when customer participation permanently ends.

---

# Qualification Events

## QualificationStarted

Published when a Customer begins progressing toward Membership.

---

## QualificationProgressUpdated

Published when qualification progress changes.

Examples:

- RP earned
- Remaining RP
- ABC progress

---

## MembershipQualified

Published when the Customer satisfies all Membership qualification requirements.

Current qualification:

- At least one ABC created.

The Rewards Engine determines when an ABC is created.

The Membership Engine determines that the participant is now qualified.

---

## QualificationRevoked *(Future)*

Published if qualification is later revoked according to business policy.

---

# Membership Events

## MembershipActivated

Published when Membership becomes active.

---

## MembershipSuspended

Published when Membership is temporarily suspended.

---

## MembershipReactivated

Published when a suspended or inactive Membership returns to active status.

---

## MembershipInactive

Published when a Member enters the Inactive state.

---

## MembershipLapsed

Published when a Membership enters the Lapsed state according to configured policy.

A Lapsed Membership may become eligible for future sponsorship under platform policy.

---

## MembershipArchived

Published when Membership permanently ends.

Historical records remain preserved.

---

# Referral Events

## ReferralRecorded

Published when a Customer or Member refers another participant.

---

## PendingReferralCreated

Published when the referring participant has not yet qualified for Membership.

Pending referrals remain attached to the Customer.

---

## PendingReferralActivated

Published when Pending Referrals become eligible following Membership qualification.

---

## ReferralRejected

Published when a referral cannot be accepted.

Examples:

- Duplicate Membership
- Existing Active Membership
- Policy violation

---

# Sponsorship Events

## SponsorAssigned

Published when a Sponsor relationship is established.

---

## SponsorChanged

Published after an approved administrative Sponsor change.

Sponsor changes are exceptional.

---

## SponsorProtected

Published when the system rejects an attempt to alter Sponsor ownership due to policy.

---

# Residency Events

## ResidencyAssigned

Published when residency is established.

---

## ResidencyChanged

Published when a Member permanently changes residency.

Subscribers may update:

- Currency
- Tax configuration
- Qualification thresholds
- Country policies

---

# Policy Events

## MembershipPolicyChanged

Published when Membership policies change.

Examples:

- ABC threshold
- Lapsed period
- Qualification rules

---

## CountryPolicyChanged

Published when country-specific Membership configuration changes.

---

# Administrative Events

## DuplicateMembershipDetected

Published when duplicate Membership attempts are detected.

---

## MembershipMerged

Published after administrative Membership consolidation.

---

## MembershipAuditRecorded

Published when a significant administrative action is completed.

---

# Event Structure

Every Membership event should follow the platform standard.

Example:

```json
{
  "eventId": "uuid",
  "eventType": "MembershipQualified",
  "eventVersion": "1.0",
  "occurredAt": "2026-07-08T15:00:00Z",
  "membershipId": "MEM-100245",
  "identityId": "ID-500001",
  "actorId": "ID-500001",
  "correlationId": "REQ-123456",
  "country": "US",
  "payload": {}
}
```

The payload should contain business information only.

---

# Event Naming Standards

Business events should:

- Use business terminology.
- Be written in past tense.
- Be immutable.
- Remain technology-independent.

Examples:

✔ MembershipQualified

✔ SponsorAssigned

✔ ResidencyChanged

Avoid:

✘ QualifyMembership

✘ AssignSponsor

✘ UpdateResidency

---

# Event Consumers

Typical subscribers include:

| Platform Engine | Example Usage |
|-----------------|---------------|
| Rewards Engine | Activate pending referral eligibility after Membership qualification. |
| Financial Engine | Enable commission and payout eligibility. |
| Commerce Engine | Unlock Member-only products and pricing. |
| Notification Engine | Send Membership milestone notifications. |
| Analytics Engine | Measure conversion, retention, and growth. |
| AI Engine | Predict engagement and detect anomalies. |
| Vendor Engine | Validate Member eligibility. |
| Partner Engine | Enable partner participation. |

The Membership Engine remains unaware of its subscribers.

---

# Reliability

Membership events should be:

- Immutable
- Durable
- Idempotent
- Ordered where required
- Auditable
- Retryable

Events should survive partial failures.

---

# Security

Events should never expose:

- Passwords
- Authentication tokens
- Financial credentials
- Sensitive personal information
- Internal implementation details

Only business facts should be published.

---

# AI Integration

The AI Engine consumes Membership events to:

- Predict qualification.
- Forecast Member retention.
- Detect referral abuse.
- Monitor organizational health.
- Recommend engagement strategies.
- Predict lapse risk.

AI observes events but does not change Membership status directly.

---

# Future Expansion

Future Membership events may include:

- MembershipRenewed
- MembershipTransferred
- CorporateMembershipCreated
- FamilyMembershipCreated
- MembershipBenefitsUpdated
- MembershipProgramChanged

The event model should evolve while preserving backward compatibility.

---

# Closing Statement

Business Events are the communication language of the Membership Engine.

By publishing immutable business facts rather than procedural commands, the Membership Engine enables every Platform Engine to evolve independently while remaining synchronized through trusted event streams.

This event-driven approach allows AsBeez to scale globally while maintaining a clear separation of responsibilities.

---

# Event Principle

> **The Membership Engine publishes immutable business facts describing customer participation, qualification, sponsorship, residency, and membership changes, enabling every Platform Engine to react independently while preserving a single source of truth for business relationships.**

---

# Related Documents

- 001-overview.md
- 002-domain-model.md
- 003-membership-lifecycle.md
- 004-country-residency.md
- 005-referrals-sponsorship.md
- 006-qualifications.md
- 007-membership-policies.md
- 008-api.md
- Platform Event Catalog
- Platform Event-Driven Architecture

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial business event specification for the Membership Engine. |