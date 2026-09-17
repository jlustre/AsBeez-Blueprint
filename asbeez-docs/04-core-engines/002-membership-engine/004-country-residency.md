# Country & Residency

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Membership Engine |
| Document | Country & Residency |
| Document ID | AEDS-ME-004 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Platform Architecture Team |

---

# Introduction

The Membership Engine is designed to support a global ecosystem.

Every Customer and Member belongs to a residency country.

The residency country determines which localized business rules apply to that participant.

Rather than creating separate systems for each country, the AsBeez Platform uses configurable country profiles that allow the same platform to operate worldwide while respecting local business requirements.

---

# Purpose

The Country & Residency subsystem exists to:

- Assign participants to a residency country.
- Apply country-specific business rules.
- Support local currencies.
- Support local taxation.
- Support local compliance.
- Support localized qualification rules.
- Support future international expansion.

---

# Guiding Principle

> **One global platform. Configurable local business rules.**

---

# Residency

Every Membership has one active residency country.

The residency country determines the participant's operational environment.

Examples include:

- United States
- Canada
- Philippines
- Australia
- Japan

Historical residency changes are preserved for auditing purposes.

---

# Country Profile

Every supported country has its own Country Profile.

The Country Profile contains configurable business settings.

Examples include:

- Country Name
- Country Code
- Currency
- Time Zone
- Language
- Date Format
- Tax Rules
- Qualification Rules
- Reward Rules
- Compliance Requirements
- Membership Policies

No country-specific logic should be hard-coded into the application.

---

# Country Configuration

The Configuration Engine manages country-specific settings.

Examples include:

```text
Country

↓

Currency

↓

ABC Threshold

↓

Reward Policies

↓

Membership Policies

↓

Compliance Rules

↓

Taxes

↓

Supported Payment Methods
```

The Membership Engine consumes these configurations.

---

# ABC Qualification Threshold

One of the most important country settings is the ABC Qualification Threshold.

A Customer becomes a Qualified Member only after earning at least one ABC.

The Reward Points (RP) required to generate one ABC are configurable by country.

Examples:

| Country | RP Required for 1 ABC |
|----------|----------------------:|
| United States | 120 RP |
| Canada | 60 RP |
| Philippines | 36 RP |

---

# Business Rule

The ABC Qualification Threshold:

- Must be configurable.
- May differ between countries.
- Must always be divisible by **12**.

Examples of valid values:

- 24
- 36
- 48
- 60
- 72
- 84
- 96
- 108
- 120
- 144

This ensures consistent calculations throughout the Rewards Engine.

---

# Why Divisible by 12?

The Rewards Engine distributes value across twelve reward periods.

Using thresholds divisible by twelve guarantees:

- Whole-number calculations
- No fractional ABC values
- Consistent reporting
- Simpler accounting
- Easier auditing

This rule applies globally.

---

# Country-Specific Business Rules

Each country may define:

- Membership Fees
- Enrollment Policies
- Qualification Thresholds
- Available Products
- Reward Programs
- Referral Policies
- Vendor Policies
- Financial Rules
- Legal Requirements

Country policies should remain configurable.

---

# Residency Changes

Members may permanently relocate.

A residency change updates:

- Country
- Currency
- Time Zone
- Qualification Rules
- Local Benefits
- Tax Configuration
- Compliance Requirements

Historical residency records are never deleted.

---

# Residency History

Every residency change should be recorded.

Examples:

| Date | From | To | Reason |
|------|------|----|--------|
| 2028-05-01 | Canada | United States | Permanent Relocation |

The Membership Engine maintains the complete history.

---

# Country Transfer Policies

A residency transfer may affect:

- Future qualification calculations
- Membership benefits
- Available products
- Available payment methods
- Country-specific promotions
- Reporting

Platform policy determines whether historical qualifications remain unchanged.

---

# Currency

Each country has a default operating currency.

Examples:

| Country | Currency |
|----------|----------|
| United States | USD |
| Canada | CAD |
| Philippines | PHP |
| Japan | JPY |

The Membership Engine references currency information but does not perform financial calculations.

The Financial Engine owns monetary operations.

---

# Language & Localization

Country configuration may include:

- Default Language
- Regional Formatting
- Date Formats
- Number Formats
- Time Zone
- Measurement Units

Localization improves participant experience without affecting business rules.

---

# Compliance

Countries may require different compliance rules.

Examples include:

- Identity verification
- Tax reporting
- Privacy regulations
- Data retention
- Residency verification
- Business registration

Compliance rules are configurable.

---

# Relationship with Other Platform Engines

The Country & Residency subsystem provides country context for:

| Platform Engine | Example |
|-----------------|---------|
| Rewards Engine | Country-specific ABC thresholds. |
| Financial Engine | Currency, taxes, payment methods. |
| Commerce Engine | Available products and pricing. |
| Vendor Engine | Vendor eligibility. |
| Partner Engine | Partnership programs. |
| Notification Engine | Language and communication preferences. |
| Analytics Engine | Country reporting. |

---

# AI Capabilities

Artificial Intelligence may assist by:

- Detecting inconsistent residency information.
- Recommending country transfers.
- Predicting expansion opportunities.
- Identifying localization issues.
- Forecasting regional growth.
- Monitoring country participation trends.

---

# Future Expansion

The architecture should support:

- Hundreds of countries
- Multiple currencies
- Regional business rules
- Country-specific qualification models
- Cross-border participation
- Multi-country organizations
- Global reporting

Expansion should require configuration rather than code changes.

---

# Closing Statement

The Country & Residency subsystem enables the AsBeez Platform to operate globally while respecting local business requirements.

By centralizing country-specific rules into configurable profiles, the platform can support new markets without redesigning the Membership Engine.

This approach allows AsBeez to remain one platform serving many countries through configuration rather than customization.

---

# Guiding Principle

> **Global architecture. Local flexibility. Every country follows the same platform while applying its own configurable business rules, ensuring consistency, scalability, and compliance across the AsBeez ecosystem.**

---

# Related Documents

- 002-domain-model.md
- 003-membership-lifecycle.md
- 005-referrals-sponsorship.md
- 006-qualifications.md
- 03-platform-strategy/007-configuration-over-customization.md
- 03-platform-strategy/010-global-platform-strategy.md

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Country & Residency architecture for the Membership Engine. |