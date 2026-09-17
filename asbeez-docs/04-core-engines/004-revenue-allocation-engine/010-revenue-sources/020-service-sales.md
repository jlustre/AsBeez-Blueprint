# Service Revenue

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Revenue Allocation Engine |
| Section | Revenue Sources |
| Document | Service Revenue |
| Document ID | AEDS-RAE-010-003 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Revenue Allocation Team |

---

# Introduction

Service Revenue represents revenue generated from the successful delivery of services offered through the AsBeez platform.

Unlike product sales, services may be delivered immediately, over time, or through recurring engagements.

The Service Revenue model defines how service transactions become qualified revenue sources for the Revenue Allocation Engine.

After Service Revenue is qualified, the Vendor Revenue Share is calculated according to the applicable Vendor Agreement and Revenue Allocation Policy.

---

# Purpose

The Service Revenue model exists to:

- Define revenue generated from service transactions.
- Standardize service revenue calculations.
- Support multiple service business models.
- Identify revenue eligible for Vendor Revenue Share.
- Support financial reporting.
- Maintain complete auditability.

---

# Guiding Principle

> **Every completed service should generate a transparent and traceable revenue record before revenue allocation begins.**

---

# Revenue Philosophy

A completed service creates commercial value.

Only the portion of revenue that satisfies the platform's qualification rules becomes eligible for Vendor Revenue Share calculations.

This ensures that Reward Points, Business Cells, and Hive Credits are always funded by actual completed business activity.

---

# Revenue Lifecycle

```text
Customer Books Service

↓

Service Delivered

↓

Service Accepted

↓

Qualified Service Revenue

↓

Vendor Revenue Share

↓

Revenue Allocation Engine
```

---

# Supported Service Types

Examples include:

- Professional Services
- Installation Services
- Consulting
- Coaching
- Training
- Repairs
- Maintenance
- Subscription Services
- Project-Based Services
- Hourly Services
- Digital Services

New service categories may be added through configuration.

---

# Revenue Components

A service transaction may include multiple financial components.

| Component | Included in Service Revenue |
|-----------|----------------------------|
| Service Fee | ✅ Yes |
| Service Discount | Adjusts Service Revenue |
| Travel Charges | Configurable |
| Materials | Configurable |
| Sales Tax | ❌ No |
| VAT / GST / HST | ❌ No |
| Government Fees | ❌ No |
| Processing Fees | ❌ No (default) |

Country-specific rules may override these defaults.

---

# Service Revenue Formula

```text
Service Revenue

=

Service Fee

−

Service Discounts
```

---

# Net Service Revenue

Net Service Revenue represents the amount eligible for Vendor Revenue Share calculations.

```text
Net Service Revenue

=

Service Revenue

−

Excluded Charges
```

Excluded charges may include:

- Taxes
- Government Fees
- Processing Fees
- Other configurable exclusions

---

# Example

Customer purchases a service.

```text
Service Fee

$100
```

Additional Charges

```text
Sales Tax

$8

Processing Fee

$2
```

Customer Pays

```text
$110
```

Net Service Revenue

```text
$100
```

Vendor Agreement

```text
10%
```

Vendor Revenue Share

```text
$10
```

Revenue Allocation

```text
Company Revenue

40%

↓

$4
```

```text
Compensation Fund

60%

↓

$6
```

Funding Event

```text
$6

↓

60 RP

↓

60 AHC
```

---

# Revenue Recognition

Service Revenue becomes qualified only after the configured qualification event occurs.

Examples include:

- Service Completed
- Customer Acceptance
- Milestone Approved
- Subscription Renewal
- Project Completion
- Administrative Approval

Qualification rules are configuration-driven.

---

# Recurring Services

Recurring services may generate revenue for:

- Weekly subscriptions
- Monthly subscriptions
- Annual subscriptions
- Maintenance contracts
- Membership services

Each billing cycle is treated as an independent revenue event.

---

# Service Configuration

Each service may define:

- Revenue Share Eligibility
- Vendor Agreement
- Allocation Policy
- Country Availability
- Currency
- Service Category
- Qualification Method
- Effective Dates

---

# Business Rules

## SR-001

Only qualified service transactions may generate Service Revenue.

---

## SR-002

Only eligible services participate in Vendor Revenue Share calculations.

---

## SR-003

Net Service Revenue excludes configured non-revenue charges.

---

## SR-004

Every Service Revenue record must reference its originating service transaction.

---

## SR-005

Service Revenue records are immutable.

Corrections create reversing entries.

---

## SR-006

Each Service Revenue record must identify:

- Service
- Vendor
- Customer
- Country
- Currency
- Net Service Revenue
- Vendor Agreement

---

## SR-007

Recurring billing cycles generate separate Service Revenue records.

---

## SR-008

Service Revenue becomes eligible for Vendor Revenue Share only after the configured qualification event.

---

# Domain Events

Examples include:

- ServiceRevenueQualified
- ServiceRevenueCalculated
- ServiceRevenueAdjusted
- ServiceRevenueReversed

---

# Relationship with Other Engines

| Platform Engine | Relationship |
|-----------------|--------------|
| Commerce Engine | Owns service catalog, bookings, billing, and transactions. |
| Vendor Engine | Owns Vendor agreements and service ownership. |
| Revenue Allocation Engine | Consumes Service Revenue to calculate Vendor Revenue Share. |
| Rewards Engine | Receives Compensation Fund funding events. |
| Financial Engine | Records accounting entries and settlements. |

---

# Long-Term Vision

The Service Revenue model should support increasingly sophisticated service businesses, including recurring subscriptions, milestone-based projects, professional consulting, maintenance contracts, digital services, and AI-delivered services.

Its architecture should ensure that every qualified service transaction can be traced from customer engagement through revenue allocation, reward generation, and financial settlement.

---

# Closing Statement

Service Revenue provides the commercial foundation for service-based contributions within the AsBeez ecosystem.

By identifying and qualifying revenue generated from completed services, the platform ensures that Vendor Revenue Share calculations, Revenue Allocation, and the creation of Reward Points, Business Cells, and Hive Credits remain transparent, fully funded, and economically sustainable.

---

# Service Revenue Principle

> **Every qualified service creates measurable commercial value. Service Revenue ensures that this value is accurately identified, transparently calculated, and consistently transformed into sustainable economic value for the AsBeez ecosystem.**

---

# Related Documents

- 000-index.md
- 001-vendor-revenue-share.md
- 002-product-revenue.md
- ../020-allocation-rules/000-index.md
- ../../003-commerce-engine/020-services/000-index.md

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Service Revenue specification. |