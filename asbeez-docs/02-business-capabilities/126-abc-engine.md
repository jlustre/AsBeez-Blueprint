# ABC Engine

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-126 |
| Capability ID | BC-RWD-126 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Rewards |
| Owner | Rewards Domain |

---

# Overview

The ABC Engine manages the creation and lifecycle of AsBeez Business Cells (ABCs).

An ABC is a business position earned by a Member after accumulating the required number of Reward Points (RP).

Each ABC represents an independent earning position within the AsBeez Beehive Matrix.

A Member may own an unlimited number of ABCs.

---

# Responsibilities

The ABC Engine is responsible for:

- Creating ABCs
- Assigning ABC numbers
- Associating ABCs with Members
- Maintaining ABC status
- Tracking ABC history
- Publishing ABC events

The ABC Engine is **not responsible** for:

- Reward Point calculations
- Beehive Matrix placement
- Hive Credit distribution
- Wallet credits
- Financial accounting

---

# ABC Creation

An ABC is created when a Member accumulates the configured Reward Point threshold.

Default Threshold

```text
120 RP = 1 ABC
```

The threshold is configurable.

---

# Multiple ABC Creation

A single purchase may generate multiple ABCs.

Example

```text
Current RP

250

Threshold

120

ABC Created

2

Remaining RP

10
```

The remaining RP stays in the Member's account.

---

# ABC Ownership

Each ABC:

- Belongs to one Member
- Has one unique ABC Number
- Is independent from other ABCs
- Participates independently in the Beehive Matrix

Members may own an unlimited number of ABCs.

---

# ABC Information

Each ABC records:

- ABC Number
- Member ID
- Creation Date
- Source RP Transaction
- Current Status
- Country Hive
- Matrix Position *(assigned separately)*

---

# ABC Status

| Status | Description |
|----------|-------------|
| Pending | Created but awaiting placement |
| Active | Participating in the Beehive Matrix |
| Completed | Maximum earning capacity reached |
| Suspended | Temporarily inactive |
| Deactivated | Permanently inactive |
| Transferred | Ownership transferred to beneficiary |

---

# ABC Workflow

```text
Reward Threshold Reached
          │
          ▼
Create ABC
          │
          ▼
Assign ABC Number
          │
          ▼
Associate with Member
          │
          ▼
Publish ABCCreated Event
```

---

# Beneficiary Transfer

When permitted by platform policy, ownership of an ABC may be transferred to a pre-assigned beneficiary.

Transfers require administrative approval and supporting documentation.

The ABC history remains unchanged.

Only ownership changes.

---

# Configuration

Administrators may configure:

- RP Threshold
- ABC Number Format
- Initial ABC Status
- Beneficiary Transfer Rules
- Country Hive Assignment

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-ABC-001 | One ABC is created for every configured RP threshold reached. |
| BR-ABC-002 | Members may own unlimited ABCs. |
| BR-ABC-003 | Every ABC has a unique ABC Number. |
| BR-ABC-004 | Remaining RP are retained after ABC creation. |
| BR-ABC-005 | Multiple ABCs may be created from a single RP transaction. |
| BR-ABC-006 | Each ABC belongs to exactly one Member. |
| BR-ABC-007 | ABC ownership may only change through an approved beneficiary transfer. |
| BR-ABC-008 | Creating an ABC does not automatically distribute Hive Credits. |

---

# Published Events

The ABC Engine publishes:

- ABCCreated
- ABCActivated
- ABCCompleted
- ABCTransferred
- ABCDeactivated

---

# Consumed Events

The ABC Engine consumes:

- RewardThresholdReached

---

# Related Capabilities

- BC-RWD-125 Reward Points
- BC-RWD-127 AHC Engine
- BC-BHM-301 Beehive Matrix
- BC-MEM-122 Member Profile

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |