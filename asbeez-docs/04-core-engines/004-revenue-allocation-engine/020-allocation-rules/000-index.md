# Allocation Rules

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Revenue Allocation Engine |
| Section | Allocation Rules |
| Document | Allocation Rules Index |
| Document ID | AEDS-RAE-AR-000 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Revenue Architecture Team |

---

# Overview

The Allocation Rules component defines how Qualified Platform Revenue (QPR) is distributed among one or more Platform Funds.

Allocation Rules provide the configurable business policies that determine how recognized platform revenue is divided after revenue recognition and before downstream financial and rewards processing.

Rather than hard-coding allocation percentages, the AsBeez Platform uses configurable Allocation Policies composed of one or more Allocation Rules.

This design supports multiple countries, industries, campaigns, and future business models without requiring software changes.

---

# Purpose

The Allocation Rules component exists to:

- Define how Qualified Platform Revenue is distributed.
- Support configurable Allocation Policies.
- Allocate revenue to Platform Funds.
- Maintain complete transparency and auditability.
- Support multiple allocation strategies.
- Enable country-specific and program-specific allocation models.
- Preserve immutable allocation history.

---

# Guiding Principle

> **Revenue is allocated according to configurable business policies—not hard-coded application logic.**

---

# Scope

This component is responsible for:

- Allocation Policies
- Allocation Rules
- Allocation Percentages
- Allocation Priorities
- Effective Dates
- Policy Activation
- Policy Versioning
- Allocation Validation

---

# Out of Scope

This component does **not** determine:

- Qualified Transaction Value (QTV)
- Platform Participation Fees (PPF)
- Qualified Platform Revenue (QPR)
- Reward Points (RP)
- AsBeez Business Cells (ABC)
- AsBeez Hive Credits (AHC)
- Financial Settlement

These responsibilities belong to their respective platform engines.

---

# Allocation Flow

```text
Qualified Platform Revenue

↓

Allocation Policy

↓

Allocation Rules

↓

Platform Funds

↓

Revenue Allocation Ledger

↓

Rewards Engine

↓

Financial Engine
```

---

# Allocation Policy

An Allocation Policy is a reusable collection of Allocation Rules.

It defines **how** a specific type of Platform Revenue should be distributed.

Examples include:

- Default Allocation Policy
- Country Allocation Policy
- Promotional Allocation Policy
- Marketplace Allocation Policy
- Subscription Allocation Policy
- Lead Generation Allocation Policy

Each Revenue Type references one Allocation Policy at the time revenue is recognized.

---

# Allocation Rule

An Allocation Rule represents a single distribution instruction within an Allocation Policy.

Each rule specifies:

- Destination Fund
- Allocation Percentage
- Allocation Priority
- Effective Date
- Status

Multiple Allocation Rules together define a complete Allocation Policy.

---

# Example Allocation Policy

```text
Default Allocation Policy

Qualified Platform Revenue

↓

Company Revenue ............ 40%

↓

Compensation Fund .......... 60%
```

---

Another example:

```text
Growth Campaign Policy

Qualified Platform Revenue

↓

Company Revenue ............ 30%

↓

Compensation Fund .......... 55%

↓

Marketing Fund ............. 10%

↓

Innovation Fund ............ 5%
```

---

# Supported Destination Funds

Allocation Rules may distribute revenue to:

- Company Revenue
- Compensation Fund
- Marketing Fund
- Innovation Fund
- Country Development Fund
- Strategic Reserve
- Community Fund
- Sustainability Fund
- Other Approved Platform Funds

New destination funds should be introduced through configuration.

---

# Rule Characteristics

Every Allocation Rule should define:

- Rule ID
- Policy ID
- Destination Fund
- Allocation Percentage
- Priority
- Effective Date
- Expiration Date
- Status
- Version

---

# Policy Versioning

Allocation Policies are versioned.

When percentages change:

- Existing allocations remain unchanged.
- Historical allocations continue referencing the policy version used at the time.
- New Qualified Platform Revenue uses the new policy version.

Policies are immutable after activation.

---

# Business Rules

## AR-001

Every Qualified Platform Revenue record must reference exactly one Allocation Policy.

---

## AR-002

Every Allocation Policy must contain at least one Allocation Rule.

---

## AR-003

The combined Allocation Percentages within a policy must equal **100%**.

---

## AR-004

Allocation Policies are versioned and immutable after activation.

---

## AR-005

Historical Allocation Policies must remain available for auditing.

---

## AR-006

Allocation Rules may reference only approved Platform Funds.

---

## AR-007

Only one Allocation Policy may be active for a specific Revenue Type and effective period unless explicitly configured otherwise.

---

## AR-008

Changes to Allocation Policies affect only future revenue recognition.

Previously allocated revenue must never be recalculated automatically.

---

# Relationship with Revenue Types

Every recognized Platform Revenue source may reference a different Allocation Policy.

Examples:

| Revenue Type | Example Allocation Policy |
|---------------|---------------------------|
| Platform Participation Fee Revenue | Default Policy |
| Subscription Revenue | Subscription Policy |
| Lead Generation Revenue | Lead Policy |
| Marketplace Fees | Marketplace Policy |
| Platform Licensing Revenue | Licensing Policy |
| Custom Revenue Types | Custom Policy |

---

# Relationship with Other Engines

| Platform Engine | Responsibility |
|-----------------|----------------|
| Platform Participation Engine | Produces Qualified Platform Revenue. |
| Revenue Allocation Engine | Applies Allocation Policies and Rules. |
| Rewards Engine | Consumes Compensation Fund allocations. |
| Financial Engine | Records accounting entries and settlements. |
| Analytics Engine | Reports allocation trends and fund utilization. |

---

# Long-Term Vision

Allocation Rules should evolve into a fully configurable policy framework capable of supporting any future revenue model without requiring structural changes to the Revenue Allocation Engine.

Organizations should be able to introduce new Allocation Policies, destination funds, and allocation strategies through governance and configuration while preserving complete historical traceability.

---

# Allocation Rule Principle

> **Every dollar of Qualified Platform Revenue must be allocated according to a clearly defined, versioned, and auditable Allocation Policy. Allocation Rules determine where revenue flows, ensuring transparency, flexibility, and long-term sustainability across the AsBeez Participation Economy.**

---

# Documents in this Section

| Document | Purpose |
|----------|---------|
| 000-index.md | Overview of Allocation Rules and Policies |
| 001-allocation-policies.md | Defines Allocation Policies and lifecycle |
| 002-allocation-rules.md | Individual Allocation Rule definitions |
| 003-fund-destinations.md | Platform Funds and destination types |
| 004-policy-versioning.md | Policy versioning and historical traceability |
| 005-policy-validation.md | Validation rules and governance |
| 006-examples.md | Sample allocation scenarios |
| 007-api.md | Allocation Rules API |
| 008-events.md | Allocation Rules domain events |

---

# Related Documents

- ../010-platform-revenue/000-index.md
- ../001-overview.md
- ../002-domain-model.md
- ../../004-platform-participation-engine/000-index.md
- ../../005-financial-engine/000-index.md
- ../../006-rewards-engine/000-index.md

---

# Revision History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Allocation Rules architecture and policy framework. |