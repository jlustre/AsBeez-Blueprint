# Audit Domain Model

> **Document:** 12-financial-system/270-audit-and-internal-controls/002-audit-domain-model.md

---

## Purpose

The Audit domain models controls, control objectives, evidence, tests, findings, exceptions, remediation, audit requests, reports, and approvals.

## Entities

| Entity | Responsibility |
| --- | --- |
| Control | preventive, detective, or corrective safeguard |
| Control Objective | risk and expected outcome |
| Evidence | immutable proof of operation or decision |
| Test | design/operating effectiveness assessment |
| Finding | deficiency, severity, impact, and root cause |
| Remediation | corrective action, owner, due date, and validation |
| Audit Request | scoped evidence request and response |
| Audit Report | conclusion, limitations, findings, and certification |

## Invariants

- every control maps to risk, owner, frequency, procedure, evidence, and test;
- evidence retains source, time, actor, version, integrity, and access classification;
- findings have owner, severity, due date, remediation, retest, and closure approval; and
- audit cannot edit source or posted financial records.

## Related Documents

- [000-index.md](000-index.md)
- [004-control-framework.md](004-control-framework.md)
- [013-control-testing.md](013-control-testing.md)
- [016-remediation.md](016-remediation.md)
