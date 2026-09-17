# Qualified Levels

## Purpose

This document defines qualified levels for distribution.

# Qualified Levels

> **Document:** 11-beehive-matrix/040-distribution-engine/006-qualified-levels.md

---

# Overview

The **Qualified Levels** component defines the rules that determine how many genealogy levels a Business Cell is eligible to receive **AsBeez Hive Credits (AHC)** from.

Although the Beehive Matrix supports a maximum of **12 earning levels** by default, a Business Cell does **not automatically qualify** to receive rewards from every level.

Instead, earning levels are progressively unlocked as the member builds and develops their network according to predefined qualification rules.

This mechanism rewards both:

- marketplace participation
- community development

while maintaining fairness across the ecosystem.

---

# Purpose

The Qualified Levels component exists to:

- determine reward eligibility
- encourage member growth
- reward leadership
- prevent passive earnings
- simplify reward calculations
- standardize country implementations
- support configurable earning policies

---

# Business Philosophy

The Beehive Matrix is designed to reward more than purchases.

It rewards:

- participation
- leadership
- mentoring
- community building
- sustainable growth

Members who actively help grow the ecosystem unlock additional earning opportunities.

---

# Guiding Principles

Qualified Levels must always be:

- deterministic
- transparent
- configurable
- immutable after distribution
- replayable
- country-aware

---

# Default Configuration

The default Beehive Matrix configuration is:

| Setting | Value |
|----------|------:|
| Matrix Width | 3 |
| Matrix Depth | 12 Levels |
| Initial Qualified Levels | 9 |
| Maximum Qualified Levels | 12 |

Countries may override these values.

---

# Qualification Model

Every Business Cell begins with access to:

```text
Levels 1–9
```

Additional levels are unlocked through qualified referrals.

---

# Referral Qualification Rules

Default qualification rules:

| Qualified Referrals | Qualified Levels |
|--------------------:|-----------------:|
| 0 | 9 |
| 3 | 10 |
| 6 | 11 |
| 9 | 12 |

These thresholds are configurable by country.

---

# What Is a Qualified Referral?

A referral is considered **qualified** when all of the following conditions are met:

- successfully registered
- completed identity verification (if required)
- created at least one Business Cell
- remains active
- satisfies country requirements

Simply registering does **not** qualify a referral.

---

# Qualification Progression

Example progression:

```text
Member Joins

↓

0 Qualified Referrals

↓

Levels 1–9
```

```text
3 Qualified Referrals

↓

Unlock Level 10
```

```text
6 Qualified Referrals

↓

Unlock Level 11
```

```text
9 Qualified Referrals

↓

Unlock Level 12
```

---

# Qualification Timeline

Level qualification affects **future distributions only**.

Example:

```text
January

↓

Qualified for 9 Levels

↓

Distribution Processed
```

```text
March

↓

Qualified for 12 Levels
```

Historical January distributions remain unchanged.

---

# Business Cell Independence

Qualification belongs to the **member**, not to an individual Business Cell.

Therefore:

```text
Member

↓

Multiple Business Cells

↓

Same Qualified Levels
```

All active Business Cells owned by the member inherit the member's current qualification level for future distributions.

---

# Historical Integrity

Every distribution stores:

- qualification level
- referral count
- configuration version
- distribution timestamp

Future qualification changes never modify historical transactions.

---

# Country Configuration

Each country may define:

- referral thresholds
- maximum earning levels
- qualification rules
- activation policies

Example:

| Country | Initial Levels | Maximum Levels |
|----------|---------------:|---------------:|
| USA | 9 | 12 |
| Canada | 9 | 12 |
| Philippines | 8 | 12 |
| Future Country | Configurable | Configurable |

---

# Qualification Validation

Before every distribution the engine verifies:

- member active
- Business Cell active
- current referral count
- unlocked earning level
- country configuration
- eligibility status

---

# Distribution Impact

Example:

Member qualifies for:

```text
10 Levels
```

Genealogy:

```text
Level 1

↓

...

↓

Level 12
```

Distribution:

| Level | Result |
|-------|--------|
| 1–10 | Receive AHC |
| 11 | Not Qualified |
| 12 | Not Qualified |

Unqualified levels follow the configured skip policy.

---

# Level Unlock Events

Representative events:

- QualifiedLevelsCalculated
- QualifiedLevelsUpdated
- ReferralQualified
- ReferralDisqualified
- LevelUnlocked
- LevelQualificationChanged

---

# Qualification Changes

Qualification may increase because of:

- new qualified referrals
- restored member status
- country policy updates (future distributions only)

Qualification may decrease because of:

- referral no longer qualified (if country policy permits)
- disciplinary actions
- membership suspension

Country policy determines whether qualification reductions are temporary or permanent.

---

# Qualification Scenarios

## New Member

```text
Qualified Referrals

0

↓

Levels 1–9
```

---

## Growing Member

```text
Qualified Referrals

3

↓

Levels 1–10
```

---

## Established Leader

```text
Qualified Referrals

9

↓

Levels 1–12
```

---

# Qualification Calculation

Representative calculation:

```text
Referral Count

↓

Lookup Country Rules

↓

Determine Maximum Qualified Level

↓

Persist Qualification

↓

Publish Events
```

---

# Replay Behavior

Replay reconstructs qualification using:

- historical referral counts
- historical configuration
- effective dates
- event ordering

Replay produces identical historical distributions.

---

# Configuration Versioning

Every qualification references:

- rule version
- country version
- effective date
- distribution version

Historical qualification remains reproducible.

---

# APIs

Representative endpoints:

```text
GET /qualified-levels

GET /qualified-levels/member/{memberId}

GET /qualified-levels/business-cell/{businessCellId}

GET /qualified-levels/configuration

POST /qualified-levels/recalculate
```

---

# Reporting

Qualification reports include:

- members by qualification level
- unlocked level statistics
- referral progression
- qualification history
- country summaries
- growth trends

---

# AI Integration

Artificial Intelligence may provide:

- qualification forecasts
- leadership potential analysis
- referral growth predictions
- qualification trend analysis
- engagement recommendations

AI never changes qualification automatically.

---

# Security

Qualification management enforces:

- role-based authorization
- immutable historical records
- country isolation
- audit logging
- configuration version control

---

# Business Benefits

## Members

- clear earning goals
- transparent qualification
- leadership incentives
- predictable rewards

---

## Administrators

- simplified validation
- deterministic calculations
- configurable country policies

---

## Executives

- leadership metrics
- qualification analytics
- engagement insights

---

## Developers

- modular qualification engine
- replay compatibility
- event-driven updates
- configurable business rules

---

# Best Practices

- Keep qualification rules simple and transparent.
- Evaluate qualification before every distribution.
- Store qualification versions with every transaction.
- Never retroactively modify completed distributions.
- Separate qualification logic from reward calculation.
- Version country-specific qualification rules.
- Publish qualification change events.
- Preserve replay compatibility.
- Audit every qualification update.
- Ensure members can clearly understand how to unlock additional earning levels.

---

# Related Documents

- 000-index.md
- 001-overview.md
- 002-ahc-distribution.md
- 003-distribution-rules.md
- 004-distribution-validation.md
- 005-company-holding-account.md
- 007-distribution-ledger.md
- 008-country-distribution.md
- 009-reporting.md
- 010-events.md
- 011-ai-capabilities.md
- 012-performance.md
- 013-future-roadmap.md

---

# Summary

The Qualified Levels component governs how many genealogy levels a member's Business Cells are eligible to receive Hive Credit distributions from within the AsBeez Beehive Matrix. By progressively unlocking additional earning levels through qualified referrals, the system encourages leadership, mentorship, and sustainable community growth while maintaining deterministic reward calculations and financial fairness. Through configurable country-specific policies, immutable historical records, replayable event sourcing, and transparent qualification rules, the Qualified Levels framework provides a scalable and trustworthy foundation for long-term reward distribution across the entire AsBeez ecosystem.