# AI Search

## Purpose

AI Search retrieves relevant documents, records, policies, events, reports, knowledge articles, and authorized operational evidence for users and workflows.

## Search Controls

Enforce identity, tenant, role, entity/country, resource, classification, legal hold, retention, and purpose scope before retrieval. Return source, version, timestamp, confidence, access basis, freshness, and limitations. Search results are evidence, not authoritative decisions.

## Rules

Do not index or expose secrets, full payment credentials, unnecessary identity data, restricted compliance/risk material, or records outside scope. Results cannot be used to bypass authorization or directly mutate financial state. Index changes, deletions, legal holds, and ranking behavior are auditable.

## Related Documents

- [000-index.md](000-index.md)
- [014-rag-knowledge-base.md](014-rag-knowledge-base.md)
- [010-ai-governance.md](010-ai-governance.md)
- [../../12-financial-system/330-ai-capabilities/017-natural-language-query.md](../../12-financial-system/330-ai-capabilities/017-natural-language-query.md)

