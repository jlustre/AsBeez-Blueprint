# Referral System

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-123 |
| Capability ID | BC-MEM-123 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Membership |
| Owner | Membership Domain |

---

# Overview

The Referral System enables Members to invite new individuals to join the AsBeez platform.

Its purpose is to grow the AsBeez community by rewarding Members who introduce qualified new Members.

A referral relationship is permanent once established.

---

# Responsibilities

The Referral System is responsible for:

- Recording referral relationships
- Tracking referrals
- Determining Qualified Referrals
- Maintaining referral hierarchy
- Providing referral statistics
- Publishing referral events

The Referral System is **not responsible** for:

- Member registration
- Invite link generation
- Reward calculations
- ABC generation
- AHC distribution
- Wallet credits

---

# Referral Relationship

Each Member may refer an unlimited number of Members.

Each Member may have only one Referrer.

Once established, the referral relationship cannot be changed.

---

# Qualified Referral

A referral becomes **Qualified** when the referred Member generates at least **one (1) ABC**.

Registration alone does not qualify a referral.

---

# Referral Information

Each referral records:

## Referrer

- Member ID
- Name

---

## Referred Member

- Member ID
- Registration Date
- Activation Date

---

## Referral Status

- Pending
- Qualified
- Disqualified
- Suspended

---

# Referral Workflow

```text
Member Shares Invite
         │
         ▼
New Member Registers
         │
         ▼
Referral Relationship Created
         │
         ▼
Member Activates Account
         │
         ▼
Member Generates First ABC
         │
         ▼
Referral Becomes Qualified
```

---

# Referral Status

| Status | Description |
|----------|-------------|
| Pending | Waiting to qualify |
| Qualified | Generated at least one ABC |
| Suspended | Membership suspended |
| Disqualified | Referral no longer qualifies under platform policies |

---

# Lifetime Referral Count

The Referral System maintains each Member's lifetime referral statistics.

Examples include:

- Total Referrals
- Active Referrals
- Qualified Referrals
- Pending Referrals

These statistics may be used by other business capabilities to determine qualification levels.

---

# Configuration

Administrators may configure:

- Referral Qualification Rules
- Referral Expiration *(Future)*
- Referral Validation Rules
- Maximum Referral Depth *(Reporting Only)*

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-REF-001 | Every Member may have only one Referrer. |
| BR-REF-002 | Members may refer unlimited people. |
| BR-REF-003 | Referral relationships are permanent after activation. |
| BR-REF-004 | A referral becomes Qualified after generating at least one ABC. |
| BR-REF-005 | Registration alone does not qualify a referral. |
| BR-REF-006 | Referral statistics are maintained throughout the Member's lifetime. |
| BR-REF-007 | Suspended Members do not lose their referral history. |

---

# Published Events

The Referral System publishes:

- ReferralCreated
- ReferralQualified
- ReferralSuspended
- ReferralReactivated

---

# Consumed Events

The Referral System consumes:

- MemberActivated
- ABCCreated

---

# Related Capabilities

- BC-MEM-121 Member Registration
- BC-MEM-122 Member Profile
- BC-MEM-124 Invite Links
- BC-RWD-126 ABC Engine

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |