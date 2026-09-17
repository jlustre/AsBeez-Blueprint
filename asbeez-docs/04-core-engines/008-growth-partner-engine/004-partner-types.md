# Growth Partner Types

---

## Document Information

| Property | Value |
|---|---|
| Engine | Growth Partner Engine |
| Document | Growth Partner Types |
| Document ID | AEDS-GPE-003 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Growth Partner Success Team |

---

# Introduction

Growth Partner Types classify the different roles through which individuals and organizations contribute to the expansion of the AsBeez ecosystem.

A Growth Partner Type describes the nature of a participant's approved growth role.

It does not determine:

- ABC placement
- Hive ancestry
- Revenue ownership
- Reward Point issuance
- Financial settlement
- Platform Partner ownership

Growth Partner Types provide a configurable framework for assigning eligibility, responsibilities, permissions, training requirements, contribution opportunities, and performance measures.

---

# Purpose

The Growth Partner Types component exists to:

- Classify Growth Partners consistently.
- Support different growth roles.
- Define role-specific eligibility.
- Control access to Growth Programs.
- Assign training requirements.
- Establish contribution permissions.
- Support country- and program-specific policies.
- Enable accurate performance measurement.
- Avoid hard-coded partnership roles.
- Support future Growth Partner models.

---

# Guiding Principle

> **A Growth Partner Type defines how a participant may contribute to ecosystem growth. It does not define hierarchy, ownership, or automatic entitlement to rewards.**

---

# Growth Partner Type Philosophy

Growth Partner Types should be based on the kind of contribution a participant is approved to make.

The platform should not classify Growth Partners according to organizational rank or network position.

Preferred classifications include:

- Referral Partner
- Ambassador
- Community Growth Partner
- Educational Growth Partner
- Strategic Alliance Partner
- Market Development Partner

Avoid classifications that imply:

- Upline or downline relationships
- Ownership of other participants
- Guaranteed earnings
- Positional compensation
- Permanent authority over introduced Members or Platform Partners

---

# Type Model

```text
Growth Partner
        │
        ├── Assigned Growth Partner Type
        │
        ├── Enrolled Growth Programs
        │
        ├── Approved Contribution Types
        │
        ├── Required Training
        │
        ├── Permissions
        │
        └── Performance Measures
```

A Growth Partner may hold multiple approved Types simultaneously.

---

# Core Growth Partner Type Entity

A Growth Partner Type should define:

- Type ID
- Type Code
- Display Name
- Description
- Classification
- Eligible Participant Kind
- Allowed Contribution Types
- Available Growth Programs
- Required Training
- Required Verification
- Country Availability
- Industry Restrictions
- Permissions
- Effective Dates
- Status
- Version

---

# Participant Kinds

A Growth Partner Type may be available to:

## Individual Growth Partners

A natural person participating independently or through an active Member relationship.

Examples:

- Referral Partner
- Ambassador
- Influencer Partner
- Community Growth Partner
- Recruiting Partner

---

## Organization Growth Partners

A verified organization contributing through strategic, institutional, or market-development relationships.

Examples:

- Strategic Alliance Partner
- Educational Growth Partner
- Corporate Growth Partner
- Nonprofit Growth Partner
- Technology Growth Partner

---

## Hybrid Eligibility

Some Growth Partner Types may be available to both individuals and organizations.

Examples:

- Community Growth Partner
- Educational Growth Partner
- Market Development Partner
- Content Partner

Eligibility must be defined by policy.

---

# Initial Growth Partner Types

---

## Referral Partner

A Growth Partner approved to introduce prospective Members or Platform Partners through designated Growth Programs.

Typical contributions include:

- Member Introduction
- Platform Partner Introduction
- Invitation Follow-Up
- Onboarding Support

A Referral Partner does not own the person or organization introduced.

The relationship exists only to record the verified introduction.

---

## Ambassador

A Growth Partner who publicly represents and promotes the AsBeez mission, values, programs, and community.

Typical contributions include:

- Platform Awareness
- Community Engagement
- Event Participation
- Educational Presentations
- Campaign Promotion
- Member and Platform Partner Introductions

Ambassador activity must follow approved messaging and disclosure policies.

---

## Community Growth Partner

A participant who helps develop, organize, or support local, professional, cultural, educational, or interest-based communities.

Typical contributions include:

- Community Formation
- Event Organization
- Member Engagement
- Local Partnerships
- Community Education
- Community Support

---

## Influencer Partner

A participant approved to promote AsBeez through digital content, social media, media channels, or an established audience.

Typical contributions include:

- Approved Content Creation
- Campaign Promotion
- Awareness Generation
- Educational Media
- Audience Engagement
- Trackable Introductions

Influencer activity must comply with advertising, sponsorship, disclosure, and content policies.

---

## Recruiting Partner

A Growth Partner approved to identify and support prospective participants for designated programs.

Potential targets may include:

- Members
- Growth Partners
- Platform Partner representatives
- Community participants

Recruiting Partners do not control or own recruited participants.

Recruiting activity must remain separate from ABC ancestry and Hive placement.

---

## Educational Growth Partner

An individual or organization that expands the ecosystem through education, training, research, or knowledge sharing.

Typical contributions include:

- Training Delivery
- Learning Content
- Workshops
- Certification Support
- Educational Partnerships
- Community Education

---

## Strategic Alliance Partner

An organization or authorized representative responsible for developing significant relationships between AsBeez and external organizations.

Potential relationships include:

- Corporate Alliances
- Associations
- Government Organizations
- Nonprofit Organizations
- Educational Institutions
- Technology Providers
- Industry Groups

Strategic Alliance contributions should be documented through approved agreements or programs.

---

## Market Development Partner

A Growth Partner approved to help establish AsBeez within a new geographic or industry market.

Typical contributions include:

- Country Launch Support
- Regional Expansion
- Industry Development
- Local Relationship Building
- Platform Partner Acquisition
- Market Research
- Community Formation

---

## Corporate Growth Partner

A verified organization participating in ecosystem growth through its employees, customers, distribution network, member base, or commercial relationships.

Potential contributions include:

- Member Introduction Programs
- Platform Partner Introductions
- Employee Participation Programs
- Corporate Campaigns
- Strategic Events
- Market Access

---

## Nonprofit Growth Partner

A nonprofit, charity, foundation, association, or community organization that supports ecosystem growth through mission-aligned programs.

Typical contributions include:

- Community Outreach
- Education
- Member Introduction
- Social Impact Campaigns
- Local Partnerships
- Volunteer Programs

---

## Government Relations Partner

An approved individual or organization that helps establish relationships with government entities or public institutions.

Typical contributions include:

- Public-Sector Introductions
- Government Program Development
- Regulatory Education
- Public Partnership Coordination
- Community Initiative Support

This role does not grant authority to represent AsBeez legally unless separately authorized.

---

## Technology Growth Partner

An organization or specialist that helps expand the ecosystem through technology relationships, integrations, platforms, or technical distribution.

Typical contributions include:

- Technology Partnerships
- Integration Opportunities
- Developer Communities
- Platform Distribution
- Technical Education
- Joint Innovation Programs

---

## Content Growth Partner

A participant who creates approved educational, promotional, community, or platform content.

Typical contributions include:

- Articles
- Videos
- Courses
- Tutorials
- Presentations
- Social Content
- Community Resources

Content must comply with intellectual-property, disclosure, and accuracy policies.

---

# Type Classifications

Growth Partner Types may be grouped into broader classifications.

| Classification | Examples |
|---|---|
| Introduction | Referral Partner, Recruiting Partner |
| Representation | Ambassador, Influencer Partner |
| Community | Community Growth Partner, Nonprofit Growth Partner |
| Education | Educational Growth Partner, Content Growth Partner |
| Strategic | Strategic Alliance Partner, Government Relations Partner |
| Market Expansion | Market Development Partner, Corporate Growth Partner |
| Technology | Technology Growth Partner |

Classifications support reporting and policy management but do not replace specific Growth Partner Types.

---

# Multiple Type Assignments

A Growth Partner may hold multiple Types when separately qualified.

Example:

```text
Growth Partner
│
├── Ambassador
├── Community Growth Partner
└── Educational Growth Partner
```

Each Type assignment must preserve:

- Approval Date
- Approving Authority
- Effective Date
- Expiration Date, if applicable
- Status
- Required Training
- Applicable Programs
- Assignment Version

---

# Primary and Secondary Types

The platform may identify:

- Primary Growth Partner Type
- Secondary Growth Partner Types

The Primary Type may control:

- Default dashboard
- Suggested Growth Programs
- Performance summary
- Training path
- Communication preferences

Primary Type does not create greater reward entitlement than Secondary Types.

---

# Type Assignment Lifecycle

```text
Type Requested or Recommended

↓

Eligibility Evaluated

↓

Verification Completed

↓

Training Completed

↓

Type Approved

↓

Type Activated

↓

Periodic Review

↓

Renewed, Restricted, Suspended, or Removed
```

---

# Assignment Statuses

A Growth Partner Type assignment may use:

- Requested
- Pending Review
- Training Required
- Approved
- Active
- Restricted
- Suspended
- Expired
- Removed
- Archived

---

# Eligibility Rules

Eligibility may depend on:

- Participant Kind
- Active Member status
- Verified organization status
- Country
- Age or legal capacity
- Identity verification
- Training completion
- Accepted program terms
- Compliance history
- Platform standing
- Prior contribution history
- Required credentials
- Invitation or approval

Eligibility rules should be configurable and versioned.

---

# Verification Requirements

Different Types may require different levels of verification.

Examples include:

## Basic Verification

- Identity
- Contact Information
- Country
- Terms Acceptance

May apply to low-risk individual roles.

---

## Enhanced Verification

- Identity
- Address
- Background review
- Experience
- References
- Training

May apply to Ambassadors or Market Development Partners.

---

## Organization Verification

- Legal entity
- Authorized representative
- Organization registration
- Agreement
- Compliance documents

May apply to Strategic Alliance, Corporate, Nonprofit, or Technology Growth Partners.

---

# Training Requirements

A Growth Partner Type may require training such as:

- Platform Overview
- Growth Program Rules
- Ethical Referral Practices
- Brand Guidelines
- Advertising Disclosures
- Data Privacy
- Community Standards
- Fraud Prevention
- Country-Specific Compliance
- Contribution Evidence
- Incentive Rules

Training requirements should be effective-dated and versioned.

---

# Permissions

Growth Partner Types may grant permissions such as:

- Invite Prospective Members
- Introduce Prospective Platform Partners
- Enroll in Specific Growth Programs
- Submit Contribution Records
- Access Approved Marketing Materials
- Host Approved Events
- Use Ambassador Branding
- View Growth Analytics
- Create Campaign Links
- Access Training Resources

Permissions should be evaluated separately from rewards.

---

# Contribution Type Access

Each Growth Partner Type may be authorized for specific Contribution Types.

Example:

| Growth Partner Type | Approved Contribution Types |
|---|---|
| Referral Partner | Member Introduction, Platform Partner Introduction |
| Ambassador | Campaign Participation, Event Participation, Content Promotion |
| Community Growth Partner | Community Development, Event Organization |
| Educational Growth Partner | Training Delivery, Educational Content |
| Strategic Alliance Partner | Strategic Relationship, Institutional Introduction |
| Market Development Partner | Market Expansion, Platform Partner Acquisition |

A participant may not submit restricted Contribution Types without an approved Type assignment or program exception.

---

# Growth Program Access

Growth Partner Types may control eligibility for Growth Programs.

Example:

```text
Platform Partner Introduction Program
Eligible Types:
- Referral Partner
- Ambassador
- Market Development Partner
- Strategic Alliance Partner
```

Program eligibility remains authoritative.

A Type assignment alone does not guarantee enrollment.

---

# Country Availability

Growth Partner Types may vary by:

- Country
- State or Province
- Regulatory environment
- Program availability
- Language
- Market maturity
- Local policy

A Type may be:

- Globally Available
- Country-Specific
- Region-Specific
- Invitation-Only
- Temporarily Suspended

---

# Industry Restrictions

Certain Types may have industry-specific restrictions.

Examples include:

- Insurance
- Real Estate
- Healthcare
- Legal Services
- Financial Services
- Government Contracting

A Growth Partner Type does not authorize activities that legally require professional licensing.

---

# Type Versioning

Growth Partner Types are versioned.

When requirements change:

- Existing assignments preserve the version originally approved.
- Requalification may be required.
- Future assignments use the new version.
- Historical Type definitions remain available for audit.

---

# Type Governance

Creating or changing a Growth Partner Type may require:

- Business justification
- Program review
- Legal review
- Compliance review
- Rewards review
- Country review
- Administrative approval
- Effective-date scheduling

Growth Partner Types should not be created merely to bypass existing Growth Program or incentive controls.

---

# Business Rules

## GPT-001

Every Growth Partner Type must have a unique Type Code.

---

## GPT-002

Every Type must define whether it is available to individuals, organizations, or both.

---

## GPT-003

Every Type must define its approved Contribution Types.

---

## GPT-004

Every Type assignment must reference the Type Version used at approval.

---

## GPT-005

A Growth Partner may hold multiple active Types when separately eligible and approved.

---

## GPT-006

A Growth Partner Type must not create ABC ancestry, descendant relationships, or Hive placement.

---

## GPT-007

A Growth Partner Type does not automatically generate RP, ABC, AHC, or monetary compensation.

---

## GPT-008

A Type assignment does not grant ownership or control over introduced Members or Platform Partners.

---

## GPT-009

Regulated activities remain subject to applicable licensing and legal requirements.

---

## GPT-010

Type eligibility, verification, training, and permissions must be configurable and auditable.

---

## GPT-011

Type changes affect future eligibility and activity according to effective dates.

Historical contributions retain the Type assignment and version applicable when they occurred.

---

## GPT-012

Suspending one Growth Partner Type does not automatically suspend other active Types unless policy requires it.

---

## GPT-013

A Platform Partner or Platform Partner representative may act as a Growth Partner only through a separately approved Growth Partner record and Type assignment.

---

## GPT-014

Custom Growth Partner Types require governance approval before activation.

---

# Custom Growth Partner Types

The platform may support Custom Growth Partner Types for new programs or markets.

A Custom Type must define:

- Name
- Type Code
- Purpose
- Participant Kind
- Contribution Types
- Program Access
- Verification
- Training
- Permissions
- Country Availability
- Restrictions
- Effective Dates
- Owner
- Approval Status

Custom Types should reuse the same domain model rather than creating specialized partner systems.

---

# Domain Events

Examples include:

- GrowthPartnerTypeCreated
- GrowthPartnerTypeVersionPublished
- GrowthPartnerTypeActivated
- GrowthPartnerTypeSuspended
- GrowthPartnerTypeRetired
- GrowthPartnerTypeAssignmentRequested
- GrowthPartnerTypeAssigned
- GrowthPartnerTypeAssignmentActivated
- GrowthPartnerTypeAssignmentRestricted
- GrowthPartnerTypeAssignmentSuspended
- GrowthPartnerTypeAssignmentRenewed
- GrowthPartnerTypeAssignmentRemoved
- GrowthPartnerPrimaryTypeChanged

---

# API Capabilities

The Growth Partner API may support:

```text
GET  /growth-partner-types
GET  /growth-partner-types/{typeId}
POST /growth-partner-types
POST /growth-partner-types/{typeId}/publish
POST /growth-partners/{partnerId}/type-assignments
POST /growth-partners/{partnerId}/type-assignments/{assignmentId}/activate
POST /growth-partners/{partnerId}/type-assignments/{assignmentId}/suspend
GET  /growth-partners/{partnerId}/type-assignments
```

Administrative Type management must be restricted to authorized roles.

---

# AI Capabilities

AI may assist with:

- Type recommendations
- Eligibility pre-screening
- Training recommendations
- Contribution-to-Type matching
- Duplicate Type detection
- Role overlap analysis
- Country-policy comparison
- Assignment review summaries
- Requalification reminders
- Type effectiveness analysis

AI may recommend a Type but must not approve high-impact or regulated assignments independently.

---

# Analytics

Growth Partner Type analytics may include:

- Active Growth Partners by Type
- Type Assignment Requests
- Approval Rate
- Suspension Rate
- Contributions by Type
- Contribution Quality by Type
- Program Enrollment by Type
- Recognition by Type
- Country Distribution
- Type Conversion Performance
- Training Completion
- Type Retention

Analytics should not be used to imply guaranteed earnings.

---

# Relationship with Other Engines

| Platform Engine | Relationship |
|---|---|
| Identity Engine | Provides authenticated identity and permissions. |
| Membership Engine | Provides authoritative Member status where required. |
| Platform Partner Engine | Provides verified organization or representative context where applicable. |
| Growth Partner Engine | Owns Growth Partner Types and Type assignments. |
| Rewards Engine | Receives approved incentive eligibility independently of Type assignment. |
| Analytics Engine | Measures Type participation and contribution outcomes. |
| Notification Engine | Sends Type approval, training, renewal, and suspension notices. |
| AI Engine | Supports recommendations, classification, and analysis. |

---

# Long-Term Vision

Growth Partner Types should provide a universal and extensible classification system for every individual or organization that helps expand AsBeez.

New roles should be introduced by defining:

- Who may participate
- What contributions are allowed
- Which programs are available
- What training is required
- What permissions are granted
- How performance is measured

The platform should never require a separate engine simply because a new growth role emerges.

---

# Closing Statement

Growth Partner Types provide the role framework through which AsBeez organizes ecosystem-growth participants.

By defining clear eligibility, contribution permissions, training requirements, and program access—without creating hierarchy or automatic compensation rights—the platform can support diverse forms of growth while preserving transparency, fairness, compliance, and architectural consistency.

---

# Growth Partner Type Principle

> **A Growth Partner Type defines a permitted way to contribute, not a position of ownership or hierarchy. Types organize eligibility, responsibilities, training, permissions, and Growth Program access while all recognition and incentives remain dependent on verified contributions and approved platform policies.**

---

# Related Documents

- 000-index.md
- 001-overview.md
- 002-domain-model.md
- 004-growth-programs.md
- 005-relationships.md
- 006-contributions.md
- 007-performance.md
- 008-api.md
- 009-events.md
- 010-ai-capabilities.md
- 011-future-roadmap.md
- ../007-platform-partner-engine/002-domain-model.md
- ../../GLOSSARY.md

---

# Revision History

| Version | Date | Description |
|---|---|---|
| 1.0.0 | YYYY-MM-DD | Initial Growth Partner Types specification. |