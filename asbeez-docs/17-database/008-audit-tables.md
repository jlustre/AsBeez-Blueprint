# Audit Tables

## Purpose

Audit tables preserve tamper-evident evidence of authentication, authorization, configuration, financial actions, approvals, events, integrations, security, compliance, reconciliation, close, reports, and AI decisions.

## Table Groups

`audit_events`, `access_events`, `approval_records`, `configuration_changes`, `policy_acceptances`, `data_access_logs`, `integration_evidence`, `security_incidents`, `compliance_cases`, `reconciliation_evidence`, `report_certifications`, `model/prompt decisions`, and legal-hold/retention references.

## Required Metadata

Actor/service, action, resource/version, before/after hashes or references, source, reason, policy, approval, authentication strength, correlation/causation, entity/country, timestamp, outcome, IP/device context where permitted, retention class, and integrity/hash chain where applicable.

## Rules

Audit records are append-only, access-controlled, privacy-aware, encrypted/tamper-evident, and retained under legal, tax, dispute, security, financial, and country policy. They cannot be edited/deleted to conceal an action. Sensitive values are masked or tokenized while evidence remains usable.

## Related Documents

- [index.md](index.md)
- [007-financial-tables.md](007-financial-tables.md)
- [../12-financial-system/300-data-model/017-audit-schema.md](../12-financial-system/300-data-model/017-audit-schema.md)
- [../12-financial-system/270-audit-and-internal-controls/000-index.md](../12-financial-system/270-audit-and-internal-controls/000-index.md)
