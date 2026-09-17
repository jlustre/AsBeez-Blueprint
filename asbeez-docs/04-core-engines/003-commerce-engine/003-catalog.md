# Commerce Catalog

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Commerce Engine |
| Section | Catalog |
| Document | Commerce Catalog |
| Document ID | AEDS-CE-003 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Commerce Team |

---

# Introduction

The Commerce Catalog defines the products, services, subscriptions, bookings, and other commercial offerings made available by Platform Partners through the AsBeez Platform.

The Catalog provides a universal and industry-neutral way to describe what a Platform Partner offers without creating separate catalog systems for every business type.

A retail store may list products.

A contractor may list services.

A hotel may list bookable accommodations.

A software company may list subscriptions.

An insurance agency may list eligible service offerings or consultation categories.

All of these are represented through a common Catalog model.

---

# Purpose

The Commerce Catalog exists to:

- Manage commercial offerings.
- Support Platform Product Providers.
- Support Platform Service Providers.
- Organize offerings into categories.
- Define prices and availability.
- Associate offerings with Platform Partners.
- Support country and location-specific offerings.
- Provide catalog data to shopping, ordering, booking, and subscription workflows.
- Publish catalog events for other platform capabilities.

---

# Guiding Principle

> **The Catalog describes what a Platform Partner offers. Commercial Transactions record what a Member actually purchases.**

---

# Catalog Philosophy

The Commerce Catalog is intentionally broader than a traditional product catalog.

It supports any offering that may participate in a Commercial Transaction.

Examples include:

- Physical products
- Digital products
- Professional services
- Contractor services
- Appointments
- Reservations
- Subscription plans
- Service packages
- Event registrations
- Rentals
- Future commercial offerings

The Catalog does not determine:

- Platform Participation Fees
- Qualified Transaction Value
- Qualified Platform Revenue
- Reward Points
- Revenue Allocation
- Financial settlement

Those responsibilities belong to downstream engines.

---

# Core Catalog Model

```text
Platform Partner
        │
        ▼
Catalog
        │
        ├── Product Offering
        ├── Service Offering
        ├── Subscription Offering
        ├── Booking Offering
        ├── Package Offering
        └── Custom Offering
                │
                ▼
        Commercial Transaction
```

---

# Aggregate Root

The primary aggregate root is:

```text
Catalog
```

A Catalog belongs to a Platform Partner and contains one or more Catalog Offerings.

A Platform Partner may maintain multiple Catalogs when needed.

Examples include:

- Retail Catalog
- Service Catalog
- Regional Catalog
- Wholesale Catalog
- Seasonal Catalog
- Digital Catalog

---

# Core Domain Entities

## Catalog

Represents an organized collection of commercial offerings belonging to a Platform Partner.

Typical attributes include:

- Catalog ID
- Platform Partner ID
- Name
- Description
- Country
- Currency
- Status
- Visibility
- Effective Dates
- Default Location
- Created Date
- Updated Date

---

## Catalog Offering

The universal representation of anything a Platform Partner makes commercially available.

A Catalog Offering may represent:

- Product
- Service
- Subscription
- Booking
- Rental
- Package
- Digital Item
- Custom Offering

All specialized offering types inherit the common Catalog Offering lifecycle.

---

## Product Offering

Represents a physical or digital item offered for purchase.

Examples include:

- Consumer goods
- Electronics
- Food products
- Clothing
- Equipment
- Downloadable media
- Software licenses

---

## Service Offering

Represents work, expertise, access, or assistance provided by a Platform Service Provider.

Examples include:

- Consulting
- Installation
- Repair
- Legal services
- Dental services
- Contractor services
- Insurance consultations
- Training services

---

## Subscription Offering

Represents recurring access to a product, service, platform, or membership plan.

Examples include:

- Monthly service plan
- Annual software subscription
- Maintenance agreement
- Membership package
- Recurring delivery program

---

## Booking Offering

Represents an offering that requires a date, time, duration, location, or capacity reservation.

Examples include:

- Hotel stay
- Medical appointment
- Contractor visit
- Restaurant reservation
- Consultation
- Event registration
- Equipment rental

---

## Package Offering

Represents a collection of products, services, or both offered together.

Examples include:

- Product bundle
- Service package
- Vacation package
- Installation package
- Training bundle
- Membership starter package

---

## Catalog Category

Organizes Catalog Offerings into logical groups.

Examples include:

- Home Services
- Financial Services
- Health and Wellness
- Travel
- Automotive
- Retail
- Education
- Professional Services

Categories may be global, country-specific, or partner-specific.

---

## Offering Variant

Represents a purchasable variation of a Catalog Offering.

Examples include:

- Size
- Color
- Service level
- Package tier
- Subscription duration
- Room type
- Appointment duration

Each variant may have its own price, availability, and identifying code.

---

## Price

Represents the amount charged for a Catalog Offering or Offering Variant.

Price attributes may include:

- Amount
- Currency
- Price Type
- Effective Date
- Expiration Date
- Country
- Location
- Customer Segment
- Promotional Override

---

## Availability

Defines whether and when a Catalog Offering may be purchased, booked, or subscribed to.

Availability may depend on:

- Inventory
- Location
- Schedule
- Service area
- Capacity
- Country
- Effective period
- Platform Partner status

---

# Platform Partner Relationship

Every Catalog belongs to a Platform Partner.

A Platform Partner may operate as one or more provider types.

```text
Platform Partner
        │
        ├── Platform Product Provider
        ├── Platform Service Provider
        └── Both
```

Provider type determines which offering types the Platform Partner may publish.

A Platform Partner may be both a Platform Product Provider and a Platform Service Provider.

---

# Catalog Offering Lifecycle

```text
Draft

↓

Submitted for Review

↓

Approved

↓

Published

↓

Active

↓

Suspended or Unpublished

↓

Retired or Archived
```

Not every offering requires manual review.

Approval requirements are configuration-driven.

---

# Catalog Statuses

A Catalog may use the following statuses:

- Draft
- Active
- Inactive
- Suspended
- Archived

A Catalog Offering may use:

- Draft
- Pending Review
- Approved
- Published
- Unpublished
- Suspended
- Retired
- Rejected

---

# Offering Types

The initial supported offering types are:

| Type | Description |
|------|-------------|
| Product | Physical or digital item purchased by a Member. |
| Service | Work, expertise, or assistance provided by a Platform Partner. |
| Subscription | Recurring access or recurring delivery arrangement. |
| Booking | Time-based, capacity-based, or reservation-based offering. |
| Package | A bundled group of products or services. |
| Rental | Temporary use of property, equipment, or other assets. |
| Custom | A configurable offering type for future business models. |

---

# Pricing Models

Catalog Offerings may support:

- Fixed Price
- Starting Price
- Price Range
- Hourly Rate
- Daily Rate
- Per-Person Price
- Per-Unit Price
- Subscription Price
- Quote Required
- Negotiated Price
- Tiered Price
- Usage-Based Price
- Market-Based Price
- Custom Price

Pricing models are configuration-driven.

---

# Quote-Based Offerings

Some offerings cannot use a fixed price at the time of listing.

Examples include:

- Real estate services
- Construction projects
- Insurance services
- Legal services
- Custom manufacturing
- Vehicle purchases
- Large contractor projects

These offerings may be configured as:

```text
Catalog Offering

↓

Inquiry or Lead

↓

Assessment

↓

Quote

↓

Accepted Quote

↓

Order or Agreement

↓

Commercial Transaction
```

The Catalog stores the offering and starting conditions.

The final agreed amount is recorded in the resulting Commercial Transaction.

---

# Qualified Transaction Value Relationship

The Catalog may provide data used later to determine Qualified Transaction Value (QTV), but the Commerce Engine does not perform the final QTV calculation.

Catalog configuration may identify:

- Eligible base price
- Excluded charges
- Eligible offering categories
- Promotional treatment
- Applicable Platform Participation Agreement reference

The Platform Participation Engine and Revenue Allocation Engine determine the final QTV and Platform Participation Fee.

---

# Catalog Configuration

Each Catalog Offering may define:

- Offering Type
- Title
- Description
- Platform Partner
- Category
- Price
- Currency
- Variants
- Availability
- Inventory behavior
- Service area
- Booking rules
- Subscription rules
- Tax classification
- Shipping requirements
- Media
- Country availability
- Location availability
- Status
- Effective dates

---

# Inventory

Product Offerings may maintain inventory information.

Examples include:

- Available Quantity
- Reserved Quantity
- Reorder Threshold
- Backorder Permission
- Location Inventory
- Unlimited Digital Inventory

Inventory may be managed directly by the Commerce Engine or integrated with an external inventory system.

---

# Service Capacity

Service and Booking Offerings may maintain capacity instead of inventory.

Examples include:

- Available appointment slots
- Maximum attendees
- Daily service capacity
- Geographic service areas
- Provider availability
- Resource availability

---

# Catalog Visibility

Catalogs and Offerings may be visible to:

- Everyone
- Registered Customers
- Members
- Selected Membership Levels
- Selected Countries
- Selected Regions
- Invitation-Only Participants
- Specific Organizations

Visibility rules are configuration-driven.

---

# Media and Content

Catalog Offerings may include:

- Images
- Videos
- Documents
- Specifications
- Instructions
- Terms and Conditions
- Frequently Asked Questions
- Provider information
- Location information

Media files should be managed through the appropriate platform media or file service.

---

# Search and Discovery

The Catalog should support:

- Keyword search
- Category filtering
- Location filtering
- Price filtering
- Provider filtering
- Product or service filtering
- Availability filtering
- Rating filtering
- AI-assisted discovery
- Personalized recommendations

Search indexes are derived from authoritative Catalog records.

---

# Business Rules

## CAT-001

Every Catalog must belong to one Platform Partner.

---

## CAT-002

Every Catalog Offering must belong to one Catalog.

---

## CAT-003

Only approved and active Platform Partners may publish Catalog Offerings.

---

## CAT-004

A Platform Product Provider may publish Product Offerings.

---

## CAT-005

A Platform Service Provider may publish Service and Booking Offerings.

---

## CAT-006

A Platform Partner may hold multiple provider types and publish multiple offering types.

---

## CAT-007

Every purchasable Catalog Offering must define an active pricing model or require a quote.

---

## CAT-008

Every published Catalog Offering must identify its country, currency, and availability rules.

---

## CAT-009

Catalog changes must not modify completed Commercial Transactions.

Completed transactions preserve a snapshot of the offering as purchased.

---

## CAT-010

Retired offerings remain available for historical reporting but cannot generate new Orders.

---

## CAT-011

Catalog pricing does not determine the final Qualified Transaction Value.

QTV is determined downstream according to the applicable Platform Participation Agreement.

---

## CAT-012

Catalog Offerings must not directly generate RP, ABC, AHC, PPF, or Qualified Platform Revenue.

---

# Catalog Snapshot

When an offering is added to an Order or Commercial Transaction, the platform should create an immutable snapshot containing:

- Offering ID
- Offering Type
- Name
- Description
- Variant
- Unit Price
- Quantity
- Currency
- Platform Partner
- Tax classification
- Discount information
- Effective agreement references where applicable

This prevents later Catalog changes from altering historical transactions.

---

# Domain Events

Examples include:

- CatalogCreated
- CatalogActivated
- CatalogArchived
- CatalogOfferingCreated
- CatalogOfferingSubmitted
- CatalogOfferingApproved
- CatalogOfferingPublished
- CatalogOfferingUpdated
- CatalogOfferingSuspended
- CatalogOfferingRetired
- CatalogPriceChanged
- CatalogAvailabilityChanged
- InventoryUpdated

Events describe completed business facts.

---

# Relationship with Other Engines

| Platform Engine | Relationship |
|-----------------|--------------|
| Identity Engine | Identifies authorized Partner Users and administrators. |
| Membership Engine | Provides Member eligibility and segmentation information. |
| Platform Participation Engine | Confirms Platform Partner status and applicable PPA terms. |
| Commerce Engine | Uses Catalog Offerings in carts, orders, bookings, subscriptions, and Commercial Transactions. |
| Revenue Allocation Engine | Receives completed transaction data after commerce and participation processing. |
| Analytics Engine | Measures catalog performance, pricing, demand, and conversion. |
| AI Engine | Supports discovery, classification, pricing recommendations, and content assistance. |

---

# AI Capabilities

Artificial Intelligence may assist with:

- Product and service classification
- Category recommendations
- Description generation
- Search optimization
- Duplicate detection
- Image quality analysis
- Pricing recommendations
- Demand forecasting
- Inventory forecasting
- Personalized discovery
- Translation and localization
- Policy violation detection

AI recommendations remain subject to Platform Partner or administrative approval.

---

# Security and Governance

Catalog management requires:

- Role-based access
- Platform Partner ownership validation
- Approval controls
- Change history
- Content moderation
- Audit logging
- Country-specific compliance
- Prohibited offering enforcement

Sensitive, restricted, or regulated offerings may require additional review.

---

# Long-Term Vision

The Commerce Catalog should become a universal offering framework capable of representing virtually anything a Platform Partner may commercially provide.

New industries should extend the Catalog through configuration, specialized attributes, and offering schemas rather than creating separate catalog systems.

The same Catalog foundation should support:

- Retail
- Professional services
- Hospitality
- Automotive
- Insurance
- Real estate
- Healthcare
- Education
- Contractors
- SaaS
- Digital marketplaces
- Future industries

---

# Closing Statement

The Commerce Catalog is the universal directory of commercial opportunity within AsBeez.

It allows Platform Partners to define what they provide while giving Members a consistent way to discover, compare, purchase, book, or subscribe to offerings across many industries.

By separating Catalog management from Platform Participation Fees, Revenue Allocation, Rewards, and Financial Settlement, the Commerce Engine maintains a clean and reusable commerce foundation.

---

# Catalog Principle

> **The Catalog defines what may be offered. Orders express intent to purchase. Commercial Transactions record what actually occurred. Downstream engines determine how that completed commerce participates in the wider AsBeez economy.**

---

# Related Documents

- 000-index.md
- 001-overview.md
- 002-domain-model.md
- 004-shopping-cart.md
- 005-orders.md
- 006-commercial-transactions.md
- ../004-platform-participation-engine/000-index.md
- ../005-revenue-allocation-engine/000-index.md

---

# Revision History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial universal Commerce Catalog specification. |