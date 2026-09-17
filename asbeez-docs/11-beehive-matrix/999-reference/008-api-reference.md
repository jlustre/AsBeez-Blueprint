# API Reference

> **Document:** `11-beehive-matrix/999-reference/008-api-reference.md`

---

# Overview

The **API Reference** defines the canonical REST API specification for the **AsBeez Beehive Matrix**.

While each engine (Membership, Reward Engine, Wallet Engine, Partner Engine, Vendor Engine, etc.) maintains its own API documentation, this document serves as the centralized reference for the Beehive Matrix domain.

It defines:

- endpoint conventions
- request/response standards
- authentication
- authorization
- pagination
- filtering
- versioning
- idempotency
- rate limiting
- error handling
- event publishing
- security
- auditing

This document represents the logical API specification rather than a language-specific implementation.

---

# Objectives

The API Reference exists to:

- standardize API design
- simplify integrations
- support internal services
- enable third-party integrations
- improve consistency
- strengthen security
- support AI integrations
- simplify testing

---

# API Design Principles

Every API follows these principles:

- RESTful
- Stateless
- Secure by Default
- Versioned
- Idempotent
- Event Driven
- Consistent
- Documented
- Auditable
- Backward Compatible

---

# Base URL

Example:

```text
https://api.asbeez.com/api/v1
```

Development

```text
https://dev-api.asbeez.com/api/v1
```

Staging

```text
https://stg-api.asbeez.com/api/v1
```

---

# API Versioning

```text
/api/v1/

/api/v2/
```

Breaking changes require a new version.

Minor enhancements remain backward compatible.

---

# Authentication

Supported methods:

- OAuth 2.0
- JWT
- Personal Access Tokens
- API Keys (Internal)
- Service Accounts

Example:

```http
Authorization: Bearer <token>
```

---

# Authorization

Access is enforced through RBAC.

Example permissions:

- matrix.view
- matrix.create
- matrix.update
- wallet.view
- wallet.withdraw
- reward.distribute
- admin.configuration
- audit.view

---

# Standard Headers

```http
Authorization

Content-Type

Accept

Accept-Language

X-Correlation-ID

X-Request-ID

X-Country-Code

User-Agent
```

---

# Request Format

```json
{
  "data": {
  }
}
```

---

# Success Response

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": { },
  "meta": { }
}
```

---

# Error Response

```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_RULE_FAILED",
    "message": "Reward threshold not reached."
  }
}
```

---

# HTTP Status Codes

| Code | Meaning |
|------|----------|
| 200 | OK |
| 201 | Created |
| 202 | Accepted |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Failed |
| 429 | Too Many Requests |
| 500 | Internal Error |

---

# Pagination

Supported parameters:

```text
?page=1

&per_page=25
```

Response

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "per_page": 25,
    "total": 1000,
    "last_page": 40
  }
}
```

---

# Filtering

Example

```text
GET

/members

?status=active

&country=US
```

---

# Sorting

```text
?sort=created_at

?sort=-created_at
```

---

# Searching

```text
?q=John
```

Supports:

- member number
- email
- mobile
- wallet
- Business Cell ID

---

# Idempotency

Financial APIs require:

```http
Idempotency-Key:
```

Duplicate requests return the original response.

---

# Rate Limiting

Example

| API | Limit |
|------|--------|
| Authentication | 10/min |
| Public APIs | 100/min |
| Member APIs | 300/min |
| Admin APIs | Configurable |
| Internal APIs | Unlimited (Trusted Network) |

---

# Correlation ID

Every request generates:

```text
Correlation ID
```

Used throughout:

- APIs
- events
- ledger
- audit
- notifications
- AI

---

# Member APIs

---

## Register Member

```http
POST /members
```

Request

```json
{
  "first_name":"John",
  "last_name":"Doe",
  "email":"john@example.com"
}
```

Response

```json
{
  "member_id":"UUID"
}
```

Events

- MemberRegistered

---

## Retrieve Member

```http
GET /members/{id}
```

---

## Update Member

```http
PUT /members/{id}
```

---

## Suspend Member

```http
POST /members/{id}/suspend
```

---

## Reinstate Member

```http
POST /members/{id}/reinstate
```

---

# Business Cell APIs

---

## Create Business Cell

Normally internal.

```http
POST /business-cells
```

---

## Retrieve Business Cell

```http
GET /business-cells/{id}
```

---

## List Business Cells

```http
GET /business-cells
```

Supports:

- country
- member
- status
- creation date

---

## Matrix Position

```http
GET /business-cells/{id}/position
```

---

## Genealogy

```http
GET /business-cells/{id}/genealogy
```

---

# Reward APIs

---

## Reward Balance

```http
GET /reward-points
```

---

## Reward History

```http
GET /reward-points/history
```

---

## Reward Distribution

Internal API

```http
POST /reward-distributions
```

---

# Wallet APIs

---

## Wallet Summary

```http
GET /wallet
```

---

## Wallet Transactions

```http
GET /wallet/transactions
```

---

## Withdrawal

```http
POST /wallet/withdrawals
```

---

## Withdrawal Status

```http
GET /wallet/withdrawals/{id}
```

---

# Ledger APIs

Ledger entries are read-only.

```http
GET /ledger
```

---

## Ledger Entry

```http
GET /ledger/{id}
```

---

# Country APIs

```http
GET /countries
```

```http
GET /countries/{id}
```

```http
GET /countries/{id}/configuration
```

---

# Matrix APIs

Retrieve matrix statistics.

```http
GET /matrix
```

```http
GET /matrix/statistics
```

```http
GET /matrix/genealogy
```

---

# Reporting APIs

```http
GET /reports
```

```http
POST /reports
```

```http
GET /reports/{id}
```

---

# Notification APIs

```http
GET /notifications
```

```http
POST /notifications/read
```

---

# Audit APIs

```http
GET /audit
```

```http
GET /audit/{id}
```

---

# Administration APIs

```http
GET /admin/dashboard
```

```http
GET /admin/statistics
```

```http
GET /admin/system-health
```

---

# Configuration APIs

```http
GET /configuration
```

```http
PUT /configuration
```

```http
POST /configuration/validate
```

---

# AI APIs

```http
POST /ai/chat
```

```http
GET /ai/recommendations
```

```http
POST /ai/feedback
```

---

# Monitoring APIs

```http
GET /metrics
```

```http
GET /alerts
```

```http
GET /incidents
```

---

# Event APIs

```http
GET /events
```

```http
GET /events/{id}
```

Read-only.

---

# Health APIs

```http
GET /health
```

```http
GET /ready
```

```http
GET /live
```

---

# Webhooks

Supported webhook events include:

- MemberRegistered
- BusinessCellCreated
- RewardDistributed
- WalletCredited
- WithdrawalCompleted
- CountryChanged
- ConfigurationChanged

Example payload

```json
{
  "event":"BusinessCellCreated",
  "timestamp":"..."
}
```

---

# Validation Rules

Every endpoint validates:

- authentication
- authorization
- request schema
- business rules
- country
- permissions
- rate limits

---

# API Security

Security features include:

- HTTPS only
- JWT validation
- OAuth scopes
- API throttling
- replay protection
- request signing
- IP allowlists (optional)
- WAF protection

---

# Event Publication

Successful write operations publish domain events.

Example

```text
POST

↓

Aggregate Updated

↓

Commit

↓

Publish Event
```

---

# Audit Logging

Every write request records:

- user
- timestamp
- IP
- request
- response status
- correlation ID

---

# Async APIs

Long-running processes return:

```http
202 Accepted
```

Follow-up:

```http
GET /jobs/{id}
```

---

# File Uploads

Supported:

```http
multipart/form-data
```

Maximum size determined by platform configuration.

---

# Localization

Supported header:

```http
Accept-Language
```

Example:

```text
en-US

fr-CA

fil-PH
```

---

# API Naming Conventions

Resources

```text
Plural

members

wallets

countries
```

Actions

```text
POST

PUT

PATCH

DELETE
```

Avoid verbs in endpoint names whenever practical.

---

# OpenAPI Support

Every endpoint should be documented using:

- OpenAPI 3.x
- Swagger UI
- JSON Schema
- Example payloads

---

# API Lifecycle

```text
Design

↓

Review

↓

Implementation

↓

Testing

↓

Documentation

↓

Release

↓

Monitoring

↓

Deprecation

↓

Retirement
```

---

# Performance Guidelines

API targets:

| Metric | Target |
|---------|--------|
| Authentication | <250 ms |
| Read Requests | <300 ms |
| Write Requests | <500 ms |
| Search | <750 ms |
| Reports | Async |
| Bulk Operations | Async |

---

# Best Practices

- Keep APIs resource-oriented.
- Version breaking changes.
- Require authentication by default.
- Use idempotency for financial operations.
- Validate every request.
- Publish domain events after successful transactions.
- Correlate all requests with a Correlation ID.
- Return consistent response structures.
- Document every endpoint using OpenAPI.
- Monitor API performance continuously.

---

# Related Documents

- 001-glossary.md
- 002-configuration-reference.md
- 003-country-examples.md
- 004-example-scenarios.md
- 005-sequence-diagrams.md
- 006-state-diagrams.md
- 007-database-schema.md
- 009-business-rules-reference.md

---

# Summary

The API Reference establishes the standardized interface for interacting with the AsBeez Beehive Matrix. Through consistent RESTful design, strong authentication and authorization, immutable financial processing, event-driven workflows, comprehensive auditing, and scalable integration patterns, the API enables secure and reliable communication between clients, internal services, AI systems, and external partners while preserving the platform's core architectural principles of determinism, replayability, and enterprise-grade governance.