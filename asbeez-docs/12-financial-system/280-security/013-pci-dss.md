# PCI DSS

> **Document:** 12-financial-system/280-security/013-pci-dss.md

---

## Purpose

PCI DSS controls protect payment card data and reduce AsBeez card-data scope through provider tokenization, secure integrations, access control, monitoring, vulnerability management, incident response, and evidence.

## Controls

Card-data inventory and flow, scope segmentation, tokenization, secure configurations, provider responsibility, access restriction, MFA, logging, vulnerability testing, change control, retention, staff requirements, and incident response.

## Rules

AsBeez does not store raw card credentials where provider tokenization can be used. PCI scope, responsibility matrix, attestations, exceptions, tests, and provider evidence are maintained by version and environment.

## Evidence

Maintain card-data-flow maps, provider attestations, segmentation tests, vulnerability results, access reviews, change records, incident evidence, staff controls, and remediation status.

## Related Documents

- [000-index.md](000-index.md)
- [010-tokenization.md](010-tokenization.md)
- [014-api-security.md](014-api-security.md)
- [017-incident-response.md](017-incident-response.md)
