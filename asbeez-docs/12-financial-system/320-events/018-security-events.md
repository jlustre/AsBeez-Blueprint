# Security Events

> **Document:** 12-financial-system/320-events/018-security-events.md

---

## Purpose

Security events communicate authentication, authorization, token, key, secret, access, anomaly, incident, data, and control changes affecting financial operations.

## Event Catalog

`AuthenticationSucceeded`, `AuthenticationFailed`, `MFAChallenged`, `AuthorizationDenied`, `PrivilegedAccessGranted`, `TokenRevoked`, `KeyRotated`, `SecretAccessed`, `SuspiciousActivityDetected`, `SecurityIncidentOpened`, and `SecurityIncidentClosed`.

## Payload and Rules

Events include actor/service, resource, action, authentication strength, decision, source/device/network context where permitted, policy, correlation, timestamp, incident, and remediation reference. Secrets, credentials, full payment data, and sensitive detection logic are never placed in events. Security events are append-only, tamper-evident, retained, monitored, and linked to audit evidence.

## Related Documents

- [000-index.md](000-index.md)
- [002-event-contracts.md](002-event-contracts.md)
- [017-compliance-events.md](017-compliance-events.md)
- [../300-data-model/017-audit-schema.md](../300-data-model/017-audit-schema.md)
