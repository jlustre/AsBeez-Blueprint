# Authentication

> **Document:** 12-financial-system/310-api/002-authentication.md

---

## Purpose

Authentication establishes the identity of members, customers, vendors, partners, operators, services, providers, and administrators calling financial APIs.

## Requirements

Use approved identity providers, short-lived access tokens, refresh-token rotation, MFA or step-up authentication for sensitive actions, service identity, key rotation, clock validation, audience/scope validation, and revocation.

## Request Context

Authenticated requests carry subject, actor type, client/application, scopes, legal entity, country, locale, correlation ID, device/risk context where permitted, and authentication strength. Server-side context overrides client-supplied scope.

## Rules

Never place secrets, payment credentials, full account numbers, or sensitive tokens in URLs, logs, errors, or response payloads. Authentication events, failures, impersonation, token use, and step-up decisions are audit-recorded.

## Related Documents

- [000-index.md](000-index.md)
- [003-authorization.md](003-authorization.md)
- [007-error-handling.md](007-error-handling.md)
- [../270-audit-and-internal-controls/001-overview.md](../270-audit-and-internal-controls/001-overview.md)
