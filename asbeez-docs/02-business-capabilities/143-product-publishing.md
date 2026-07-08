# Product Publishing

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-143 |
| Capability ID | BC-VEN-143 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Vendor |
| Owner | Vendor Domain |

---

# Overview

The Product Publishing capability allows Vendors to create, manage, and publish products to the AsBeez Marketplace.

It provides the workflow for preparing products for publication while ensuring that platform policies and approval requirements are satisfied.

---

# Responsibilities

The Product Publishing capability is responsible for:

- Creating products
- Editing products
- Uploading product media
- Managing product variants
- Managing product pricing
- Publishing products
- Unpublishing products
- Archiving products

The Product Publishing capability is **not responsible** for:

- Product approval
- Product catalog management
- Orders
- Payments
- Reward calculations
- Product reviews

---

# Supported Product Types

The capability supports:

- Digital Products
- Physical Products *(Future)*
- Services *(Future)*
- Subscription Products *(Future)*

---

# Publishing Workflow

```text
Create Product
       │
       ▼
Complete Product Information
       │
       ▼
Upload Media
       │
       ▼
Save Draft
       │
       ▼
Submit for Publication
       │
       ▼
Product Approval (if required)
       │
       ▼
Publish Product
```

---

# Product Status

| Status | Description |
|----------|-------------|
| Draft | Product is being prepared |
| Pending Approval | Awaiting review |
| Approved | Ready for publication |
| Published | Visible in the marketplace |
| Unpublished | Hidden from customers |
| Archived | No longer available for sale |

---

# Product Information

A published product may include:

## Basic Information

- Product Name
- Description
- Product Type
- Category
- Tags

---

## Pricing

- Regular Price
- Sale Price
- Currency

---

## Media

- Primary Image
- Gallery Images
- Videos *(Optional)*
- Preview Files *(Digital Products)*

---

## Digital Products

- Download File
- File Size
- File Version
- Download Limit *(Optional)*

---

# Product Updates

Vendors may update published products.

Depending on platform configuration, updates may:

- Publish immediately
- Require approval before becoming effective

---

# Product Limits

Product publishing limits are configurable.

Limits may be based on:

- Vendor Plan
- Vendor Tier
- Registration Package
- Purchased Product Slots

---

# Configuration

Administrators may configure:

- Maximum Products
- Supported Product Types
- Maximum File Size
- Supported File Formats
- Product Update Approval
- Auto Publishing
- Draft Expiration

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-PP-001 | Only approved Vendors may publish products. |
| BR-PP-002 | Products must contain all required information before publication. |
| BR-PP-003 | Publishing may require approval based on platform configuration. |
| BR-PP-004 | Vendors may save products as Draft before publishing. |
| BR-PP-005 | Product limits are determined by Vendor configuration. |
| BR-PP-006 | Archived products remain available in historical orders. |
| BR-PP-007 | Only Published products are visible to customers. |

---

# Published Events

The Product Publishing capability publishes:

- ProductCreated
- ProductUpdated
- ProductSubmitted
- ProductPublished
- ProductUnpublished
- ProductArchived

---

# Consumed Events

The Product Publishing capability consumes:

- VendorApproved
- ProductApproved

---

# Related Capabilities

- BC-COM-101 Product Catalog
- BC-VEN-142 Storefront
- BC-VEN-144 Product Approval

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |