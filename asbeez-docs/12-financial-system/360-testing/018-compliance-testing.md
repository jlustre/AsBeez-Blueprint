# Compliance Testing

> **Document:** 12-financial-system/360-testing/018-compliance-testing.md

---

## Purpose

Compliance tests verify accounting policy, tax, AML/KYC/KYB, sanctions, source of funds, privacy, retention, legal hold, country/entity, approval, audit, and reporting controls.

## Required Cases

Test jurisdiction and registration, tax calculation/withholding/exemption, sanctions result and rescreening, KYC/KYB expiry, source-of-funds hold, approval thresholds, separation of duties, retention/deletion/legal hold, data residency, report lineage, audit access, incident notification, and policy/version changes.

## Assertions

Provider evidence is distinct from authorized decision; AI is advisory; restricted actions remain held pending review; tax collected/withheld is not revenue; historical evidence is not overwritten; and every exception, appeal, approval, and remediation is auditable.

## Related Documents

- [000-index.md](000-index.md)
- [017-security-testing.md](017-security-testing.md)
- [011-financial-close-testing.md](011-financial-close-testing.md)
- [../260-compliance-and-governance/000-index.md](../260-compliance-and-governance/000-index.md)
