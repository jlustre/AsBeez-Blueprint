# Products and Services

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Commerce Engine |
| Section | Products and Services |
| Document | Products and Services |
| Document ID | AEDS-CE-004 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Commerce Team |

---

# Introduction

The Products and Services component defines the specialized commercial offerings that Platform Partners may publish through the AsBeez Commerce Catalog.

A **Product** represents a physical or digital item that may be purchased, delivered, downloaded, licensed, or otherwise transferred to a Member.

A **Service** represents work, expertise, access, assistance, accommodation, or another non-product benefit delivered by a Platform Service Provider.

Products and Services share a common Catalog Offering foundation while retaining specialized rules for pricing, availability, fulfillment, delivery, scheduling, and transaction completion.

---

# Purpose

The Products and Services component exists to:

- Define Product Offerings.
- Define Service Offerings.
- Standardize offering information.
- Support Platform Product Providers.
- Support Platform Service Providers.
- Manage pricing and availability.
- Support product fulfillment.
- Support service delivery.
- Supply offering data to Orders, Bookings, Subscriptions, and Commercial Transactions.
- Preserve immutable transaction snapshots.

---

# Guiding Principle

> **Products transfer items. Services deliver outcomes. Both participate in commerce through a common Catalog Offering model.**

---

# Domain Philosophy

Products and Services are different types of commercial offerings, but they should not require separate commerce platforms.

Both may share:

- Catalogs
- Categories
- Pricing
- Promotions
- Availability
- Media
- Country configuration
- Platform Partner ownership
- Transaction snapshots
- Search and discovery

Their differences should be handled through specialized attributes, rules, and workflows rather than duplicated systems.

---

# Offering Model

```text
Catalog Offering
        │
        ├── Product Offering
        │      ├── Physical Product
        │      ├── Digital Product
        │      ├── Configurable Product
        │      ├── Subscription Product
        │      └── Product Package
        │
        └── Service Offering
               ├── Fixed Service
               ├── Scheduled Service
               ├── Quote-Based Service
               ├── Recurring Service
               ├── Project Service
               └── Service Package
```

---

# Platform Partner Roles

A Platform Partner may operate as:

- Platform Product Provider
- Platform Service Provider
- Both

Provider roles determine which offerings the Partner may create and publish.

```text
Platform Partner
        │
        ├── Platform Product Provider
        │         └── Product Offerings
        │
        └── Platform Service Provider
                  └── Service Offerings
```

A single Partner may offer both Products and Services under the same Platform Participation Agreement or under separate agreements when required.

---

# Product Offering

A Product Offering represents a physical or digital item made available by a Platform Product Provider.

Examples include:

- Food and beverages
- Clothing
- Electronics
- Appliances
- Vehicles
- Construction materials
- Downloadable files
- Software
- Digital media
- Membership kits
- Equipment
- Product bundles

---

# Product Types

## Physical Product

A tangible item that requires fulfillment, pickup, shipping, or delivery.

Examples:

- Retail merchandise
- Appliances
- Groceries
- Equipment
- Vehicles

---

## Digital Product

An item delivered electronically.

Examples:

- E-books
- Software downloads
- Digital templates
- Online resources
- Media files

---

## Configurable Product

A Product with selectable options or specifications.

Examples:

- Size
- Color
- Material
- Configuration
- Model
- Capacity

Each configuration may have its own price, inventory, SKU, and availability.

---

## Subscription Product

A Product delivered repeatedly according to a recurring schedule.

Examples:

- Monthly product boxes
- Consumable replenishment plans
- Recurring digital access
- Equipment replacement programs

---

## Product Package

A bundled group of Products or a combination of Products and Services.

Examples:

- Starter kit
- Product and installation package
- Vacation merchandise package
- Equipment and maintenance bundle

---

# Product Attributes

A Product Offering may include:

- Product ID
- Catalog ID
- Platform Partner ID
- Name
- Description
- Product Type
- Category
- Brand
- Manufacturer
- SKU
- Barcode
- Model Number
- Unit of Measure
- Price
- Currency
- Tax Classification
- Variants
- Inventory Rules
- Shipping Rules
- Warranty
- Return Policy
- Media
- Country Availability
- Location Availability
- Status
- Effective Dates

---

# Product Inventory

Physical Products may require inventory management.

Inventory information may include:

- Quantity Available
- Quantity Reserved
- Quantity Sold
- Reorder Threshold
- Backorder Policy
- Inventory Location
- Restock Date
- Unlimited Inventory Indicator

Digital Products may use unlimited inventory but may still require license, access, or download controls.

---

# Product Fulfillment

Product fulfillment may use:

- In-store pickup
- Partner delivery
- Third-party delivery
- Standard shipping
- Expedited shipping
- Digital download
- Electronic license delivery
- Scheduled installation

The Commerce Engine records fulfillment status.

External logistics providers may perform the physical delivery.

---

# Product Lifecycle

```text
Draft

↓

Submitted

↓

Approved

↓

Published

↓

Available

↓

Purchased

↓

Fulfilled

↓

Completed
```

Possible exception states include:

- Out of Stock
- Suspended
- Recalled
- Retired
- Rejected

---

# Service Offering

A Service Offering represents work, expertise, access, assistance, accommodation, or another outcome delivered by a Platform Service Provider.

Examples include:

- Consulting
- Construction
- Repairs
- Installation
- Insurance consultation
- Real estate services
- Legal services
- Healthcare services
- Hotel accommodations
- Transportation
- Education
- Coaching
- Maintenance
- Professional services

---

# Service Types

## Fixed Service

A predefined service with a fixed scope and price.

Examples:

- Oil change
- Basic consultation
- Standard cleaning
- Installation package

---

## Scheduled Service

A service requiring a date, time, duration, location, or assigned resource.

Examples:

- Medical appointment
- Contractor visit
- Consultation
- Training session
- Hotel stay

---

## Quote-Based Service

A service whose final price depends on assessment, scope, negotiation, or customization.

Examples:

- Construction project
- Legal engagement
- Real estate service
- Custom fabrication
- Vehicle repair
- Insurance solution

---

## Recurring Service

A service delivered repeatedly according to a subscription or maintenance schedule.

Examples:

- Monthly consulting
- Annual maintenance
- Managed IT service
- Lawn care
- Membership service

---

## Project Service

A service delivered through milestones, phases, or a defined project lifecycle.

Examples:

- Website development
- Construction
- Renovation
- Professional implementation
- Custom manufacturing

---

## Service Package

A bundled group of Services or a combination of Services and Products.

Examples:

- Consultation and implementation
- Equipment and installation
- Travel package
- Training program
- Maintenance bundle

---

# Service Attributes

A Service Offering may include:

- Service ID
- Catalog ID
- Platform Partner ID
- Name
- Description
- Service Type
- Category
- Price Model
- Currency
- Estimated Duration
- Service Location
- Service Area
- Capacity
- Scheduling Rules
- Required Resources
- Qualification Requirements
- Cancellation Policy
- Completion Rules
- Media
- Country Availability
- Status
- Effective Dates

---

# Service Pricing

Services may use:

- Fixed Price
- Starting Price
- Price Range
- Hourly Rate
- Daily Rate
- Per-Person Rate
- Per-Visit Rate
- Per-Project Price
- Milestone Pricing
- Subscription Pricing
- Usage-Based Pricing
- Quote Required
- Negotiated Price

The final price recorded in the Commercial Transaction may differ from the Catalog's displayed or estimated price.

---

# Service Availability

Service availability may depend on:

- Appointment schedule
- Provider schedule
- Geographic service area
- Capacity
- Required equipment
- Employee availability
- Facility availability
- Country or region
- Lead time
- Blackout dates

Availability may be managed by the Commerce Engine or synchronized with an external scheduling system.

---

# Service Delivery Lifecycle

```text
Service Discovered

↓

Inquiry, Booking, or Order

↓

Scheduled or Quoted

↓

Confirmed

↓

Service Started

↓

Service Delivered

↓

Customer Acceptance

↓

Commercial Transaction Completed
```

Possible exception states include:

- Rescheduled
- Cancelled
- No Show
- Disputed
- Partially Completed
- Rejected

---

# Quote-Based Commerce

Quote-based Products and Services require a different workflow from fixed-price commerce.

```text
Catalog Offering

↓

Member Inquiry

↓

Provider Assessment

↓

Quote Created

↓

Quote Reviewed

↓

Quote Accepted

↓

Order or Service Agreement

↓

Delivery or Fulfillment

↓

Commercial Transaction
```

A quote should contain:

- Offering reference
- Scope
- Price
- Currency
- Included items
- Excluded items
- Taxes
- Additional charges
- Expiration date
- Provider approval
- Member acceptance

Accepted quotes become immutable transaction inputs.

---

# Product and Service Packages

Packages may contain:

- Products only
- Services only
- Products and Services
- Optional components
- Required components
- Tiered packages

Examples:

```text
Installation Package
├── Equipment Product
├── Installation Service
└── Maintenance Service
```

Each component remains separately identifiable for reporting, taxation, fulfillment, and Qualified Transaction Value processing.

---

# Pricing and Transaction Snapshots

When a Product or Service is added to an Order, Quote, Booking, Subscription, or Commercial Transaction, the Commerce Engine creates an immutable snapshot.

The snapshot may contain:

- Offering ID
- Offering Type
- Name
- Description
- Variant or service level
- Quantity
- Unit Price
- Agreed Price
- Currency
- Discount
- Tax Classification
- Shipping or service charges
- Platform Partner
- Applicable location
- Effective agreement references

Later changes to the Catalog must not alter historical transaction data.

---

# Qualified Transaction Value Relationship

Products and Services provide the commercial data needed for calculating Qualified Transaction Value (QTV).

However, this component does not calculate the final QTV.

The Platform Participation Engine applies the active Platform Participation Agreement to determine:

- Eligible transaction components
- Excluded amounts
- Applicable PPF percentage
- Product-specific rules
- Service-specific rules
- Country-specific treatment

The Revenue Allocation Engine later validates and processes Qualified Platform Revenue.

---

# Commercial Transaction Relationship

Products and Services become economically relevant only when included in a completed Commercial Transaction.

```text
Product or Service Offering

↓

Order, Booking, Quote, or Subscription

↓

Fulfillment or Delivery

↓

Commercial Transaction Completed

↓

Downstream Participation Processing
```

Creating or publishing an Offering does not generate:

- Platform Participation Fee
- Qualified Platform Revenue
- Reward Points
- Business Cells
- Hive Credits

Only qualified completed transactions may progress downstream.

---

# Business Rules

## PS-001

Every Product or Service must belong to a Catalog.

---

## PS-002

Every Product or Service must belong to an active Platform Partner.

---

## PS-003

Only Platform Product Providers may publish Product Offerings.

---

## PS-004

Only Platform Service Providers may publish Service Offerings.

---

## PS-005

A Platform Partner may hold both provider roles.

---

## PS-006

Every active Offering must define a price or indicate that a quote is required.

---

## PS-007

Physical Products requiring fulfillment must define fulfillment rules.

---

## PS-008

Scheduled Services must define availability and scheduling rules.

---

## PS-009

Quote-based Offerings must produce an accepted Quote before generating a completed Commercial Transaction.

---

## PS-010

Catalog changes must not modify historical Orders, Quotes, Bookings, or Commercial Transactions.

---

## PS-011

Products and Services do not directly calculate PPF, QTV, QPR, RP, ABC, or AHC.

---

## PS-012

Retired Offerings remain available for historical reporting but cannot participate in new transactions.

---

## PS-013

Every completed Product or Service transaction must preserve an immutable snapshot of the purchased Offering.

---

## PS-014

A Package containing multiple Offering types must preserve the identity and value of each component.

---

# Domain Events

Product events may include:

- ProductCreated
- ProductSubmitted
- ProductApproved
- ProductPublished
- ProductUpdated
- ProductPriceChanged
- ProductInventoryChanged
- ProductSuspended
- ProductRetired

Service events may include:

- ServiceCreated
- ServiceSubmitted
- ServiceApproved
- ServicePublished
- ServiceAvailabilityChanged
- ServiceBooked
- ServiceStarted
- ServiceCompleted
- ServiceCancelled
- ServiceSuspended
- ServiceRetired

Package and quote events may include:

- PackageCreated
- PackageUpdated
- QuoteRequested
- QuoteCreated
- QuoteAccepted
- QuoteRejected
- QuoteExpired

---

# Relationship with Other Engines

| Platform Engine | Relationship |
|-----------------|--------------|
| Identity Engine | Authenticates Partner Users and administrators. |
| Membership Engine | Identifies Members and transaction eligibility. |
| Platform Participation Engine | Verifies Provider roles and PPA terms. |
| Commerce Engine | Manages Catalogs, Products, Services, Orders, Quotes, Bookings, and Commercial Transactions. |
| Revenue Allocation Engine | Receives transaction data after participation processing. |
| Financial Engine | Handles payment processing, refunds, and accounting where applicable. |
| Analytics Engine | Measures product and service performance. |
| AI Engine | Supports classification, descriptions, recommendations, forecasting, and moderation. |

---

# AI Capabilities

Artificial Intelligence may assist with:

- Product and service classification
- Attribute extraction
- Description generation
- Search optimization
- Pricing recommendations
- Quote assistance
- Demand forecasting
- Inventory forecasting
- Schedule optimization
- Package recommendations
- Duplicate detection
- Prohibited offering detection
- Translation and localization

AI-generated changes require Platform Partner or administrative approval where appropriate.

---

# Governance and Compliance

Products and Services may be subject to:

- Country restrictions
- Licensing requirements
- Age restrictions
- Professional credential requirements
- Product safety rules
- Health regulations
- Insurance regulations
- Real estate regulations
- Tax classification
- Prohibited offering policies

The Catalog may record compliance metadata, but authoritative licensing and participation eligibility belong to the appropriate platform domains.

---

# Long-Term Vision

The Products and Services model should provide a universal foundation for every commercial offering supported by AsBeez.

The platform should accommodate new industries by extending offering schemas, attributes, pricing models, and workflows through configuration rather than building separate product or service systems.

This foundation should eventually support:

- Retail
- Restaurants
- Automotive
- Contractors
- Insurance
- Real estate
- Healthcare
- Legal services
- Hospitality
- Travel
- Education
- Professional services
- Software
- Digital products
- Future industries

---

# Closing Statement

Products and Services are the primary offerings through which Members and Platform Partners engage in commerce.

By representing both through a shared Catalog Offering foundation while preserving their specialized fulfillment and delivery requirements, AsBeez creates a flexible, industry-neutral commerce model that supports diverse business activity without duplicating platform capabilities.

---

# Products and Services Principle

> **Products represent items that are transferred. Services represent outcomes that are delivered. Both are standardized as Catalog Offerings, preserved through immutable transaction snapshots, and transformed into trusted Commercial Transactions before downstream participation, revenue, reward, or financial processing begins.**

---

# Related Documents

- 000-index.md
- 001-overview.md
- 002-domain-model.md
- 003-catalog.md
- 005-shopping-cart.md
- 006-orders.md
- 007-commercial-transactions.md
- ../004-platform-participation-engine/000-index.md
- ../005-revenue-allocation-engine/000-index.md

---

# Revision History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial Products and Services specification for the Commerce Engine. |