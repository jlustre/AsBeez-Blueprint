# RP Earning Rules

## Introduction

The **Reward Point (RP) Earning Rules** define the policies, calculations, conditions, validations, and workflows that determine how Members earn Reward Points throughout the AsBeez ecosystem.

These rules ensure that Reward Points are awarded consistently, fairly, transparently, and sustainably while supporting the long-term economic health of the platform.

Every Reward Point issued must originate from a valid business event governed by configurable earning rules.

---

# Purpose

The RP Earning Rules exist to:

- Standardize Reward Point calculations.
- Encourage marketplace participation.
- Reward customer loyalty.
- Increase repeat purchases.
- Promote vendor participation.
- Support promotional campaigns.
- Prevent abuse.
- Ensure financial sustainability.
- Maintain regulatory compliance.
- Support future marketplace expansion.

---

# Guiding Principles

The RP earning system follows these principles:

- Commerce-first
- Configuration-driven
- Transparent
- Deterministic
- Auditable
- Sustainable
- AI-assisted
- Globally scalable

---

# Reward Lifecycle

```text
Business Activity

↓

Qualification Validation

↓

Applicable Rules

↓

RP Calculation

↓

Fraud Validation

↓

Approval

↓

RP Ledger Entry

↓

Member Balance Updated

↓

Notifications

↓

Analytics
```

Every earning event follows this standardized workflow.

---

# Rewardable Activities

Reward Points may be earned from various activities.

---

## Marketplace Purchases

The primary RP source.

Eligible examples include:

- Physical products
- Digital products
- Downloadable products
- Online courses
- Software licenses
- Professional services
- Marketplace subscriptions
- Event registrations

---

## Vendor Promotions

Vendor-sponsored campaigns.

Examples:

- Double RP
- Triple RP
- New product launch
- Vendor anniversary
- Featured product

---

## Marketplace Promotions

Examples include:

- Black Friday
- Cyber Monday
- Christmas Sale
- Independence Day
- Company Anniversary
- Flash Sales

---

## Membership Milestones

Examples:

- First Purchase
- First Year Anniversary
- 100 Orders
- 500 Orders
- Lifetime Spending Goals

---

## Referral Activities

Examples:

- Qualified Referral
- Referral First Purchase
- Referral First ABC

Referral policies are documented separately.

---

## Achievement Rewards

Examples:

- Complete Profile
- Verify Email
- Verify Phone
- Leave Product Reviews
- Upload Avatar

---

## Community Engagement

Future examples:

- Helpful reviews
- Educational participation
- Community moderation
- Content contributions

---

# Qualification Rules

Before RP is awarded, several validations occur.

---

## Member Eligibility

Member must:

- have an active account
- satisfy membership policies
- not be suspended
- not be flagged for fraud

---

## Transaction Eligibility

Transaction must be:

- completed
- fully paid
- verified
- not refunded
- not cancelled

---

## Product Eligibility

Products may specify:

- Rewardable
- Non-rewardable
- Promotional
- Limited reward
- Vendor-specific reward

---

## Vendor Eligibility

Vendor must:

- be active
- satisfy marketplace policies
- participate in reward programs

---

# Standard Earning Formula

Example:

```text
Qualified Purchase

×

Reward Rate

=

Reward Points
```

Example:

```text
$250 Purchase

×

1 RP

=

250 RP
```

The formula is fully configurable.

---

# Alternative Calculation Methods

The engine supports multiple earning models.

---

## Fixed Rate

```text
1 RP

per

$1
```

---

## Percentage

```text
Purchase

×

5%

↓

RP Equivalent
```

---

## Product Category

Different categories may earn different RP.

Example:

| Category | RP Rate |
|----------|---------|
| Electronics | 1x |
| Groceries | 2x |
| Digital | 3x |
| Courses | 5x |

---

## Vendor-Specific

Each Vendor may define custom RP rates within platform limits.

---

## Membership Tier

Future support:

| Tier | Multiplier |
|------|------------|
| Standard | 1x |
| Silver | 1.25x |
| Gold | 1.5x |
| Platinum | 2x |

---

# Promotional Multipliers

Multiple promotions may apply.

Example:

```text
Base RP

100

Holiday Bonus

2x

Vendor Bonus

1.5x

↓

300 RP
```

Stacking behavior is configurable.

---

# Maximum Reward Limits

The platform may define:

- Maximum RP per order
- Maximum RP per day
- Maximum RP per campaign
- Maximum RP per month
- Vendor reward limits

Limits help maintain sustainability.

---

# Minimum Purchase Requirements

Examples:

```text
Minimum Purchase

$20

↓

Eligible
```

Below threshold:

```text
No RP Awarded
```

Policies remain configurable.

---

# Pending Rewards

RP may initially remain in a Pending state.

Example workflow:

```text
Order Completed

↓

Pending RP

↓

Return Period Ends

↓

Available RP
```

Pending RP cannot generate ABCs.

---

# Refund Handling

Example:

```text
Purchase

↓

100 RP Earned

↓

Refund

↓

100 RP Reversed
```

If RP has already been converted into an ABC, separate adjustment policies apply.

---

# Partial Refunds

Example:

```text
Purchase

$200

↓

200 RP

↓

Refund

$50

↓

Reverse

50 RP
```

---

# Chargebacks

Chargebacks automatically trigger:

- RP reversal
- fraud review
- AI analysis
- audit entries

---

# Fraud Validation

Before RP becomes available, AI evaluates:

- duplicate accounts
- purchase velocity
- fake orders
- referral abuse
- promotion exploitation
- unusual spending patterns

Suspicious RP may be reserved.

---

# Country Rules

Each country may configure:

- earning rate
- minimum purchase
- promotional limits
- exclusions
- taxation considerations

Example:

| Country | RP Rate |
|----------|----------|
| USA | 1 RP / $1 |
| Canada | 1 RP / CAD |
| Philippines | 2 RP / ₱100 |

Country rules remain configurable.

---

# Campaign Rules

Campaigns may define:

- start date
- end date
- participating Vendors
- participating Products
- earning multiplier
- maximum reward

Campaign rules automatically expire.

---

# Product Rules

Each product may specify:

- Rewardable
- Bonus eligible
- Promotion eligible
- Referral eligible
- Vendor sponsored

Rules inherit from category unless overridden.

---

# Vendor Rules

Vendor-specific settings may include:

- RP multiplier
- campaign participation
- promotional budgets
- seasonal bonuses

Vendor rules cannot violate platform limits.

---

# AI Optimization

AI continuously evaluates:

- reward effectiveness
- customer engagement
- conversion rates
- purchase frequency
- vendor performance
- campaign ROI

AI recommendations improve future earning strategies.

---

# Administrative Controls

Authorized administrators may:

- create earning rules
- modify campaigns
- disable promotions
- approve adjustments
- review fraud cases

Every administrative action is audited.

---

# Reporting

Reports include:

- RP issued
- RP by Vendor
- RP by Product
- RP by Campaign
- RP by Country
- RP by Customer Segment
- RP conversion rates
- liability forecasts

---

# Notifications

Members receive notifications when:

- RP earned
- bonus earned
- campaign activated
- milestone reached
- pending RP released
- RP reversed

Timely communication increases engagement.

---

# Security

Security measures include:

- RBAC
- audit logs
- fraud detection
- encrypted calculations
- immutable ledger entries
- approval workflows

Financial integrity is prioritized.

---

# Event Generation

Every earning event generates business events.

Examples:

```text
RewardPointCalculated

RewardPointPending

RewardPointEarned

RewardPointReleased

RewardPointReversed

PromotionApplied

CampaignRewardGranted
```

Events power downstream services.

---

# Integration with Core Engines

## Identity Engine

Member verification

Eligibility

---

## Membership Engine

Membership status

Qualification

---

## Marketplace Engine

Purchase events

Marketplace campaigns

---

## Product Engine

Product reward configuration

Category rules

---

## Vendor Engine

Vendor promotions

Vendor multipliers

---

## Order Engine

Completed orders

Refunds

Returns

---

## Financial Engine

Liability calculations

Accounting

Reserve forecasting

---

## Analytics Engine

Reward reports

Campaign analytics

Executive dashboards

---

## AI Engine

Optimization

Predictions

Fraud detection

---

## Notification Engine

Member alerts

Campaign announcements

Reward confirmations

---

# Best Practices

- Keep earning rules simple and transparent.
- Reward genuine commerce.
- Use configuration instead of hardcoding.
- Separate business rules from calculations.
- Audit every reward issuance.
- Monitor campaign profitability.
- Continuously evaluate reward liabilities.
- Use AI to improve reward effectiveness.
- Minimize opportunities for abuse.
- Review earning rules regularly.

---

# Future Enhancements

Potential future capabilities include:

- Personalized AI earning rates
- Dynamic promotional multipliers
- Coalition loyalty earning
- ESG reward campaigns
- Cross-marketplace earning
- Smart contract validation
- Geo-location rewards
- Time-sensitive earning opportunities
- Behavioral incentives
- AI-driven adaptive reward models

---

# Related Documents

- 003-reward-points-rp.md
- 004-rp-ledger.md
- 006-rp-redemption-rules.md
- 022-rewards-marketplace.md
- 024-loyalty-programs.md
- 027-promotions-bonus-programs.md
- 028-rewards-analytics.md
- 032-fraud-prevention.md
- 035-ai-capabilities.md

---

# Summary

The RP Earning Rules establish the complete framework for how Reward Points are earned throughout the AsBeez ecosystem. By defining configurable qualification criteria, calculation methods, promotional multipliers, validation workflows, fraud controls, and AI-assisted optimization, the engine ensures that every Reward Point awarded is fair, transparent, financially sustainable, and directly tied to meaningful marketplace activity. These rules form the foundation for transforming customer engagement into long-term digital business ownership through the AsBeez Rewards & Loyalty Engine.