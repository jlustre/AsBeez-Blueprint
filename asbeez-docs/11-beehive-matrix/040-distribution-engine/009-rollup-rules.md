# Rollup Rules

> **Document:** 11-beehive-matrix/040-distribution-engine/009-rollup-rules.md

---

# Overview

The **Rollup Rules** define how the AsBeez Distribution Engine handles reward allocations when an eligible genealogy level cannot receive its scheduled **AsBeez Hive Credits (AHC)** and the configured country policy specifies that rewards should **roll up** to the next qualified ancestor instead of being redirected to the Company Holding Account.

The Rollup mechanism is an optional distribution strategy that allows reward opportunities to continue flowing upward through the genealogy until an eligible recipient is found or until the maximum reward depth is reached.

Rollup behavior is **country configurable** and is disabled by default.

---

# Purpose

The Rollup Rules exist to:

- maximize member reward opportunities
- support configurable compensation strategies
- reduce undistributed rewards
- preserve deterministic processing
- maintain financial integrity
- simplify configurable country policies
- support replayable reward calculations

---

# Business Philosophy

The Beehive Matrix recognizes that different countries and regulatory environments may require different reward allocation strategies.

Some jurisdictions may prefer:

- undistributed rewards returned to the Company Holding Account

while others may prefer:

- continuing the reward upward until an eligible recipient is found.

The platform supports both approaches without compromising determinism or financial integrity.

---

# Guiding Principles

Rollup processing must always be:

- deterministic
- configurable
- transparent
- immutable
- replayable
- auditable
- country-aware

---

# Default Platform Behavior

Default configuration:

```text
Rollup

Disabled
```

Default action:

```text
Unqualified Recipient

↓

Company Holding Account
```

Rollup must be explicitly enabled within a country's Distribution Policy.

---

# What Is Rollup?

Rollup is the process of redirecting a skipped reward allocation to the next higher qualified ancestor.

Example:

```text
Level 4

↓

Recipient Not Qualified

↓

Level 5

↓

Qualified Recipient

↓

Receive Level 4 Reward
```

---

# Rollup Workflow

```text
Distribution

↓

Recipient Validation

↓

Qualified?

↓

YES

↓

Allocate Reward

↓

NO

↓

Rollup Enabled?

↓

YES

↓

Search Next Qualified Ancestor

↓

Allocate

↓

NO

↓

Company Holding Account
```

---

# Rollup Search

The Distribution Engine searches upward through the genealogy until one of the following occurs:

- qualified ancestor found
- maximum genealogy depth reached
- configured rollup limit reached

The search is deterministic.

---

# Example 1 — Single Rollup

Genealogy:

```text
Level 1

Qualified
```

```text
Level 2

Not Qualified
```

```text
Level 3

Qualified
```

Distribution:

| Original Level | Final Recipient |
|---------------:|----------------|
| 1 | Level 1 |
| 2 | Level 3 (Rollup) |
| 3 | Level 3 |

---

# Example 2 — Multiple Rollups

```text
Level 5

Not Qualified
```

```text
Level 6

Not Qualified
```

```text
Level 7

Qualified
```

Result:

| Original Reward | Recipient |
|----------------:|-----------|
| Level 5 | Level 7 |
| Level 6 | Level 7 |
| Level 7 | Level 7 |

One qualified ancestor may receive multiple rolled-up allocations.

---

# Example 3 — No Qualified Ancestors

```text
Levels 8–12

Not Qualified
```

Search reaches maximum depth.

Result:

```text
Company Holding Account
```

Financial conservation remains intact.

---

# Rollup Eligibility

A Business Cell may receive a rolled-up allocation only if it satisfies:

- active Business Cell
- active member
- unlocked earning level
- valid genealogy
- country match
- distribution eligibility

---

# Rollup Limit

Countries may optionally define a maximum rollup distance.

Example:

| Configuration | Value |
|--------------|------:|
| Unlimited | Search entire genealogy |
| Maximum Rollup | 3 levels |
| Maximum Rollup | 5 levels |

If the limit is reached:

```text
Company Holding Account
```

---

# Country Configuration

Each country may independently configure:

- rollup enabled
- rollup disabled
- maximum rollup distance
- rollup priority
- rollup exceptions

Example:

| Country | Rollup |
|----------|--------|
| USA | Disabled |
| Canada | Enabled |
| Australia | Configurable |

---

# Rollup Priority

When multiple policies exist, priority is:

```text
Validation

↓

Recipient Qualification

↓

Rollup Policy

↓

Company Holding Policy

↓

Ledger

↓

Events
```

Validation always occurs before rollup.

---

# Financial Conservation

Every rolled-up allocation satisfies:

```text
Generated AHC

=

Member Allocations

+

Company Holding

+

Reserved Credits
```

The financial equation always balances.

---

# Rollup Ledger

Every rolled-up reward generates an immutable ledger record.

Representative fields:

| Field | Description |
|--------|-------------|
| Source Business Cell | Originating ABC |
| Original Level | Scheduled level |
| Final Recipient | Receiving Business Cell |
| Rollup Distance | Levels skipped |
| Country | Country matrix |
| Amount | Allocated AHC |
| Timestamp | Distribution time |

---

# Historical Integrity

Ledger records preserve:

- original genealogy level
- rolled-up recipient
- rollup reason
- policy version
- configuration version

Historical transactions never change.

---

# Replay Behavior

Replay reconstructs:

- genealogy
- qualification
- rollup search
- final recipient
- ledger entries

Replay must always reproduce identical distributions.

---

# Rollup Scenarios

## Locked Level

```text
Level Locked

↓

Search Upward

↓

Qualified Ancestor

↓

Reward Allocated
```

---

## Suspended Member

```text
Member Suspended

↓

Rollup

↓

Next Qualified Ancestor
```

---

## Country Mismatch

```text
Country Validation Failed

↓

Rollup Not Allowed

↓

Company Holding
```

Cross-country rollups are prohibited.

---

# Domain Events

Representative events:

- RollupStarted
- RollupSearchCompleted
- RollupRecipientFound
- RollupAllocationCreated
- RollupLimitReached
- RollupCompleted

---

# APIs

Representative endpoints:

```text
GET /distribution/rollups

GET /distribution/rollups/{distributionId}

GET /distribution/rollups/history

GET /distribution/rollups/configuration

POST /distribution/rollups/replay
```

---

# Reporting

Rollup reports include:

- rolled-up rewards
- rollup frequency
- rollup distances
- qualified recipients
- country summaries
- historical trends

---

# Monitoring

Operational monitoring includes:

- average rollup distance
- rollup success rate
- Company Holding reductions
- genealogy quality
- qualification bottlenecks
- replay consistency

---

# AI Integration

Artificial Intelligence may analyze:

- excessive rollup patterns
- genealogy health
- leadership development
- qualification bottlenecks
- policy optimization
- reward distribution efficiency

AI recommendations never modify completed distributions.

---

# Security

Rollup processing enforces:

- role-based authorization
- immutable ledgers
- audit logging
- country isolation
- configuration versioning
- replay authorization

---

# Business Benefits

## Members

- increased earning opportunities
- improved reward utilization
- transparent distribution

---

## Administrators

- configurable compensation strategies
- simplified auditing
- deterministic processing

---

## Executives

- improved reward efficiency
- reduced undistributed balances
- configurable market strategies

---

## Developers

- reusable rollup engine
- configurable policy framework
- replay compatibility
- event-driven implementation

---

# Best Practices

- Keep rollup disabled unless required by country policy.
- Validate recipients before initiating rollup searches.
- Record both the original genealogy level and the final recipient.
- Preserve immutable ledger records for every rolled-up allocation.
- Never allow rollups across country boundaries.
- Version every rollup policy independently.
- Publish domain events for every rollup decision.
- Maintain deterministic replay using historical configuration versions.
- Monitor rollup frequency to identify qualification bottlenecks.
- Ensure financial conservation regardless of rollup outcomes.

---

# Related Documents

- 000-index.md
- 001-overview.md
- 002-ahc-distribution.md
- 003-distribution-rules.md
- 004-distribution-validation.md
- 005-company-holding-account.md
- 006-qualified-levels.md
- 007-referral-unlock-rules.md
- 008-skip-rules.md
- 010-distribution-ledger.md
- 011-events.md
- 012-ai-capabilities.md
- 013-performance.md
- 014-future-roadmap.md

---

# Summary

The Rollup Rules provide an optional, country-configurable mechanism for redirecting Hive Credit allocations from ineligible genealogy levels to the next qualified ancestor within the AsBeez Beehive Matrix. By preserving deterministic processing, immutable financial records, replayable event sourcing, and strict financial conservation, the Rollup mechanism enables flexible compensation strategies while ensuring that every generated Hive Credit remains fully traceable and correctly allocated according to the active country policy. Whether enabled or disabled, the Rollup Rules integrate seamlessly with the Distribution Engine to support a scalable, transparent, and globally configurable reward ecosystem.