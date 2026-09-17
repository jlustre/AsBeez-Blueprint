# Example Scenarios

> **Document:** `11-beehive-matrix/999-reference/004-example-scenarios.md`

---

# Overview

The **Example Scenarios** document provides practical, end-to-end examples illustrating how the AsBeez Beehive Matrix behaves under real-world business conditions.

While the previous documents define architecture, rules, APIs, events, and configurations, this document demonstrates how those concepts work together through realistic business workflows.

These scenarios are intended for:

- Business Analysts
- Developers
- QA Engineers
- Architects
- Administrators
- AI Systems
- Customer Support
- Auditors
- Product Owners

---

# Objectives

This document exists to:

- explain business workflows
- validate business rules
- assist developers
- simplify QA testing
- provide onboarding examples
- illustrate edge cases
- demonstrate event flow
- verify financial consistency

---

# Scenario Categories

```text
Example Scenarios

├── Member Registration
├── Member Qualification
├── Business Cell Creation
├── Reward Distribution
├── Multiple Business Cells
├── Referral Growth
├── Country Operations
├── Wallet
├── Administration
├── AI
├── Security
├── Compliance
├── Error Recovery
└── Infrastructure
```

---

# Scenario 1 — New Customer Registration

## Business Goal

A visitor creates a new AsBeez account.

---

## Initial State

```text
Visitor

↓

No Account
```

---

## Workflow

```text
Registration Form

↓

Validation

↓

Email Verification

↓

Member Created

↓

MemberRegistered Event

↓

Welcome Notification
```

---

## Final State

```text
Customer

↓

0 RP

↓

0 ABC

↓

Wallet Created

↓

Member Active
```

---

## Events

- RegistrationRequested
- MemberRegistered
- WalletCreated
- NotificationSent

---

# Scenario 2 — Customer Earns Reward Points

The customer purchases qualifying products.

---

## Initial State

```text
Member

0 RP
```

---

## Purchase

```text
Purchase

↓

40 RP Earned
```

---

## Final State

```text
40 RP

↓

No ABC Yet
```

---

## Events

- PurchaseCompleted
- RewardPointsEarned
- RewardLedgerRecorded

---

# Scenario 3 — Customer Reaches Threshold

Assume the country threshold is:

```text
120 RP
```

Current balance:

```text
100 RP
```

Next purchase:

```text
20 RP
```

---

## Workflow

```text
Purchase

↓

120 RP

↓

Threshold Reached

↓

Create Business Cell

↓

Reward Distribution

↓

Wallet Update
```

---

## Result

```text
120 RP

↓

Consumed

↓

1 ABC Created

↓

RP Balance = 0
```

---

## Events

- RewardThresholdReached
- BusinessCellCreated
- RewardDistributionStarted
- WalletUpdated

---

# Scenario 4 — Large Purchase Creating Multiple ABCs

Threshold:

```text
120 RP
```

Purchase generates:

```text
480 RP
```

---

## Workflow

```text
480 RP

↓

ABC #1

↓

ABC #2

↓

ABC #3

↓

ABC #4
```

---

## Result

```text
4 Business Cells

↓

Same Transaction

↓

Same Correlation ID
```

---

## Events

Four BusinessCellCreated events.

One PurchaseCompleted event.

---

# Scenario 5 — Remaining Reward Points

Threshold:

```text
120 RP
```

Purchase:

```text
150 RP
```

---

## Result

```text
120 RP

↓

1 ABC

↓

30 RP Remaining
```

Remaining Reward Points stay available for future qualification.

---

# Scenario 6 — Cross-Country Referral

United States member sponsors a Philippine customer.

```text
US Member

↓

Sponsors

↓

PH Customer
```

---

## Result

Referral relationship exists.

Business Cells remain independent.

```text
US Matrix

≠

PH Matrix
```

---

# Scenario 7 — Referral Qualification

Member currently has:

```text
2 Qualified Referrals
```

A third referral qualifies.

---

## Workflow

```text
Referral

↓

Generates ABC

↓

Qualified Referral Count

↓

3
```

---

## Result

Unlock:

```text
Reward Level 10
```

Events:

- ReferralQualified
- RewardLevelUnlocked

---

# Scenario 8 — Country Transfer

Member moves permanently.

```text
Canada

↓

Australia
```

---

## Workflow

```text
Verification

↓

Country Updated

↓

Future ABC

↓

Australia Matrix
```

---

## Result

Existing Business Cells remain in Canada.

Future Business Cells enter Australia.

---

# Scenario 9 — Reward Distribution

New Business Cell created.

```text
ABC

↓

Level 1

↓

Level 2

↓

...

↓

Level 12
```

Each qualified ancestor receives:

```text
10 AHC
```

(Example configuration.)

---

## Events

- RewardDistributed
- WalletCredited
- LedgerEntryCreated

---

# Scenario 10 — Missing Qualified Ancestor

A level lacks a qualified Business Cell.

---

## Workflow

```text
Distribution

↓

Level Empty

↓

Skip

↓

Continue
```

Platform follows the configured distribution policy.

No historical data is modified.

---

# Scenario 11 — Wallet Withdrawal

Member requests withdrawal.

---

## Workflow

```text
Withdrawal Request

↓

Validation

↓

Approval

↓

Payment

↓

Ledger

↓

Completed
```

---

## Events

- WithdrawalRequested
- WithdrawalApproved
- PaymentCompleted

---

# Scenario 12 — Duplicate API Request

Network retries identical request.

---

## Workflow

```text
API Request

↓

Duplicate Detection

↓

Existing Transaction Found

↓

Ignore Duplicate
```

---

## Result

Only one Business Cell exists.

---

# Scenario 13 — Replay Recovery

Projection becomes corrupted.

---

## Workflow

```text
Delete Projection

↓

Replay Events

↓

Projection Rebuilt
```

Financial history remains unchanged.

---

# Scenario 14 — Administrator Updates Configuration

Administrator changes:

```text
Reward Threshold

120 RP

↓

132 RP
```

---

## Result

Historical Business Cells remain unchanged.

Future Business Cells use:

```text
132 RP
```

---

# Scenario 15 — AI Recommendation

AI detects:

```text
Large Increase

↓

Queue Latency
```

Recommendation:

Increase worker count.

Administrator approves.

---

## Events

- AIRecommendationGenerated
- AIRecommendationApproved

---

# Scenario 16 — Suspicious Login

Administrator login:

```text
California

↓

5 Minutes Later

↓

Singapore
```

---

## Result

Impossible travel detected.

MFA required.

Security alerted.

---

# Scenario 17 — Fraud Detection

Member creates hundreds of accounts.

---

## AI Analysis

```text
Referral Cluster

↓

Shared Device

↓

Shared IP

↓

High Risk
```

---

## Result

Accounts flagged.

Administrator notified.

No automatic financial modification occurs.

---

# Scenario 18 — Business Cell Replay

Historical event stream:

```text
ABC1

ABC2

ABC3

ABC4
```

Replay produces identical Business Cell state.

Replay must always be deterministic.

---

# Scenario 19 — System Failure During Distribution

Failure occurs after:

```text
Level 4
```

---

## Recovery

```text
Checkpoint

↓

Replay

↓

Resume

↓

Exactly Once
```

Duplicate rewards are prevented through idempotent processing.

---

# Scenario 20 — Country Threshold Change

Philippines threshold:

```text
60 RP

↓

72 RP
```

---

## Result

Existing Business Cells:

Unaffected

Future Business Cells:

72 RP Required

---

# Scenario 21 — Member Generates 12 ABCs

Large campaign generates:

```text
1,440 RP
```

Threshold:

```text
120 RP
```

---

## Result

```text
12 Business Cells

↓

Sequential Placement

↓

12 Reward Distributions
```

---

# Scenario 22 — Inactive Member Returns

Member has:

```text
40 RP
```

Returns months later.

Purchases:

```text
80 RP
```

---

## Result

```text
120 RP

↓

Business Cell Created
```

Reward Points never expire unless future policy states otherwise.

---

# Scenario 23 — AI Explains Reward Distribution

Administrator asks:

> Why did this member receive 80 AHC?

AI response:

- ABC created
- Eight qualified ancestors
- Ten AHC each
- Four levels unqualified

Complete audit trail provided.

---

# Scenario 24 — Administrator Reviews Audit Trail

Administrator investigates.

Workflow:

```text
Search

↓

Correlation ID

↓

Purchase

↓

ABC

↓

Rewards

↓

Wallet

↓

Notifications
```

Entire workflow reconstructed from immutable events.

---

# Scenario 25 — Global Dashboard

Dashboard displays:

```text
United States

Canada

Philippines

Australia
```

Metrics include:

- Members
- ABCs
- Rewards
- Revenue
- Wallet balances

Each country remains operationally isolated.

---

# Scenario 26 — Member Deactivation

Member account becomes inactive.

Result:

- Existing ABCs remain immutable.
- Historical rewards remain unchanged.
- Future earning eligibility follows the platform's inactive-member policy.
- Audit records remain permanently retained.

---

# Scenario 27 — Disaster Recovery

Primary infrastructure fails.

Recovery workflow:

```text
Restore Infrastructure

↓

Restore Event Store

↓

Replay Events

↓

Rebuild Read Models

↓

Platform Operational
```

No financial history is recreated manually.

---

# Common Validation Checklist

Each scenario should verify:

- Business rules
- Event publication
- Ledger integrity
- Wallet accuracy
- Country isolation
- Audit logging
- Notification delivery
- API responses
- Security enforcement
- AI recommendations (where applicable)

---

# Business Rules Demonstrated

These scenarios reinforce the following core principles:

- Reward Points qualify Business Cells.
- Business Cells are immutable.
- Historical data is never modified.
- Every country owns its own matrix.
- Reward distribution is deterministic.
- The ledger is the financial source of truth.
- Replay produces identical outcomes.
- Configuration changes affect future events only.
- AI provides recommendations, not financial authority.
- Every administrative action is auditable.

---

# Best Practices

- Use these scenarios as acceptance test cases.
- Convert each scenario into automated integration tests where possible.
- Preserve deterministic outcomes across all environments.
- Validate country-specific behavior independently.
- Test replay and disaster recovery regularly.
- Keep scenario documentation synchronized with business rules.
- Expand this catalog as new platform capabilities are introduced.

---

# Related Documents

- 001-glossary.md
- 002-configuration-reference.md
- 003-country-examples.md
- 005-event-catalog.md
- 006-api-conventions.md
- 007-security-guidelines.md

---

# Summary

The Example Scenarios document bridges the gap between architecture and implementation by illustrating how the AsBeez Beehive Matrix behaves under realistic operational conditions. Covering member onboarding, Business Cell creation, reward distribution, cross-country operations, administrative workflows, AI-assisted management, security, compliance, and disaster recovery, these examples provide a practical reference for designing, developing, testing, operating, and auditing the platform while ensuring consistent application of immutable, event-driven business rules across every country and deployment.