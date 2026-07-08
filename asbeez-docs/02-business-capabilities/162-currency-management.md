# Currency Management

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-162 |
| Capability ID | BC-PLT-162 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Platform |
| Owner | Platform Domain |

---

# Overview

The Currency Management capability manages the currencies supported by the AsBeez platform.

It provides centralized configuration for currency definitions, exchange rates, formatting, rounding rules, and currency availability across all business domains.

---

# Responsibilities

The Currency Management capability is responsible for:

- Managing supported currencies
- Managing exchange rates
- Managing currency symbols
- Managing currency formatting
- Managing decimal precision
- Managing rounding rules
- Managing default currencies

The Currency Management capability is **not responsible** for:

- Payment processing
- Tax calculations
- Revenue calculations
- Wallet balances
- Financial accounting

---

# Currency Information

Each currency contains:

## Basic Information

- Currency Name
- ISO Currency Code
- Currency Symbol
- Status

---

## Display Settings

- Decimal Places
- Decimal Separator
- Thousand Separator
- Display Format

---

## Exchange Rate

- Base Currency
- Exchange Rate
- Effective Date
- Last Updated

---

# Currency Status

| Status | Description |
|----------|-------------|
| Active | Available for transactions |
| Inactive | Not available for new transactions |

---

# Currency Workflow

```text
Create Currency
       │
       ▼
Configure Display Format
       │
       ▼
Configure Exchange Rate
       │
       ▼
Activate Currency
```

---

# Exchange Rates

Exchange rates may be maintained by:

- Manual Entry
- External Exchange Rate Provider *(Future)*

The platform stores the effective exchange rate used for each conversion.

Historical rates are retained for auditing purposes.

---

# Currency Conversion

Currency conversion may be used by:

- Product Pricing
- Shopping Cart
- Checkout
- Vendor Reports
- Financial Reports

Each business capability uses the exchange rate effective at the time of the transaction unless otherwise configured.

---

# Configuration

Administrators may configure:

- Base Currency
- Supported Currencies
- Exchange Rates
- Decimal Precision
- Rounding Rules
- Currency Display Format

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-CUR-001 | Every active country must have a default currency. |
| BR-CUR-002 | Currency codes must follow ISO 4217 standards. |
| BR-CUR-003 | Only active currencies may be used for new transactions. |
| BR-CUR-004 | Historical exchange rates must be retained for auditing purposes. |
| BR-CUR-005 | Currency formatting is configurable per currency. |
| BR-CUR-006 | Currency conversions use the configured exchange rate effective at the time of the transaction. |

---

# Published Events

The Currency Management capability publishes:

- CurrencyCreated
- CurrencyUpdated
- ExchangeRateUpdated
- CurrencyActivated
- CurrencyDeactivated

---

# Consumed Events

None.

---

# Related Capabilities

- BC-PLT-161 Country Management
- BC-PLT-163 Tax Management
- BC-COM-103 Checkout
- BC-COM-104 Payment Processing
- BC-FIN-201 Financial Ledger

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |