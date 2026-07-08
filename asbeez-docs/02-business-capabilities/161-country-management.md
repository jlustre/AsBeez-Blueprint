# Country Management

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-161 |
| Capability ID | BC-PLT-161 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Platform |
| Owner | Platform Domain |

---

# Overview

The Country Management capability manages the countries and regions supported by the AsBeez platform.

It provides centralized configuration for country-specific business rules, allowing AsBeez to operate across multiple countries while maintaining local compliance and configuration.

---

# Responsibilities

The Country Management capability is responsible for:

- Managing supported countries
- Managing country status
- Managing country-specific settings
- Managing default currencies
- Managing default languages
- Managing default time zones
- Managing country availability

The Country Management capability is **not responsible** for:

- Currency exchange rates
- Tax calculations
- Payment gateways
- Shipping rules
- Legal compliance

---

# Country Information

Each country contains:

## Basic Information

- Country Name
- ISO Country Code
- ISO Numeric Code
- Country Flag
- Status

---

## Localization

- Default Currency
- Default Language
- Default Time Zone
- Date Format
- Number Format

---

## Platform Settings

- Marketplace Enabled
- Membership Enabled
- Vendor Registration Enabled
- Wallet Enabled
- Withdrawals Enabled

---

# Country Status

| Status | Description |
|----------|-------------|
| Active | Available for platform operations |
| Inactive | Temporarily unavailable |
| Restricted | Limited functionality |
| Disabled | Not available |

---

# Country Workflow

```text
Create Country
       │
       ▼
Configure Settings
       │
       ▼
Enable Services
       │
       ▼
Activate Country
```

---

# Country Configuration

The following settings may be configured per country:

- Default Currency
- Default Language
- Time Zone
- Supported Payment Methods
- Supported Withdrawal Methods
- Registration Availability
- Vendor Availability
- Marketplace Availability

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-CTY-001 | Every supported country must have a unique ISO country code. |
| BR-CTY-002 | Every active country must have a default currency. |
| BR-CTY-003 | Every active country must have a default time zone. |
| BR-CTY-004 | Platform features may be enabled or disabled per country. |
| BR-CTY-005 | Deactivating a country prevents new registrations and new marketplace activity but does not affect historical records. |
| BR-CTY-006 | Country configuration changes must be audited. |

---

# Published Events

The Country Management capability publishes:

- CountryCreated
- CountryUpdated
- CountryActivated
- CountryDeactivated

---

# Consumed Events

None.

---

# Related Capabilities

- BC-PLT-162 Currency Management
- BC-PLT-163 Tax Management
- BC-PLT-164 Configuration Engine
- BC-MEM-121 Member Registration
- BC-VEN-141 Vendor Registration

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |