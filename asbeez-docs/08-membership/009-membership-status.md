# Membership Status

## Introduction

The **Membership Status** module defines the operational state of every individual within the AsBeez Membership Engine. While the Membership Lifecycle describes the overall journey of a participant, the Membership Status module defines the **current condition** of a Customer or Member at any given moment.

Membership Status determines:

- Platform permissions
- Available features
- Marketplace participation
- Reward eligibility
- Financial capabilities
- Administrative actions
- Compliance requirements

Every status change is recorded, auditable, and governed by platform policies.

---

# Objectives

The Membership Status module aims to:

- Define operational account states.
- Control system permissions.
- Protect platform integrity.
- Support administrative actions.
- Enable automated workflows.
- Maintain compliance.
- Improve customer experience.
- Support AI decision-making.
- Preserve historical records.
- Enable future extensibility.

---

# Design Principles

Membership Status should be:

- Transparent
- Predictable
- Auditable
- Event-driven
- Secure
- Configurable
- Country-aware
- AI-assisted
- Reversible where appropriate
- Scalable

---

# Status Philosophy

## Status Represents Current State

A Member's status represents their current operational condition—not their historical participation.

Historical records are never deleted simply because a status changes.

---

## Status Is Independent of Membership Type

Membership Type defines *who* the person is.

Membership Status defines *their current operational state*.

Example:

```
Membership Type:
Qualified Member

Status:
Suspended
```

---

## Status Changes Must Be Auditable

Every status transition should record:

- Previous status
- New status
- Date and time
- Reason
- User initiating the change
- Supporting documentation (if applicable)

---

# Membership Status Hierarchy

```text
Pending

↓

Active

↓

Inactive

↓

Suspended

↓

Reactivated

↓

Closed
```

Not every account passes through every status.

---

# Status: Pending

## Description

The account has been created but is not yet fully activated.

Possible reasons:

- Email not verified.
- Phone verification pending.
- Identity verification pending.
- Administrative approval pending.

---

## Permissions

Pending accounts may:

- Log in (optional policy).
- Complete onboarding.
- Verify identity.

Pending accounts may not:

- Perform financial operations.
- Create ABCs.
- Access Member benefits.

---

# Status: Active

## Description

The account is fully operational.

Requirements:

- Registration complete.
- Verification requirements satisfied.
- No administrative restrictions.

---

## Active Members May

- Purchase products.
- Sell products (if Vendor).
- Earn Reward Points.
- Create ABCs.
- Earn AHC.
- Sponsor Customers.
- Manage beneficiaries.
- Access Wallet.
- Participate in promotions.

This is the normal operational state.

---

# Status: Inactive

## Description

The account remains valid but is not actively participating.

Reasons may include:

- Voluntary inactivity.
- Long-term inactivity.
- Future inactivity policies.
- Temporary pause.

---

## Inactive Members

Historical ownership remains intact.

Depending on policy they may temporarily lose:

- Promotional eligibility.
- Certain incentives.
- Some participation privileges.

Core ownership records remain preserved.

---

# Status: Suspended

## Description

Suspension is a temporary restriction placed upon an account.

Possible reasons:

- Fraud investigation.
- Compliance review.
- Policy violations.
- Security concerns.
- Court order.

---

## Suspended Permissions

Suspended accounts may be restricted from:

- Logging in.
- Marketplace purchases.
- Wallet transactions.
- ABC creation.
- Withdrawals.
- Sponsor activities.

Administrative policies determine exact restrictions.

---

# Status: Reactivated

## Description

A previously Inactive or Suspended account has returned to Active status.

Reactivation may require:

- Identity verification.
- Compliance review.
- Administrative approval.
- Resolution of outstanding issues.

Historical records remain unchanged.

---

# Status: Closed

## Description

The Membership relationship has ended.

Possible reasons:

- Voluntary closure.
- Death.
- Court order.
- Administrative termination.
- Regulatory requirement.

---

## Closed Accounts

Closed accounts:

- Cannot log in.
- Cannot perform transactions.
- Cannot receive new rewards.
- Remain permanently archived.

Historical information is retained for legal, financial, and auditing purposes.

---

# Temporary Administrative Statuses

Future versions may support additional operational states.

Examples:

## Under Review

Used during:

- Fraud investigations.
- Compliance audits.
- Identity disputes.

---

## Locked

Temporary security lock due to:

- Multiple failed login attempts.
- Suspicious activity.
- Device compromise.

---

## Restricted

Allows limited access while preventing specific actions.

Example:

Marketplace browsing allowed

↓

Financial operations disabled

---

## Pending Beneficiary Transfer

Applied after a Member's death while beneficiary claims are being processed.

This status prevents unauthorized activity until asset transfers are completed.

---

# Status Transition Matrix

| Current Status | Allowed Next Status |
|----------------|---------------------|
| Pending | Active, Closed |
| Active | Inactive, Suspended, Closed |
| Inactive | Active, Suspended, Closed |
| Suspended | Active, Closed |
| Reactivated | Active |
| Closed | *(No further transitions)* |

Closed accounts are considered terminal unless exceptional legal procedures apply.

---

# Automatic Status Changes

Certain transitions may occur automatically.

Examples:

## Pending → Active

Triggered after:

- Email verification.
- Required onboarding completed.

---

## Active → Suspended

Triggered by:

- Fraud detection.
- Administrative action.
- Regulatory requirement.

---

## Inactive → Active

Triggered by:

- Successful login.
- Marketplace activity.
- Administrative approval.

Automation rules should be configurable.

---

# Manual Status Changes

Administrators may manually change status when appropriate.

Examples:

- Fraud investigation.
- Court order.
- Compliance review.
- Member request.
- Legal requirement.

Manual changes require audit logging.

---

# Status History

Every account maintains a permanent status history.

Example:

```
Pending

↓

Active

↓

Suspended

↓

Active

↓

Inactive

↓

Active
```

History is never overwritten.

---

# Effect on Membership Assets

Status affects asset usage—not ownership.

Examples:

| Asset | Suspended | Closed |
|---------|-----------|---------|
| Reward Points | Frozen | Archived |
| ABC | Preserved | Archived |
| AHC | Frozen | Archived |
| Wallet | Frozen | Closed after settlement |
| Marketplace Orders | Read Only | Archived |

Historical ownership remains intact unless otherwise required by law.

---

# Effect on Referrals

Sponsor relationships remain permanent.

Status changes do **not** modify:

- Sponsor history.
- Referral ownership.
- Historical referral records.

Future reward eligibility may be affected depending on platform rules.

---

# Effect on Beneficiaries

Beneficiary records remain associated with the Member.

Examples:

Active

↓

Beneficiary editable

---

Suspended

↓

Editing restricted

---

Closed (Death)

↓

Transfer processing begins

---

# Notifications

Status changes generate notifications.

Examples:

- Account activated.
- Account suspended.
- Reactivation successful.
- Inactivity reminder.
- Security lock.
- Administrative review.
- Account closure.

Notification preferences should be configurable.

---

# AI Assistance

Artificial Intelligence assists with status management.

Examples:

- Detect suspicious behavior.
- Recommend reactivation campaigns.
- Predict inactive members.
- Identify fraud risks.
- Suggest compliance reviews.
- Monitor unusual activity.

AI recommendations support—but do not replace—administrative decision-making.

---

# Security

Status management requires strict security.

Controls include:

- Multi-Factor Authentication
- Role-Based Access Control (RBAC)
- Administrative approval workflows
- Immutable audit logs
- Fraud monitoring
- Session management

Unauthorized status changes must be prevented.

---

# Compliance

Status management should support:

- KYC requirements
- AML obligations
- Data privacy regulations
- Financial reporting
- Court orders
- Country-specific legal requirements

Compliance actions should be documented and traceable.

---

# Reporting

Useful reports include:

- Active Members
- Inactive Members
- Suspended Accounts
- Reactivated Members
- Closed Accounts
- Status transition history
- Country breakdown
- Fraud-related suspensions
- Average inactive duration

These reports support operational management and strategic planning.

---

# Integration with Core Engines

## Membership Engine

- Membership lifecycle
- Status transitions

---

## Identity Engine

- Authentication
- Account security

---

## Rewards Engine

- Reward eligibility
- ABC participation
- AHC processing

---

## Financial Engine

- Wallet access
- Withdrawals
- Account settlement

---

## CRM Engine

- Re-engagement campaigns
- Customer communication

---

## Notification Engine

- Status alerts
- Security notifications

---

## AI Engine

- Fraud detection
- Risk analysis
- Predictive retention

---

## Analytics Engine

- Membership health
- Churn analysis
- Operational reporting

---

# Best Practices

- Keep status definitions simple and unambiguous.
- Separate Membership Type from Membership Status.
- Preserve complete historical records.
- Automate low-risk transitions.
- Require human approval for high-risk changes.
- Never silently modify status.
- Protect membership assets during restrictions.
- Notify Members of significant status changes.
- Maintain immutable audit logs.
- Regularly review status policies for regulatory compliance.

---

# Related Documents

This document complements:

- 000-index.md
- 001-overview.md
- 002-membership-lifecycle.md
- 003-membership-types.md
- 005-verification-kyc.md
- 006-membership-benefits.md
- 007-referrals-sponsorship.md
- 008-beneficiary-management.md
- 010-upgrades-renewals.md
- 011-country-memberships.md
- 012-membership-governance.md
- 013-member-dashboard.md
- 014-api.md
- 015-events.md

---

# Summary

The Membership Status module defines the real-time operational condition of every Customer and Member within the AsBeez ecosystem. By distinguishing operational state from membership type, maintaining immutable status histories, protecting membership assets during restrictions, and integrating with security, compliance, AI, and notification systems, the module provides a robust framework for managing account permissions and lifecycle events. Its transparent, auditable, and event-driven design ensures that status changes are consistently applied while preserving trust, regulatory compliance, and the long-term integrity of the AsBeez platform.