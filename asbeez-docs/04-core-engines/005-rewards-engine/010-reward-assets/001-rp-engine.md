# Reward Points (RP) Engine

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Rewards Engine |
| Document | Reward Points (RP) Engine |
| Document ID | AEDS-RE-003 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Rewards Platform Team |

---

# Introduction

Reward Points (RP) are the fundamental unit of measurable business value within the AsBeez ecosystem.

Every qualifying business activity generates Reward Points according to configurable business rules.

RP serves as the foundation for:

- Membership qualification
- ABC creation
- AHC generation
- Incentive programs
- Recognition programs
- Organizational performance
- Business analytics
- AI recommendations

The RP Engine is responsible for calculating, tracking, and managing Reward Points across the platform.

---

# Purpose

The RP Engine exists to:

- Measure qualifying business activity.
- Calculate Reward Points.
- Maintain RP balances.
- Generate reward transactions.
- Trigger reward events.
- Support qualification.
- Support incentive programs.
- Support future reward assets.

---

# Guiding Principle

> **Reward Points measure business value—not financial value.**

---

# What are Reward Points?

Reward Points (RP) represent the standardized measurement of qualifying business activity.

RP is not:

- Currency
- Cash
- Commission
- Wallet Balance
- Cryptocurrency

RP is a business measurement used throughout the AsBeez ecosystem.

---

# RP Lifecycle

```text
Business Activity
        │
        ▼
Reward Rule Evaluation
        │
        ▼
RP Earned
        │
        ▼
Reward Ledger
        │
        ▼
RP Balance Updated
        │
        ▼
Business Events
```

RP is always earned through business activities.

---

# Sources of RP

Examples of qualifying activities include:

- Product purchases
- Subscription purchases
- Service purchases
- Promotional campaigns
- Organizational achievements
- Business incentives
- Future configurable activities

All RP-generating activities are defined by Reward Rules.

---

# RP Calculation

RP is calculated using configurable business rules.

Example:

```text
Business Activity

↓

Reward Rule

↓

RP Calculation

↓

Reward Transaction

↓

Reward Ledger
```

Reward calculations should never be hard-coded.

---

# Country Configuration

Each country may define:

- RP earning rules
- Product qualification values
- Promotional multipliers
- Campaign bonuses
- Qualification thresholds

The RP Engine reads these values from the Configuration Engine.

---

# RP Ledger

Every RP transaction is recorded in the Reward Ledger.

Examples:

| Date | Activity | RP | Type |
|------|----------|---:|------|
| Jan 10 | Product Purchase | +40 | Earned |
| Jan 12 | Subscription Renewal | +20 | Earned |
| Jan 15 | Order Cancellation | -40 | Reversal |

The ledger is immutable.

Corrections create new transactions.

Original transactions are never modified.

---

# RP Balance

Current RP is calculated from the Reward Ledger.

```text
Earned RP

-

Reversed RP

+

Adjustments

=

Current RP Balance
```

Balances are derived values.

They should never be edited directly.

---

# RP Status

Possible RP states include:

- Pending
- Earned
- Approved
- Reversed
- Expired *(future)*
- Archived

Status transitions are controlled by Reward Policies.

---

# RP Rules

## RP-001

Every Customer has one Reward Account.

---

## RP-002

RP is earned only through qualifying business activities.

---

## RP-003

Every RP transaction is immutable.

---

## RP-004

RP balances are calculated.

They are never manually maintained.

---

## RP-005

RP calculations are configuration-driven.

---

## RP-006

RP does not represent money.

---

## RP-007

RP may contribute to:

- ABC creation
- AHC generation
- Incentive qualification
- Recognition programs

---

## RP-008

RP earning rules may differ by country.

---

## RP-009

Administrative adjustments require complete audit history.

---

# RP and ABC

One of RP's primary purposes is generating ABC.

```text
RP Earned

↓

RP Balance

↓

ABC Threshold Reached

↓

ABC Created
```

The Membership Engine later determines qualification.

---

# RP and Membership

The Membership Engine does not calculate RP.

Instead:

Rewards Engine

↓

ABCCreated

↓

MembershipQualified

This separation keeps both engines independent.

---

# RP Expiration

The platform may support RP expiration.

Possible models include:

- Never expires
- Rolling expiration
- Annual expiration
- Campaign expiration

Expiration policies are configurable.

---

# Administrative Operations

Authorized administrators may:

- Adjust RP
- Reverse RP
- Correct transactions
- Investigate anomalies

Administrative actions never modify historical transactions.

---

# Domain Events

Examples include:

- RewardPointsEarned
- RewardPointsAdjusted
- RewardPointsReversed
- RewardPointsExpired
- RewardBalanceUpdated

Events publish completed business facts.

---

# AI Capabilities

AI may assist by:

- Detecting abnormal RP patterns
- Predicting qualification
- Identifying fraud
- Forecasting RP accumulation
- Recommending qualifying activities
- Optimizing reward rules

AI never modifies RP directly.

---

# Relationship with Other Platform Engines

| Platform Engine | Relationship |
|-----------------|-------------|
| Commerce Engine | Generates qualifying activities. |
| Membership Engine | Consumes ABC outcomes derived from RP. |
| Financial Engine | May use RP-derived assets for settlement eligibility. |
| Analytics Engine | Measures reward performance. |
| AI Engine | Predicts qualification and engagement. |

---

# Future Expansion

Future capabilities may include:

- RP multipliers
- Promotional RP
- Bonus RP
- Seasonal campaigns
- Cross-industry RP
- Community participation RP
- Learning RP
- Volunteer RP

These should extend the RP model through configuration.

---

# Closing Statement

Reward Points are the foundational measurement of business value within the AsBeez ecosystem.

By separating Reward Points from financial value and managing them through immutable transactions, configurable rules, and transparent calculations, the RP Engine provides a scalable and auditable foundation for qualification, incentives, recognition, and future reward systems.

---

# RP Principle

> **Reward Points are measurable business assets earned through qualifying participation. They provide the foundation for reward calculations while remaining independent of financial settlement, ensuring transparency, fairness, and long-term scalability.**

---

# Related Documents

- 001-overview.md
- 002-domain-model.md
- 004-abc-engine.md
- 005-ahc-engine.md
- 008-reward-policies.md
- 009-api.md
- 010-events.md
- Membership Engine – Qualifications

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial RP Engine specification. |