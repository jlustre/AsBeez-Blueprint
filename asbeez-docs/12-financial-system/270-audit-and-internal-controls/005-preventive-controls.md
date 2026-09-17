# Preventive Controls

> **Document:** 12-financial-system/270-audit-and-internal-controls/005-preventive-controls.md

---

## Purpose

Preventive controls stop unauthorized, invalid, incomplete, duplicate, excessive, or noncompliant financial activity before effect.

## Examples

Server-side pricing, account/status validation, period lock, approval matrices, KYC/KYB, sanctions, source-of-funds, limits, idempotency, destination verification, tax registration, reward classification, reserve availability, and separation of duties.

## Evidence

Control outcome, reason, policy/version, actor/system, input scope, timestamp, exception, and approval are retained. Preventive rejection does not delete the attempted request or create an accounting effect.

## Testing

Tests verify control configuration, bypass resistance, failed-control handling, access scope, exception routing, and evidence completeness; failures create findings and remediation.

## Related Documents

- [000-index.md](000-index.md)
- [004-control-framework.md](004-control-framework.md)
- [008-approval-controls.md](008-approval-controls.md)
- [009-access-controls.md](009-access-controls.md)
