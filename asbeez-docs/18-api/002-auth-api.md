# Authentication API

## Purpose

Authentication establishes identity for customers, members, vendors, partners, administrators, operators, services, and approved providers.

## Capabilities

Support registration/login where applicable, MFA/step-up, token issuance/refresh/revocation, service identity, session/device management, password/credential recovery, consent, and authentication event history through approved identity services.

## Request Context

Authenticated context includes subject, actor type, client/application, scopes, roles, entity/country, authentication strength, correlation ID, and risk/device context where permitted. Server-side identity and scope override client-supplied claims.

## Rules

Use short-lived tokens, refresh rotation, audience/scope validation, revocation, key rotation, rate limits, secure recovery, and audit. Never expose secrets, payment credentials, raw identity evidence, or sensitive risk/compliance details. Authentication does not itself authorize a financial action; authorization is re-evaluated at execution.

## Related Documents

- [index.md](index.md)
- [008-admin-api.md](008-admin-api.md)
- [../12-financial-system/310-api/002-authentication.md](../12-financial-system/310-api/002-authentication.md)
- [../14-legal-compliance/006-privacy.md](../14-legal-compliance/006-privacy.md)
