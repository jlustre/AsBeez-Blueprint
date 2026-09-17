# Country Examples

> **Document:** `11-beehive-matrix/999-reference/003-country-examples.md`

---

# Overview

The **Country Examples** document demonstrates how the AsBeez Beehive Matrix operates across different countries while maintaining a consistent global architecture.

Although every country follows the same core Beehive Matrix principles, each country may configure its own:

- Reward Point (RP) threshold
- Currency
- Tax rules
- Compliance requirements
- Privacy regulations
- Language
- Time zone
- Reward conversion policies
- Business rules

This document provides practical examples for architects, developers, testers, administrators, and business stakeholders.

---

# Objectives

This document exists to:

- demonstrate country isolation
- illustrate configurable business rules
- provide implementation examples
- simplify testing
- support future expansion
- validate multi-country architecture

---

# Country Independence

Every country operates its own independent Beehive Matrix.

```text
Global Platform

├── United States Matrix
├── Canada Matrix
├── Philippines Matrix
├── Australia Matrix
├── United Kingdom Matrix
├── Singapore Matrix
└── Future Countries...
```

Each matrix is completely independent.

---

# Country Configuration Model

Each country maintains its own configuration.

```text
Country

↓

Configuration

├── Reward Threshold
├── Currency
├── Matrix
├── Tax Rules
├── Compliance
├── Language
├── Time Zone
└── Reward Policies
```

---

# Example 1 — United States

## Basic Information

| Property | Value |
|----------|-------|
| Country Code | US |
| Currency | USD |
| Language | English |
| Time Zone | Multiple |
| Matrix | United States Matrix |

---

## Reward Configuration

| Setting | Example |
|----------|---------|
| RP Threshold | 120 RP |
| AHC Distribution | Standard |
| Referral Levels | Standard |
| Wallet Currency | USD |

---

## Sample Workflow

```text
Member

↓

Purchases

↓

120 RP

↓

1 ABC

↓

Inserted into

US Matrix

↓

AHC Distributed

↓

Wallet Updated
```

---

# Example 2 — Canada

## Basic Information

| Property | Value |
|----------|-------|
| Country Code | CA |
| Currency | CAD |
| Language | English / French |
| Matrix | Canada Matrix |

---

## Reward Configuration

| Setting | Example |
|----------|---------|
| RP Threshold | 120 RP |
| Wallet Currency | CAD |
| Country Compliance | Canadian |

---

## Workflow

```text
120 RP

↓

1 ABC

↓

Canada Matrix

↓

Canadian Wallet

↓

CAD Reporting
```

---

# Example 3 — Philippines

## Basic Information

| Property | Value |
|----------|-------|
| Country Code | PH |
| Currency | PHP |
| Language | Filipino / English |
| Matrix | Philippines Matrix |

---

## Reward Configuration

| Setting | Example |
|----------|---------|
| RP Threshold | 60 RP *(Illustrative Example)* |
| Wallet Currency | PHP |
| Compliance | Philippine Regulations |

---

## Workflow

```text
60 RP

↓

1 ABC

↓

Philippines Matrix

↓

Reward Distribution

↓

PHP Wallet
```

---

# Example 4 — Australia

| Property | Value |
|----------|-------|
| Country Code | AU |
| Currency | AUD |
| RP Threshold | 120 RP *(Example)* |
| Matrix | Australia Matrix |

---

# Example 5 — United Kingdom

| Property | Value |
|----------|-------|
| Country Code | GB |
| Currency | GBP |
| RP Threshold | 120 RP *(Example)* |
| Matrix | United Kingdom Matrix |

---

# Example 6 — Singapore

| Property | Value |
|----------|-------|
| Country Code | SG |
| Currency | SGD |
| RP Threshold | 120 RP *(Example)* |
| Matrix | Singapore Matrix |

---

# Reward Threshold Examples

The threshold is configurable per country.

| Country | Example Threshold |
|----------|------------------:|
| United States | 120 RP |
| Canada | 120 RP |
| Philippines | 60 RP |
| Australia | 120 RP |
| Singapore | 120 RP |

> **Note:** Threshold values shown are illustrative examples. Actual production values are determined by each country's approved business configuration.

---

# Why Thresholds May Differ

Business reasons include:

- purchasing power
- average product pricing
- exchange rates
- taxation
- local regulations
- promotional campaigns
- market strategy

Despite different thresholds, the business logic remains identical.

---

# Business Cell Creation Example

## United States

```text
120 RP

↓

1 ABC
```

---

## Philippines

```text
60 RP

↓

1 ABC
```

Both members generate exactly one Business Cell.

Only the qualification threshold differs.

---

# Country Matrix Isolation

Example:

```text
United States

Member A

↓

US Matrix
```

Independent from:

```text
Canada

Member B

↓

Canada Matrix
```

No Business Cell crosses country boundaries.

---

# Cross-Country Referrals

Members may sponsor members from another country.

Example:

```text
United States

↓

Sponsors

↓

Philippines Member
```

Result:

- Referral relationship exists.
- Qualification credit may apply according to platform rules.
- Business Cells remain inside their respective country matrices.

---

# Residency Transfer Example

Scenario:

```text
Member

↓

Lives in Canada

↓

Moves to Australia
```

Workflow:

```text
Administrator Approval

↓

Residency Verification

↓

Country Updated

↓

Future ABCs

↓

Australia Matrix
```

Historical Business Cells remain in the Canada Matrix.

---

# Existing Business Cells

Business Cells never migrate.

Example:

```text
ABC #001

Created

Canada

↓

Always

Canada
```

Future Business Cells belong to the member's new approved country.

---

# Wallet Example

United States

```text
USD Wallet
```

Canada

```text
CAD Wallet
```

Philippines

```text
PHP Wallet
```

Wallets are country-aware.

---

# Currency Reporting

Internal calculations remain consistent regardless of currency.

Reports may display:

| Country | Currency |
|----------|----------|
| US | USD |
| Canada | CAD |
| Philippines | PHP |
| Australia | AUD |
| UK | GBP |

Global reporting converts values using approved exchange-rate policies while preserving original transaction currency.

---

# Compliance Differences

Each country may enforce:

- KYC requirements
- AML rules
- privacy regulations
- tax reporting
- age restrictions
- identity verification

Business logic remains unchanged.

---

# Language Example

```text
United States

English
```

↓

```text
Canada

English / French
```

↓

```text
Philippines

Filipino / English
```

Localization does not change financial processing.

---

# Time Zone Example

Events are stored using UTC.

Displayed time uses the member's country.

Example:

Stored:

```text
2027-01-15T18:00:00Z
```

Displayed:

```text
United States

10:00 AM PST
```

```text
Philippines

2:00 AM PHT
```

---

# Example Configuration

```yaml
country: US

currency: USD

reward_threshold: 120

matrix_width: 3

matrix_depth: 12

language:
  - en

wallet_currency: USD
```

---

# Philippines Example Configuration

```yaml
country: PH

currency: PHP

reward_threshold: 60

matrix_width: 3

matrix_depth: 12

language:
  - en
  - fil

wallet_currency: PHP
```

---

# Country Validation Rules

Every country validates:

- supported currency
- reward threshold
- language
- compliance configuration
- tax settings
- privacy policies
- notification templates

Invalid configurations cannot be activated.

---

# Administrative Example

Administrator changes:

```text
Philippines

Reward Threshold

60 RP

↓

72 RP
```

Effect:

- Existing ABCs remain unchanged.
- Historical rewards remain unchanged.
- Future Business Cells use the new threshold after activation.

No historical recalculation occurs.

---

# AI Example

AI recommendation:

> Product pricing in Country X has increased by 18% during the past six months.

Recommendation:

> Consider increasing the Reward Point threshold from 120 RP to 132 RP.

Administrator approval is required before activation.

---

# Testing Scenarios

Representative tests include:

- different RP thresholds
- currency conversions
- country transfers
- cross-country referrals
- compliance validation
- localization
- reporting
- replay
- wallet synchronization

---

# Business Rules

The following rules apply globally:

- One Business Cell belongs to exactly one country.
- A member belongs to only one active country at a time.
- Historical Business Cells never migrate.
- Country configuration changes affect only future events.
- Internal calculations remain deterministic.
- Financial history is immutable.
- Every country maintains an independent genealogy.
- Cross-country referrals never merge country matrices.
- Every country may maintain independent compliance requirements.

---

# Best Practices

- Configure countries independently.
- Keep reward thresholds divisible by 12 where required by business policy.
- Never migrate historical Business Cells.
- Preserve original transaction currency.
- Store timestamps in UTC.
- Version all country configurations.
- Audit every country configuration change.
- Test each country independently before production rollout.
- Isolate country reporting and compliance.
- Expand country support through configuration rather than custom code.

---

# Related Documents

- 001-glossary.md
- 002-configuration-reference.md
- 004-architecture-patterns.md
- 005-event-catalog.md
- 006-api-conventions.md
- 007-security-guidelines.md

---

# Summary

The Country Examples document demonstrates how the AsBeez Beehive Matrix maintains a single global architecture while allowing each country to operate with its own configurable business rules, currencies, compliance requirements, and operational policies. Through strict country isolation, immutable Business Cell ownership, configurable Reward Point thresholds, localized reporting, and consistent event-driven processing, the platform achieves global scalability without sacrificing financial integrity, regulatory compliance, or deterministic behavior.