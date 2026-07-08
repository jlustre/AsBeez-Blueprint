# Vendor Capabilities

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-140 |
| Capability ID | BC-VEN-140 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Vendor |
| Owner | Vendor Domain |

---

# Overview

The Vendor Capability enables individuals and businesses to sell products and services through the AsBeez Marketplace.

It provides Vendors with the tools to manage their storefront, publish products, monitor sales, participate in revenue sharing, and grow their business while leveraging the AsBeez ecosystem.

---

# Responsibilities

The Vendor Capability is responsible for:

- Vendor Registration
- Vendor Approval
- Storefront Management
- Product Publishing
- Product Approval
- Product Pricing
- Product Promotions
- Discount Coupons
- Revenue Sharing
- Vendor Analytics
- Vendor Wallet
- Vendor Payouts

The Vendor Capability is **not responsible** for:

- Customer purchases
- Shopping Cart
- Checkout
- Payment Processing
- Order Management
- Reward Point calculations
- ABC generation
- AHC distribution

These responsibilities belong to their respective capabilities.

---

# Vendor Types

The platform supports multiple vendor types.

| Type | Description |
|------|-------------|
| Individual | Individual seller |
| Business | Registered business |
| Organization | Non-profit or organization |
| Enterprise | Large commercial vendor |

Additional vendor classifications may be introduced in future releases.

---

# Vendor Lifecycle

```text
Apply as Vendor
        │
        ▼
Vendor Approval
        │
        ▼
Setup Storefront
        │
        ▼
Publish Products
        │
        ▼
Receive Orders
        │
        ▼
Generate Sales
        │
        ▼
Receive Payouts
```

---

# Vendor Status

| Status | Description |
|----------|-------------|
| Pending | Awaiting approval |
| Active | Approved and operational |
| Suspended | Temporarily restricted |
| Inactive | Not currently selling |
| Closed | Vendor account closed |

---

# Included Capabilities

| ID | Capability |
|----|------------|
| BC-VEN-141 | Vendor Registration |
| BC-VEN-142 | Storefront |
| BC-VEN-143 | Product Publishing |
| BC-VEN-144 | Product Approval |
| BC-VEN-145 | Vendor Coupons |
| BC-VEN-146 | Vendor Analytics |
| BC-VEN-147 | Revenue Sharing |
| BC-VEN-148 | Vendor Wallet |
| BC-VEN-149 | Vendor Payouts |

---

# Configuration

Administrators may configure:

- Vendor Approval Process
- Vendor Types
- Registration Fees
- Product Limits
- Storefront Options
- Revenue Share Tiers
- Vendor Policies

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-VEN-001 | Every Vendor must have an approved Vendor account. |
| BR-VEN-002 | A Member may upgrade to a Vendor without creating a new account. |
| BR-VEN-003 | Vendors may publish products based on their subscription or product limit. |
| BR-VEN-004 | Product approval requirements are configurable by category. |
| BR-VEN-005 | A Vendor may own only one storefront. |
| BR-VEN-006 | Vendors may continue purchasing products as Customers or Members. |
| BR-VEN-007 | Revenue sharing is determined by configurable business rules. |

---

# Published Events

The Vendor Capability publishes:

- VendorRegistered
- VendorApproved
- VendorSuspended
- VendorActivated
- StorefrontCreated

---

# Consumed Events

The Vendor Capability consumes:

- MemberActivated
- OrderCompleted

---

# Related Capabilities

- BC-VEN-141 Vendor Registration
- BC-VEN-142 Storefront
- BC-VEN-143 Product Publishing
- BC-COM-101 Product Catalog
- BC-COM-105 Order Management
- BC-FIN-202 Vendor Revenue
- BC-FIN-203 Vendor Payouts

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |