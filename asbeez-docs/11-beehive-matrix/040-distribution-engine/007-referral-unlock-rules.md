# Referral Unlock Rules

## Purpose

This document defines referral unlock rules.

# Referral Unlock Rules

> **Document:** 11-beehive-matrix/040-distribution-engine/007-referral-unlock-rules.md

---

# Overview

The **Referral Unlock Rules** define how members progressively unlock additional earning levels within the **AsBeez Beehive Matrix** by personally introducing and developing new members who become active Business Cell owners.

The Beehive Matrix is intentionally designed so that members can immediately earn from the first **nine (9) genealogy levels** without requiring any referrals.

Additional earning levels are unlocked only after achieving specific referral milestones.

This approach balances:

- accessibility for new members
- incentives for leadership
- sustainable network growth
- long-term reward fairness

---

# Purpose

The Referral Unlock Rules exist to:

- reward active network builders
- encourage quality referrals
- prevent passive earning
- support long-term growth
- balance the compensation model
- increase member engagement
- create measurable leadership milestones

---

# Business Philosophy

The AsBeez ecosystem values both:

- marketplace participation
- community expansion

Members are rewarded for helping grow the platform through quality referrals while ensuring that every participant can immediately benefit from the first nine genealogy levels.

Leadership creates additional opportunity.

---

# Guiding Principles

Referral Unlock Rules are:

- deterministic
- transparent
- configurable
- country-aware
- replayable
- event-driven
- historically immutable

---

# Default Unlock Configuration

The default earning structure is:

| Qualified Personal Referrals | Unlocked Levels |
|-----------------------------:|----------------:|
| 0 | 9 |
| 3 | 10 |
| 6 | 11 |
| 9 | 12 |

This configuration may be customized independently for each country.

---

# Why Nine Levels By Default?

Every new member who creates their first Business Cell immediately participates in the reward system.

Benefits include:

- immediate earnings
- faster engagement
- reduced barriers
- stronger retention
- easier onboarding

Members do not need referrals before earning.

---

# Why Unlock Additional Levels?

Additional levels reward leadership rather than simple participation.

Benefits include:

- encourages mentoring
- rewards business development
- supports ecosystem expansion
- increases active participation
- improves member retention

---

# Definition of a Qualified Referral

A referral is considered **qualified** only when all required business conditions are satisfied.

Default requirements include:

- successfully registered
- identity verified (if applicable)
- active membership
- owns at least one Business Cell
- remains eligible under country policies

A simple registration does **not** qualify.

---

# Personal Referral Requirement

Only **personally sponsored** qualified referrals count toward unlocking additional earning levels.

Example:

```text
Member A

↓

Personally Sponsors

↓

Member B
```

Member B contributes toward Member A's referral qualification.

Indirect referrals do not count.

---

# Indirect Referrals

Example:

```text
Member A

↓

Member B

↓

Member C
```

Member C contributes to genealogy growth but does **not** increase Member A's referral unlock count.

Only direct referrals qualify.

---

# Unlock Progression

## Stage 1

```text
Qualified Referrals

0

↓

Levels 1–9
```

---

## Stage 2

```text
Qualified Referrals

3

↓

Levels 1–10
```

---

## Stage 3

```text
Qualified Referrals

6

↓

Levels 1–11
```

---

## Stage 4

```text
Qualified Referrals

9

↓

Levels 1–12
```

---

# Example Progression

### January

Member joins.

```text
Qualified Referrals

0

↓

Levels 1–9
```

---

### March

Three qualified referrals.

```text
Levels

1–10
```

---

### June

Six qualified referrals.

```text
Levels

1–11
```

---

### September

Nine qualified referrals.

```text
Levels

1–12
```

---

# Unlock Timing

Unlocks affect **future** distributions only.

Example:

```text
Distribution

January

↓

Qualified

9 Levels
```

```text
Referral Milestone

April

↓

Unlock Level 10
```

January distributions remain unchanged.

---

# Historical Integrity

Every completed distribution permanently records:

- referral count
- unlocked level
- configuration version
- country
- effective date

Future changes never modify historical earnings.

---

# Business Cell Independence

Referral qualification belongs to the **member**, not to individual Business Cells.

Example:

```text
Member

↓

ABC-1

ABC-2

ABC-3
```

All active Business Cells owned by the member share the same earning level qualification for future distributions.

---

# Country Configuration

Each country may define:

- unlock thresholds
- maximum levels
- referral requirements
- qualification policies

Example:

| Country | Default Levels | Maximum Levels |
|----------|---------------:|---------------:|
| USA | 9 | 12 |
| Canada | 9 | 12 |
| Philippines | Configurable | Configurable |

---

# Qualification Validation

Before every distribution the system validates:

- current referral count
- referral qualification
- country policy
- Business Cell status
- member eligibility
- unlocked earning level

---

# Referral Loss

If a qualified referral later becomes inactive, country policy determines the outcome.

Supported policies may include:

- permanent unlock
- dynamic qualification
- grace period
- administrative review

Each country selects its preferred policy.

---

# Administrative Overrides

Authorized administrators may perform controlled overrides for exceptional situations.

Overrides require:

- approval
- audit trail
- reason code
- effective date

Overrides never alter historical distributions.

---

# Replay Behavior

During replay the engine reconstructs qualification using:

- historical referral events
- effective configuration
- country policy
- event ordering

Replay always reproduces the original unlock state.

---

# Configuration Versioning

Every qualification references:

- rule version
- country version
- effective date
- distribution version

Versioning guarantees deterministic replay.

---

# Domain Events

Representative events:

- ReferralQualified
- ReferralDisqualified
- ReferralUnlockCalculated
- ReferralUnlockGranted
- ReferralUnlockRevoked
- QualifiedLevelsUpdated

---

# APIs

Representative endpoints:

```text
GET /referrals/unlock

GET /referrals/unlock/member/{memberId}

GET /referrals/unlock/history

GET /referrals/unlock/configuration

POST /referrals/unlock/recalculate
```

---

# Reporting

Reports include:

- qualified referral counts
- unlock progression
- leadership growth
- members by earning level
- country comparisons
- historical qualification trends

---

# AI Integration

Artificial Intelligence provides:

- referral growth forecasting
- leadership potential scoring
- qualification trend analysis
- engagement recommendations
- retention predictions

AI recommendations remain advisory.

---

# Security

The Referral Unlock system enforces:

- role-based authorization
- immutable audit records
- country isolation
- configuration versioning
- replay authorization

---

# Business Benefits

## Members

- clear advancement path
- transparent earning opportunities
- leadership incentives
- predictable qualification

---

## Administrators

- configurable reward policies
- simplified qualification validation
- deterministic auditing

---

## Executives

- leadership analytics
- growth metrics
- engagement measurement

---

## Developers

- modular qualification engine
- event-driven updates
- replay compatibility
- configurable country policies

---

# Best Practices

- Count only personally sponsored qualified referrals.
- Validate qualification before every distribution.
- Preserve historical qualification records.
- Never modify completed distributions after unlock changes.
- Version every referral policy.
- Keep country configurations independent.
- Publish qualification events for every milestone.
- Audit all administrative overrides.
- Ensure members can monitor their unlock progress in real time.
- Maintain deterministic replay using historical referral events and configuration versions.

---

# Related Documents

- 000-index.md
- 001-overview.md
- 002-ahc-distribution.md
- 003-distribution-rules.md
- 004-distribution-validation.md
- 005-company-holding-account.md
- 006-qualified-levels.md
- 008-distribution-ledger.md
- 009-reporting.md
- 010-events.md
- 011-ai-capabilities.md
- 012-performance.md
- 013-future-roadmap.md

---

# Summary

The Referral Unlock Rules define the leadership progression model of the AsBeez Beehive Matrix by allowing members to unlock additional earning levels through personally sponsored qualified referrals. Every member immediately earns from the first nine genealogy levels, while Levels 10 through 12 are unlocked at predefined referral milestones. Through deterministic qualification, country-specific configurability, immutable historical records, replayable event sourcing, and transparent business rules, the Referral Unlock system encourages sustainable community growth while preserving fairness, financial integrity, and long-term scalability across the entire AsBeez ecosystem.