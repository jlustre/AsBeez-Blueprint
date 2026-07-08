# Dashboards

---

## Document Information

| Property | Value |
|----------|-------|
| Document ID | AEDS-B03-169 |
| Capability ID | BC-PLT-169 |
| Version | 1.0.0 |
| Status | Draft |
| Domain | Platform |
| Owner | Platform Domain |

---

# Overview

The Dashboards capability provides role-based visual summaries of key information across the AsBeez platform.

Dashboards present real-time and near real-time metrics to help users monitor activities, identify trends, and quickly access important information.

Dashboards are informational only and do not modify business data.

---

# Responsibilities

The Dashboards capability is responsible for:

- Displaying business metrics
- Displaying KPIs
- Displaying charts and graphs
- Displaying summary statistics
- Providing quick navigation
- Providing personalized dashboard layouts

The Dashboards capability is **not responsible** for:

- Report generation
- Business analytics
- Business transactions
- Data calculations
- Business rule processing

---

# Dashboard Types

The platform provides dashboards for:

## Customer Dashboard

- Recent Orders
- Wishlist
- Recent Purchases
- Recommended Products

---

## Member Dashboard

- Reward Points (RP)
- ABC Summary
- AHC Balance
- Wallet Balance
- Referral Summary
- Qualified Referrals
- Recent Activity

---

## Vendor Dashboard

- Sales Summary
- Revenue
- Pending Payouts
- Product Performance
- Storefront Statistics
- Recent Orders

---

## Administrator Dashboard

- Platform Overview
- Active Members
- Active Vendors
- Sales Overview
- Marketplace Activity
- Pending Approvals
- System Health

---

# Dashboard Widgets

Supported widgets include:

- KPI Cards
- Charts
- Graphs
- Tables
- Progress Indicators
- Recent Activity
- Notifications
- Quick Actions

---

# Personalization

Users may customize:

- Widget Layout
- Dashboard Theme *(Future)*
- Default Dashboard
- Favorite Widgets
- Refresh Frequency

---

# Dashboard Workflow

```text
User Login
      │
      ▼
Load Dashboard
      │
      ▼
Retrieve Dashboard Data
      │
      ▼
Render Widgets
      │
      ▼
Display Dashboard
```

---

# Refresh

Dashboard data may be refreshed:

- Automatically
- Manually
- On Login
- On Demand

Refresh intervals are configurable.

---

# Configuration

Administrators may configure:

- Dashboard Templates
- Available Widgets
- Role-Based Dashboards
- Refresh Intervals
- Default Layouts
- Widget Permissions

---

# Business Rules

| Rule ID | Description |
|----------|-------------|
| BR-DSH-001 | Dashboard content is determined by user role. |
| BR-DSH-002 | Users may only view information they are authorized to access. |
| BR-DSH-003 | Dashboards display summarized information only. |
| BR-DSH-004 | Dashboard widgets are configurable. |
| BR-DSH-005 | Dashboard data may be refreshed according to the configured refresh interval. |
| BR-DSH-006 | Dashboard customization is stored per user. |

---

# Published Events

The Dashboards capability publishes:

- DashboardLoaded
- DashboardRefreshed
- DashboardCustomized

---

# Consumed Events

Dashboards consume data from all business domains as required.

Examples include:

- OrderCompleted
- PaymentCaptured
- MemberActivated
- RewardPointsEarned
- ABCCreated
- AHCEarned
- VendorPayoutCompleted
- ReportGenerated

---

# Related Capabilities

- BC-PLT-168 Reporting
- BC-PLT-167 AI Services
- BC-PLT-165 Notification Services
- All Business Domains

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial version |