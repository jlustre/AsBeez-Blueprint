# Sponsor Rewards

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Rewards Engine |
| Section | Contribution Programs |
| Document | Sponsor Rewards |
| Document ID | AEDS-RE-020-001 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Rewards Platform Team |

---

# Introduction

The Sponsor Rewards Program recognizes Members who introduce new participants into the AsBeez ecosystem and support their long-term success.

Unlike traditional referral or recruitment commissions, Sponsor Rewards are not direct financial payments.

Instead, qualifying activities performed by a referred participant may generate additional Reward Points (RP) for the Sponsor according to configurable business rules.

Those Reward Points become part of the Sponsor's normal reward lifecycle and may eventually create additional Business Cells (ABC) and Hive Credits (AHC).

Sponsor Rewards encourage Members to build healthy, productive, and sustainable relationships rather than focusing solely on recruitment.

---

# Purpose

The Sponsor Rewards Program exists to:

- Encourage quality sponsorship.
- Reward Member development.
- Promote long-term engagement.
- Increase ecosystem growth.
- Generate additional Reward Points.
- Encourage mentoring and support.

---

# Guiding Principle

> **Sponsors are rewarded when the people they introduce successfully contribute to the ecosystem.**

---

# What is a Sponsor Reward?

A Sponsor Reward is an allocation of Reward Points (RP) granted to a Sponsor when a referred participant performs qualifying activities.

Sponsor Rewards:

- are awarded in RP
- are configuration-driven
- are non-financial
- participate in the standard RP → ABC → AHC lifecycle

Sponsor Rewards are **not**:

- commissions
- cash payments
- overrides
- bonuses paid directly in money

---

# Reward Flow

```text
Sponsor

        │

Introduces Customer

        │

Customer Performs Qualifying Activity

        │

Sponsor Reward Policy

        │

Sponsor Earns RP

        │

Reward Ledger Updated

        │

RP Balance Updated

        │

ABC Created (when qualified)

        │

AHC Generated
```

Sponsor Rewards strengthen the ecosystem by helping Sponsors build additional productive Business Cells.

---

# Qualifying Activities

Sponsor Rewards may be earned from activities such as:

- Product purchases
- Service purchases
- Subscription renewals
- Promotional purchases
- Campaign-qualified activities
- Future qualifying activities

Qualifying activities are determined by Reward Policies.

---

# Sponsor Reward Tiers

Sponsor Reward percentages are configurable.

A recommended default policy is:

| Referred Participant Status | Sponsor RP |
|-----------------------------|-----------:|
| Customer | 5% |
| Qualified Member | 10% |
| Inactive Member | Configurable |
| Lapsed Member | Configurable (Default: 0%) |

The platform administrator may configure these percentages by country or program.

---

# Lifetime Relationship

Sponsor Rewards are based on the lifetime Sponsor relationship.

Once established:

- the Sponsor remains associated with the referred participant
- qualifying activities continue to generate Sponsor Rewards according to platform policies
- reward eligibility may change based on the referred participant's lifecycle status

The Sponsor relationship itself is immutable except through approved administrative processes.

---

# Reward Calculation

Example:

Customer purchases:

```text
120 RP
```

Sponsor Reward:

```text
10%

↓

12 RP
```

Those 12 RP become part of the Sponsor's RP balance.

When sufficient RP accumulate, they may create additional Business Cells.

---

# Business Rules

## SR-001

Sponsor Rewards are awarded only in Reward Points (RP).

---

## SR-002

Sponsor Rewards never create direct monetary payments.

---

## SR-003

Sponsor Reward percentages are configuration-driven.

---

## SR-004

Sponsor Rewards participate in the standard RP lifecycle.

---

## SR-005

Sponsor RP may contribute toward future Business Cell creation.

---

## SR-006

Sponsor Rewards are calculated from qualifying activities only.

---

## SR-007

The Sponsor relationship is established during the referred participant's first successful registration and follows the Membership Engine's sponsorship policies.

---

## SR-008

A referred participant may have only one active Sponsor relationship at any point in time.

---

## SR-009

Sponsor Rewards are recorded in immutable Reward Ledgers.

---

## SR-010

Sponsor Reward percentages may vary by country, campaign, or contribution program.

---

# Configuration

The Sponsor Rewards Program should support configuration of:

- Customer percentage
- Qualified Member percentage
- Inactive Member percentage
- Lapsed Member percentage
- Qualifying activities
- Country overrides
- Campaign overrides
- Effective dates

All changes should be versioned for auditability.

---

# Reward Ledger

Every Sponsor Reward is recorded.

Example:

| Date | Source | Activity | RP |
|------|--------|----------|---:|
| Jan 15 | Mary | Product Purchase | +12 |
| Feb 10 | Mary | Subscription Renewal | +6 |

Sponsor Rewards are never merged into anonymous balances.

Every transaction remains traceable to its originating contribution.

---

# Domain Events

Examples include:

- SponsorRewardCalculated
- SponsorRewardAwarded
- SponsorRewardAdjusted
- SponsorRewardReversed

Events represent completed business facts.

---

# AI Capabilities

Artificial Intelligence may assist by:

- identifying successful Sponsors
- predicting Member success
- recommending mentoring opportunities
- detecting abnormal Sponsor Reward activity
- optimizing Sponsor Reward policies

AI never awards Sponsor Rewards directly.

---

# Relationship with Other Platform Engines

| Platform Engine | Relationship |
|-----------------|--------------|
| Membership Engine | Provides Sponsor relationships and participant status. |
| RP Engine | Receives awarded Sponsor RP. |
| ABC Engine | Creates Business Cells from accumulated RP. |
| AHC Engine | Generates Hive Credits when Sponsor RP creates new Business Cells. |
| Campaign Engine | May temporarily modify Sponsor Reward percentages. |
| Analytics Engine | Measures Sponsor effectiveness. |

---

# Future Expansion

Future capabilities may include:

- Multi-program Sponsor Rewards
- Vendor Sponsor Rewards
- Corporate Sponsor Rewards
- Educational Sponsor Rewards
- Strategic Partner Rewards
- AI-personalized Sponsor incentives

The architecture should support these enhancements through configuration.

---

# Closing Statement

The Sponsor Rewards Program recognizes Members who help grow and strengthen the AsBeez ecosystem through successful sponsorship.

By rewarding meaningful participation with Reward Points instead of direct financial commissions, the program reinforces the platform's philosophy that sustainable growth comes from developing productive Members who contribute lasting value to the Business Hive.

---

# Sponsor Reward Principle

> **Sponsor Rewards recognize the ongoing contribution of helping others become successful participants in the AsBeez ecosystem. Rewarding contribution through Reward Points reinforces sustainable growth while preserving the unified economic flow of RP → Business Cells → Hive Credits.**

---

# Related Documents

- 010-reward-assets/001-rp-engine.md
- 010-reward-assets/002-abc-engine.md
- 010-reward-assets/003-ahc-engine.md
- 002-membership-engine/005-referrals-sponsorship.md
- 030-governance/001-reward-policies.md

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Sponsor Rewards specification. |