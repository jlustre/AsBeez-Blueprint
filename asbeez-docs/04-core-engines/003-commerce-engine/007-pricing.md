# Pricing

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Commerce Engine |
| Section | Pricing |
| Document | Pricing |
| Document ID | AEDS-CE-007 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Commerce Team |

---

# Introduction

The Pricing component defines how Products, Services, Packages, Bookings, and other commercial offerings are priced within the AsBeez Platform.

Pricing determines the commercial value agreed between a Member and a Platform Partner.

It does not determine Platform Participation Fees (PPF), Qualified Transaction Values (QTV), Qualified Platform Revenue (QPR), or Rewards.

Those responsibilities belong to downstream platform engines.

---

# Purpose

The Pricing component exists to:

- Define commercial pricing models.
- Support multiple industries.
- Support multiple currencies.
- Support promotional pricing.
- Support negotiated pricing.
- Support quote-based pricing.
- Preserve pricing history.
- Generate immutable pricing snapshots for Orders and Commercial Transactions.

---

# Guiding Principle

> **Pricing determines what the Member pays the Platform Partner. It does not determine how the platform allocates economic value.**

---

# Pricing Philosophy

Pricing belongs to the Platform Partner.

The Platform Partner determines:

- Selling price
- Promotions
- Discounts
- Bundles
- Subscription rates
- Quotes
- Seasonal pricing

The Commerce Engine records the agreed commercial price.

Later platform engines determine:

- Qualified Transaction Value
- Platform Participation Fee
- Qualified Platform Revenue
- Revenue Allocation
- Rewards

---

# Pricing Model

```text
Catalog Offering

↓

Pricing Model

↓

Order

↓

Commercial Transaction

↓

Platform Participation Engine

↓

Revenue Allocation Engine
```

---

# Supported Pricing Models

The platform supports multiple pricing strategies.

## Fixed Price

A predefined selling price.

Examples:

- Retail products
- Digital downloads
- Memberships

---

## Starting Price

Displays the minimum expected price.

Final pricing may vary.

---

## Price Range

Displays minimum and maximum pricing.

Examples:

- Hotel rooms
- Vehicle rentals
- Consulting services

---

## Hourly Pricing

Price based on hours worked.

Examples:

- Contractors
- Consultants
- Tutors
- Lawyers

---

## Daily Pricing

Examples:

- Hotel rooms
- Equipment rental
- Vehicle rental

---

## Per Unit Pricing

Examples:

- Quantity purchased
- Weight
- Volume
- Distance

---

## Subscription Pricing

Recurring charges.

Examples:

- Monthly
- Quarterly
- Annual

---

## Package Pricing

One price for multiple offerings.

---

## Tiered Pricing

Different prices depending on:

- Quantity
- Membership
- Customer Segment
- Volume

---

## Quote Required

No published price.

The Provider prepares a quotation.

Examples:

- Construction
- Insurance
- Real Estate
- Legal Services

---

## Negotiated Pricing

Price is agreed through negotiation before an Order is created.

---

## Custom Pricing

Platform-specific pricing models.

---

# Pricing Attributes

Every pricing record may include:

- Price ID
- Offering ID
- Price Type
- Currency
- Amount
- Effective Date
- Expiration Date
- Country
- Region
- Customer Segment
- Tax Inclusion
- Status

---

# Currency Support

The Commerce Engine should support:

- Multi-currency pricing
- Country-specific pricing
- Exchange rate services
- Currency rounding
- Local formatting

The Commerce Engine records prices in the transaction currency.

Financial conversion rules belong to the Financial Engine.

---

# Promotions

Pricing may include:

- Percentage discounts
- Fixed discounts
- Coupon discounts
- Bundle discounts
- Seasonal promotions
- Flash sales
- Membership pricing
- Campaign pricing
- Volume discounts

Promotions modify commercial pricing only.

They do not determine rewards.

---

# Taxes

Pricing may be:

- Tax Inclusive
- Tax Exclusive

Supported tax models include:

- VAT
- GST
- Sales Tax
- Provincial Tax
- Local Tax

Tax calculation rules are configurable.

---

# Shipping

Shipping charges may include:

- Standard shipping
- Express shipping
- Pickup
- Local delivery
- Freight

Shipping charges are commercial charges.

Whether shipping participates in QTV is determined later by the Platform Participation Agreement.

---

# Service Charges

Examples include:

- Booking fee
- Convenience fee
- Installation fee
- Processing fee
- Administrative fee

The Commerce Engine records these charges.

Participation eligibility is determined downstream.

---

# Pricing Snapshot

Every Order preserves an immutable pricing snapshot.

The snapshot includes:

- Unit Price
- Quantity
- Currency
- Discounts
- Promotions
- Taxes
- Shipping
- Service Charges
- Final Commercial Price

Historical pricing never changes.

---

# Quote Pricing

Quote workflow:

```text
Catalog Offering

↓

Member Inquiry

↓

Provider Assessment

↓

Quote

↓

Member Acceptance

↓

Order

↓

Commercial Transaction
```

Accepted Quotes become immutable pricing records.

---

# Relationship to Qualified Transaction Value

The Commerce Engine records the commercial price.

The Platform Participation Engine later determines:

- Which charges qualify.
- Which charges are excluded.
- Qualified Transaction Value.

The Commerce Engine does not calculate QTV.

---

# Business Rules

## PR-001

Every purchasable Offering must define one active Pricing Model.

---

## PR-002

Pricing history is immutable.

---

## PR-003

Completed Orders preserve pricing snapshots.

---

## PR-004

Pricing changes never affect historical Orders.

---

## PR-005

The Commerce Engine determines commercial pricing only.

---

## PR-006

Platform Participation Fees are calculated outside the Commerce Engine.

---

## PR-007

Qualified Transaction Values are calculated outside the Commerce Engine.

---

## PR-008

Pricing supports multiple currencies.

---

## PR-009

Quote-based pricing requires Provider approval before Order creation.

---

## PR-010

Every pricing change must be auditable.

---

# Domain Events

Examples include:

- PriceCreated
- PriceUpdated
- PromotionCreated
- PromotionExpired
- QuoteCreated
- QuoteAccepted
- PricingSnapshotCreated

---

# Relationship with Other Engines

| Platform Engine | Relationship |
|-----------------|--------------|
| Catalog | Provides Offerings requiring pricing. |
| Orders | Preserves immutable pricing snapshots. |
| Platform Participation Engine | Determines Qualified Transaction Value from completed transactions. |
| Revenue Allocation Engine | Calculates Platform Participation Fee using qualified transaction data. |
| Financial Engine | Performs monetary accounting and settlement. |

---

# AI Capabilities

Artificial Intelligence may assist with:

- Dynamic pricing recommendations
- Competitive pricing analysis
- Demand forecasting
- Promotion optimization
- Discount recommendations
- Price anomaly detection
- Revenue optimization
- Quote assistance

AI recommendations remain advisory unless explicitly approved.

---

# Long-Term Vision

The Pricing component should support every commercial pricing strategy required by current and future Platform Partners.

Rather than introducing industry-specific pricing systems, the platform should provide a flexible pricing framework that accommodates retail, services, hospitality, professional services, subscriptions, marketplace commerce, and future business models through configuration.

---

# Closing Statement

Pricing represents the commercial agreement between a Member and a Platform Partner.

It establishes the value exchanged during commerce while remaining independent of Platform Participation Fees, Qualified Platform Revenue, Rewards, and Financial Settlement.

This separation preserves the modular architecture of the AsBeez Platform and ensures that pricing remains universally applicable across every supported industry.

---

# Pricing Principle

> **Pricing determines commercial value. Platform Participation determines platform value. Revenue Allocation determines economic distribution. Each responsibility belongs to a separate engine, ensuring a clean, scalable, and reusable commerce architecture.**

---

# Related Documents

- 003-catalog.md
- 004-products-services.md
- 005-cart-checkout.md
- 006-orders.md
- 008-commercial-transactions.md
- ../004-platform-participation-engine/000-index.md
- ../005-revenue-allocation-engine/000-index.md
- ../007-financial-engine/000-index.md

---

# Revision History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Pricing specification for the Commerce Engine. |