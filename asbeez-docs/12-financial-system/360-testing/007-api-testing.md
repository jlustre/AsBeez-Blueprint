# API Testing

> **Document:** 12-financial-system/360-testing/007-api-testing.md

---

## Purpose

API tests verify authentication, authorization, validation, envelopes, amount/currency representation, idempotency, pagination, errors, async status, privacy, rate limits, versioning, and financial command/query boundaries.

## Required Cases

Test authorized and denied roles, entity/country scope, MFA/step-up, malformed and boundary amounts, duplicate/changed idempotency payloads, timeout/unknown state, stale projections, pagination consistency, sensitive-field masking, webhook verification, replay, rate-limit behavior, and backward compatibility.

## Rules

Assert that clients cannot write balances, posted journals, account mappings, provider outcomes, tax decisions, certifications, or period state directly. Effectful commands must produce one safe financial effect or an explicit pending/failed/unknown outcome.

## Related Documents

- [000-index.md](000-index.md)
- [009-contract-testing.md](009-contract-testing.md)
- [012-idempotency-testing.md](012-idempotency-testing.md)
- [../310-api/000-index.md](../310-api/000-index.md)
