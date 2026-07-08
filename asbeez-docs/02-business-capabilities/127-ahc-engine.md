# AHC Engine

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-127 |
| Capability ID | BC-RWD-127 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Rewards |
| Owner | Rewards Domain |

---

# Overview

The AHC Engine manages the earning and recording of **AsBeez Hive Credits (AHC)**.

AHC are loyalty credits earned by qualified ABCs whenever new ABCs are created within the Beehive Matrix.

The AHC Engine records earnings, maintains Member balances, and publishes events for downstream capabilities.

---

# Responsibilities

The AHC Engine is responsible for:

- Awarding AHC
- Recording AHC transactions
- Maintaining AHC balances
- Maintaining AHC history
- Publishing AHC events

The AHC Engine is **not responsible** for:

- Matrix placement
- Matrix qualification
- ABC creation
- Wallet conversion
- Financial accounting

---

# Earning AHC

AHC are earned when:

- A new ABC is created.
- The ABC is placed within the Beehive Matrix.
- An eligible ancestor ABC qualifies to receive the AHC.

The qualification rules are defined by the **Beehive Matrix** capability.

---

# AHC Value

Default conversion:

```text
10 AHC = $1.00
```

The conversion rate is configurable.

---

# AHC Information

Each AHC transaction records:

- Transaction ID
- ABC Number
- Member ID
- Source ABC
- Matrix Level
- AHC Earned
- Transaction Date
- Status

---

# AHC Balance

Each Member maintains:

- Available AHC
- Pending AHC
- Lifetime AHC Earned

The AHC balance represents loyalty credits earned before conversion to the Member Wallet.

---

# AHC Workflow

```text
New ABC Created
        │
        ▼
Beehive Matrix Determines Qualified ABCs
        │
        ▼
Award AHC
        │
        ▼
Record AHC Transaction
        │
        ▼
Update Member Balance
```

---

# Configuration

Administrators may configure:

- AHC Conversion Rate
- Credits Awarded Per ABC
- Maximum Distribution Levels
- Country Hive
- Qualification Rules

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-AHC-001 | AHC are earned only through the Beehive Matrix. |
| BR-AHC-002 | AHC are awarded only to qualified ABCs. |
| BR-AHC-003 | Every AHC transaction must reference the originating ABC. |
| BR-AHC-004 | AHC balances are maintained separately from Wallet balances. |
| BR-AHC-005 | AHC conversion rates are configurable. |
| BR-AHC-006 | AHC adjustments are performed by the AHC Adjustment capability. |

---

# Published Events

The AHC Engine publishes:

- AHCEarned
- AHCAdjusted
- AHCConverted

---

# Consumed Events

The AHC Engine consumes:

- ABCCreated
- MatrixDistributionCompleted

---

# Related Capabilities

- BC-RWD-126 ABC Engine
- BC-RWD-128 Wallet
- BC-BHM-301 Beehive Matrix
- BC-BHM-305 Hive Credit Adjustment Engine

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |