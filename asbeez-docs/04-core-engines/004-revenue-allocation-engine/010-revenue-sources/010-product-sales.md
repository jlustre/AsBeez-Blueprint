# Product Revenue

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Revenue Allocation Engine |
| Section | Revenue Sources |
| Document | Product Revenue |
| Document ID | AEDS-RAE-010-002 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Revenue Allocation Team |

---

# Introduction

Product Revenue represents revenue generated from the successful sale of physical or digital products offered through the AsBeez marketplace.

It defines the commercial value of a completed product transaction before revenue is shared between the Vendor and AsBeez.

Product Revenue serves as the primary input used to calculate the Vendor Revenue Share, which ultimately funds the AsBeez contribution economy.

---

# Purpose

The Product Revenue model exists to:

- Define revenue generated from product sales.
- Standardize product revenue calculations.
- Support configurable Vendor agreements.
- Identify eligible revenue for allocation.
- Support reporting and analytics.
- Maintain complete financial traceability.

---

# Guiding Principle

> **Every product sale should produce a transparent and traceable revenue record before revenue allocation begins.**

---

# Revenue Philosophy

A completed product sale creates commercial revenue.

However, not every dollar collected from the Customer belongs to the Vendor or participates in revenue sharing.

The Product Revenue model identifies the portion of the transaction that represents the product's commercial value.

Only this value is considered when calculating the Vendor Revenue Share.

---

# Revenue Lifecycle

```text
Customer Purchase

↓

Order Completed

↓

Product Revenue Identified

↓

Net Product Revenue Calculated

↓

Vendor Revenue Share

↓

Revenue Allocation Engine
```

---

# Revenue Components

A product transaction may contain multiple financial components.

| Component | Included in Product Revenue |
|-----------|----------------------------|
| Product Price | ✅ Yes |
| Product Discount | Adjusts Product Revenue |
| Shipping Charges | ❌ No (default) |
| Handling Charges | ❌ No (default) |
| Sales Tax | ❌ No |
| VAT / GST / HST | ❌ No |
| Gift Wrapping | Configurable |
| Installation Fee | Configurable |
| Service Add-ons | Separate Revenue Source |

Country-specific policies may override default behavior.

---

# Product Revenue Formula

```text
Product Revenue

=

Product Selling Price

−

Product Discounts
```

---

# Net Product Revenue

Net Product Revenue represents the amount eligible for Vendor Revenue Share calculations.

```text
Net Product Revenue

=

Product Revenue

−

Excluded Charges
```

Excluded charges are configuration-driven.

Examples include:

- Taxes
- Shipping
- Delivery
- Handling
- Government Fees

---

# Example

Customer Order

```text
Product Price

$100
```

Additional Charges

```text
Shipping

$12

Sales Tax

$8
```

Total Customer Payment

```text
$120
```

Net Product Revenue

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

# Eligible Products

Products eligible for revenue sharing may include:

- Physical Products
- Digital Products
- Subscription Products
- Marketplace Products
- Downloadable Products

Eligibility is configurable.

---

# Product Configuration

Every product may define:

- Revenue Share Eligibility
- Vendor Agreement
- Country Availability
- Currency
- Product Category
- Allocation Policy
- Promotional Overrides
- Effective Dates

---

# Business Rules

## PR-001

Only completed product sales may generate Product Revenue.

---

## PR-002

Only eligible products participate in Vendor Revenue Share calculations.

---

## PR-003

Net Product Revenue excludes configured non-revenue charges.

---

## PR-004

Every Product Revenue record must reference its originating order.

---

## PR-005

Product Revenue records are immutable.

Corrections create reversing entries.

---

## PR-006

Each Product Revenue record must identify:

- Product
- Vendor
- Customer
- Country
- Currency
- Net Product Revenue
- Applicable Vendor Agreement

---

## PR-007

Product Revenue becomes eligible for Vendor Revenue Share only after successful order completion.

---

# Domain Events

Examples include:

- ProductRevenueCalculated
- ProductRevenueAdjusted
- ProductRevenueReversed
- ProductRevenueQualified

---

# Relationship with Other Engines

| Platform Engine | Relationship |
|-----------------|--------------|
| Commerce Engine | Owns products, orders, pricing, and checkout. |
| Vendor Engine | Owns Vendor agreements and product ownership. |
| Revenue Allocation Engine | Consumes Product Revenue to calculate Vendor Revenue Share. |
| Rewards Engine | Receives funding after revenue allocation. |
| Financial Engine | Records accounting entries and settlements. |

---

# Long-Term Vision

The Product Revenue model should support increasingly sophisticated commerce scenarios, including bundled products, subscription products, promotional pricing, regional pricing, digital goods, and marketplace products.

Its architecture should ensure that every eligible product sale can be accurately traced from customer purchase through revenue allocation, reward generation, and eventual financial settlement.

---

# Closing Statement

Product Revenue is the commercial foundation of the AsBeez contribution economy.

By accurately identifying the revenue generated from eligible product sales, the platform establishes a transparent starting point for Vendor Revenue Share calculations, Revenue Allocation, and the creation of Reward Points, Business Cells, and Hive Credits.

---

# Product Revenue Principle

> **Every eligible product sale creates measurable commercial value. Product Revenue ensures that this value is accurately identified, transparently calculated, and faithfully carried through the entire AsBeez economic lifecycle.**

---

# Related Documents

- 000-index.md
- 001-vendor-revenue-share.md
- 003-service-revenue.md
- ../020-allocation-rules/000-index.md
- ../../003-commerce-engine/010-products/000-index.md

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Product Revenue specification. |