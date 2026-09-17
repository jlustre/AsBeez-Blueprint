# Revenue Allocation Engine

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Revenue Allocation Engine |
| Engine Code | RAE |
| Domain | Core Engines |
| Document | Index |
| Document ID | AEDS-RAE-000 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Financial Platform Team |

---

# Overview

The Revenue Allocation Engine manages how revenue received by AsBeez is allocated between company revenue, compensation funding, reserves, and other approved financial destinations.

It sits between the Commerce Engine and the Rewards Engine.

The Commerce Engine records the sale.

The Revenue Allocation Engine determines how AsBeez revenue is divided.

The Rewards Engine uses the funded compensation amount to generate Reward Points, Business Cells, and Hive Credits.

The Financial Engine later settles eligible Hive Credits into real-world money.

---

# Purpose

The Revenue Allocation Engine exists to:

- Receive revenue allocation events from commerce activity.
- Calculate AsBeez revenue share.
- Apply allocation rules.
- Fund the Compensation Fund.
- Record company revenue allocation.
- Maintain revenue allocation ledgers.
- Provide auditability for every RP and AHC generated.
- Support country, product, vendor, and service-specific allocation policies.

---

# Guiding Principle

> **Every Reward Point and every Hive Credit should be traceable to funded business revenue.**

---

# Economic Flow

```text
Product or Service Sale

↓

Vendor Revenue Share to AsBeez

↓

Revenue Allocation Engine

↓

Company Revenue Allocation

+

Compensation Fund Allocation

↓

Rewards Engine

↓

RP → ABC → AHC

↓

Financial Engine

↓

Settlement
```

---

# Core Responsibilities

The Revenue Allocation Engine is responsible for:

- Vendor revenue share calculation
- Product revenue allocation
- Service revenue allocation
- Company revenue allocation
- Compensation Fund allocation
- Allocation rules
- Allocation ledgers
- Allocation history
- Revenue traceability
- Funding events for the Rewards Engine

---

# What This Engine Does Not Own

| Responsibility | Owning Engine |
|---|---|
| Product catalog | Commerce Engine |
| Service catalog | Commerce Engine |
| Customer checkout | Commerce Engine |
| RP creation | Rewards Engine |
| ABC creation | Rewards Engine |
| AHC distribution | Rewards Engine |
| Wallets and payouts | Financial Engine |
| Taxes and payment settlement | Financial Engine |

---

# Example Allocation

```text
Product Net Price: $100

Vendor Agreement: 10%

AsBeez Revenue Share: $10

Company Revenue: 40% = $4

Compensation Fund: 60% = $6

RP Funding Conversion: $6 × 10 = 60 RP

AHC Economic Equivalence: 60 RP = 60 AHC

Future Financial Conversion: 60 AHC ÷ 10 = $6
```

The money is conserved.

The internal reward units simply determine how compensation value is distributed through the hive.

---

# Documentation Structure

| Folder / File | Purpose |
|---|---|
| 001-overview.md | Explains the purpose, philosophy, and scope of the Revenue Allocation Engine. |
| 002-domain-model.md | Defines the entities, relationships, value objects, and boundaries of the revenue allocation domain. |
| 010-revenue-sources/ | Defines qualified revenue and revenue sources such as product sales, service sales, commissions, subscriptions, marketplace fees, bookings, licenses, referrals, and custom revenue types. |
| 020-allocation-rules/ | Defines how revenue is divided between company revenue, compensation funding, reserves, and country-specific rules. |
| 030-ledgers/ | Defines immutable revenue, compensation fund, and allocation history ledgers. |
| 040-architecture/ | Defines APIs, events, and AI capabilities. |
| 050-strategy/ | Defines the long-term roadmap for revenue allocation. |

---

# Relationship to Other Engines

```text
Commerce Engine
        │
        ▼
Revenue Allocation Engine
        │
        ├── Company Revenue
        │
        └── Compensation Fund
                    │
                    ▼
              Rewards Engine
                    │
                    ▼
              Financial Engine
```

---

# Closing Statement

The Revenue Allocation Engine protects the financial integrity of the AsBeez economic model.

It ensures that Reward Points and Hive Credits are not arbitrary numbers but funded units of value originating from real business activity.

By separating revenue allocation from rewards and settlement, AsBeez gains a transparent, auditable, and sustainable foundation for its contribution economy.

---

# Revenue Allocation Principle

> **Revenue must be allocated before rewards are generated, so every RP, ABC, and AHC can be traced back to real economic activity and governed by transparent allocation rules.**

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Revenue Allocation Engine index. |
