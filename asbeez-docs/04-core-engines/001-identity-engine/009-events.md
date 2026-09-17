# Business Events

---

## Document Information

| Property | Value |
|----------|-------|
| Engine | Identity Engine |
| Document | Business Events |
| Document ID | AEDS-IE-009 |
| Version | 1.0.0 |
| Status | Foundational |
| Owner | Platform Architecture Team |

---

# Introduction

The Identity Engine communicates with the rest of the AsBeez Platform through immutable business events.

Whenever something significant happens within the Identity Engine, an event is published to the platform's Event Bus.

Other Platform Engines subscribe to the events they need without creating direct dependencies on the Identity Engine.

This architecture enables loose coupling, scalability, extensibility, and independent evolution of every Platform Engine.

---

# Purpose

Business Events exist to:

- Notify the platform of important identity activities.
- Decouple Platform Engines.
- Trigger business workflows.
- Support auditing.
- Enable analytics.
- Feed Artificial Intelligence.
- Improve scalability.

Events communicate facts.

They never issue commands.

---

# Event Philosophy

The Identity Engine follows one principle.

> **Publish what happened. Never tell another engine what to do.**

For example:

✔ IdentityRegistered

✘ CreateMember

The Membership Engine decides whether it needs to react.

---

# Event Lifecycle

```text
Business Action

      │

      ▼

Business Rule Executed

      │

      ▼

Event Published

      │

      ▼

Event Bus

      │

      ▼

Subscribed Platform Engines

Membership

Commerce

Rewards

Financial

Vendor

Partner

Analytics

AI

Notification
```

The Identity Engine is unaware of its subscribers.

---

# Event Categories

Business Events are organized into functional groups.

- Identity Events
- Authentication Events
- Authorization Events
- Session Events
- Credential Events
- Device Events
- Security Events
- Administration Events

---

# Identity Events

These events describe changes to an Identity.

## IdentityRegistered

Published when a new identity is created.

Typical Subscribers:

- Membership Engine
- Notification Engine
- Analytics Engine
- AI Engine

---

## IdentityVerified

Published after successful identity verification.

Subscribers may enable additional capabilities.

---

## IdentityActivated

Published when an identity becomes active.

---

## IdentitySuspended

Published when access is temporarily suspended.

---

## IdentityReactivated

Published when access is restored.

---

## IdentityDeactivated

Published when an identity is permanently deactivated.

---

## IdentityArchived

Published when the identity lifecycle ends.

---

# Authentication Events

## UserAuthenticated

Successful authentication.

---

## AuthenticationFailed

Authentication attempt failed.

---

## PasswordChanged

Participant changed password.

---

## PasswordResetRequested

Password reset initiated.

---

## PasswordResetCompleted

Password reset successfully completed.

---

## MFAEnabled

Participant enabled Multi-Factor Authentication.

---

## MFADisabled

Participant disabled Multi-Factor Authentication.

---

## MFAVerified

Multi-Factor Authentication completed successfully.

---

# Authorization Events

## RoleAssigned

Role granted.

---

## RoleRemoved

Role removed.

---

## PermissionGranted

Permission granted.

---

## PermissionRevoked

Permission revoked.

---

## AuthorizationDenied

Access denied.

---

## PrivilegeEscalationDetected

Potential privilege escalation detected.

---

# Session Events

## SessionStarted

New authenticated session created.

---

## SessionEnded

Participant logged out.

---

## SessionExpired

Session expired.

---

## SessionRevoked

Session forcibly terminated.

---

# Credential Events

## CredentialAdded

New credential registered.

---

## CredentialRemoved

Credential removed.

---

## CredentialUpdated

Credential updated.

---

# Device Events

## TrustedDeviceRegistered

Trusted device added.

---

## TrustedDeviceRemoved

Trusted device removed.

---

## SuspiciousDeviceDetected

Unrecognized or suspicious device detected.

---

# Security Events

## AccountLocked

Account temporarily locked.

---

## AccountUnlocked

Account unlocked.

---

## SuspiciousLoginDetected

Potential account compromise detected.

---

## ImpossibleTravelDetected

Authentication from geographically impossible locations.

---

## TokenRevoked

Access token invalidated.

---

## SecurityPolicyViolation

Identity violated configured security policy.

---

# Administration Events

## IdentityMerged

Two identities merged by an administrator.

---

## IdentityRecovered

Administrative account recovery completed.

---

## AdministrativeAccessGranted

Administrative privileges granted.

---

## AdministrativeAccessRevoked

Administrative privileges removed.

---

# Standard Event Structure

Every event should contain common metadata.

Example:

```json
{
  "eventId": "uuid",
  "eventType": "IdentityRegistered",
  "eventVersion": "1.0",
  "occurredAt": "2026-07-08T12:00:00Z",
  "aggregateId": "identity-id",
  "actorId": "participant-id",
  "correlationId": "request-id",
  "country": "US",
  "payload": { }
}
```

Event payloads should contain business information only.

---

# Event Naming

Events should follow these rules.

- Past tense
- Business language
- Technology independent
- Immutable

Examples:

✔ IdentityVerified

✔ SessionStarted

✔ PasswordChanged

Avoid:

✘ VerifyIdentity

✘ StartSession

✘ ChangePassword

Commands are not events.

---

# Event Versioning

Business Events evolve over time.

Rules:

- Additive changes preserve compatibility.
- Breaking changes require a new event version.
- Subscribers should tolerate unknown fields.

Backward compatibility should be maintained whenever practical.

---

# Event Consumers

Typical subscribers include:

| Engine | Example Usage |
|---------|---------------|
| Membership | Create member profile after registration. |
| Rewards | Enable reward eligibility after verification. |
| Financial | Associate identity with wallets. |
| Vendor | Enable vendor onboarding. |
| Partner | Activate partner participation. |
| Notification | Send emails and alerts. |
| Analytics | Update metrics and dashboards. |
| AI | Learn behavior and detect anomalies. |

The Identity Engine does not know which engines consume its events.

---

# Reliability

Business Events should be:

- Immutable
- Durable
- Ordered where required
- Traceable
- Retryable
- Idempotent

Event delivery should be reliable even during partial failures.

---

# Security

Events should never expose:

- Passwords
- Secrets
- Private Keys
- MFA Codes
- Tokens
- Sensitive Personal Information

Sensitive data should remain within the Identity Engine.

---

# AI Integration

The AI Engine subscribes to identity events for:

- Fraud detection
- Behavioral analysis
- Risk scoring
- Login anomaly detection
- Security recommendations
- Adaptive authentication

AI consumes events without modifying them.

---

# Future Expansion

Future events may include:

- PasskeyRegistered
- BiometricVerified
- DIDVerified
- CredentialPresented
- ContinuousAuthenticationPassed
- RiskScoreChanged

The event model should evolve without breaking existing subscribers.

---

# Closing Statement

Business Events are the communication language of the AsBeez Platform.

By publishing immutable business facts instead of direct commands, the Identity Engine enables every Platform Engine to evolve independently while remaining synchronized through a shared stream of trusted events.

This event-driven approach allows the platform to scale across industries, countries, and future technologies without introducing unnecessary coupling.

---

# Event Principle

> **The Identity Engine publishes immutable business facts that describe completed identity activities, enabling every authorized Platform Engine to react independently while preserving loose coupling, scalability, and long-term architectural flexibility.**

---

# Related Documents

- 004-authentication.md
- 005-authorization.md
- 006-roles-permissions.md
- 007-security.md
- 008-api.md
- 010-ai-capabilities.md
- PS-009 Event-Driven Platform

---

# Revision History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | YYYY-MM-DD | Initial business event specification for the Identity Engine. |