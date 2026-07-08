# Tax Management

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-163 |
| Capability ID | BC-PLT-163 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Platform |
| Owner | Platform Domain |

---

# Overview

The Tax Management capability provides centralized management of taxes applicable to transactions within the AsBeez platform.

It allows taxes to be configured by country, region, product type, and tax category, ensuring consistent tax calculations across the marketplace.

---

# Responsibilities

The Tax Management capability is responsible for:

- Managing tax jurisdictions
- Managing tax categories
- Managing tax rates
- Determining applicable taxes
- Calculating taxes
- Maintaining tax history
- Supporting tax exemptions

The Tax Management capability is **not responsible** for:

- Payment collection
- Financial accounting
- Government tax filing
- Vendor tax reporting
- Currency conversion

---

# Tax Jurisdictions

Taxes may be configured by:

- Country
- State / Province
- Territory
- Region
- City *(Future)*

---

# Tax Categories

Products may belong to different tax categories.

Examples:

- Standard Tax
- Reduced Tax
- Zero Rated
- Tax Exempt
- Digital Products
- Services
- Physical Products

---

# Tax Information

Each tax rule contains:

## Basic Information

- Tax Name
- Tax Code
- Jurisdiction
- Tax Category
- Tax Rate
- Status

---

## Effective Period

- Effective Date
- Expiration Date *(Optional)*

---

## Calculation

- Percentage Rate
- Fixed Amount *(Future)*
- Compound Tax *(Future)*

---

# Tax Workflow

```text
Transaction Created
        │
        ▼
Determine Jurisdiction
        │
        ▼
Determine Tax Category
        │
        ▼
Calculate Tax
        │
        ▼
Return Tax Amount
```

---

# Tax Calculation

Tax calculations may consider:

- Customer Country
- Vendor Country
- Product Type
- Product Category
- Tax Category
- Transaction Amount

The applicable tax rules are determined at the time of the transaction.

---

# Tax Exemptions

The platform may support:

- Tax Exempt Products
- Tax Exempt Customers
- Country Exemptions
- Promotional Tax Rules *(Future)*

---

# Configuration

Administrators may configure:

- Tax Jurisdictions
- Tax Categories
- Tax Rates
- Effective Dates
- Tax Exemptions
- Rounding Rules

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-TAX-001 | Tax rules are configurable by jurisdiction. |
| BR-TAX-002 | Products must belong to a tax category. |
| BR-TAX-003 | Only active tax rules are applied to transactions. |
| BR-TAX-004 | Historical transactions retain the tax rate used at the time of purchase. |
| BR-TAX-005 | Tax calculations occur during Checkout. |
| BR-TAX-006 | Tax rule changes do not affect completed transactions. |

---

# Published Events

The Tax Management capability publishes:

- TaxCalculated
- TaxRuleCreated
- TaxRuleUpdated
- TaxRuleActivated
- TaxRuleDeactivated

---

# Consumed Events

- CheckoutStarted
- CountryUpdated
- CurrencyUpdated

---

# Related Capabilities

- BC-PLT-161 Country Management
- BC-PLT-162 Currency Management
- BC-COM-103 Checkout
- BC-COM-105 Order Management
- BC-FIN-201 Financial Ledger

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |