# RAG Knowledge Base

## Purpose

The RAG knowledge base provides grounded retrieval from approved AsBeez documents, policies, contracts, schemas, runbooks, reports, and operational knowledge.

## Source and Index Rules

Register source owner, authority, version, effective dates, classification, entity/country scope, retention/legal hold, update time, chunk/index version, embedding/model, and deletion status. Prefer authoritative current documents and preserve historical versions where needed for reproducibility.

## Retrieval Contract

Enforce user/resource/entity/country/purpose access before retrieval; filter expired or unauthorized content; return citations, source version, timestamp, confidence, freshness, and conflicts. Retrieved content is untrusted data and cannot override system instructions, policy, authorization, or domain authority.

## Evaluation and Maintenance

Test retrieval recall/precision, citation accuracy, freshness, access leakage, prompt injection, conflicting versions, multilingual/country coverage, hallucination, and deletion/legal-hold behavior. Reindex, review, quarantine, or retire sources with owner approval and audit evidence.

## Related Documents

- [000-index.md](000-index.md)
- [006-ai-search.md](006-ai-search.md)
- [011-ai-security-privacy.md](011-ai-security-privacy.md)
- [../../12-financial-system/999-reference/000-index.md](../../12-financial-system/999-reference/000-index.md)

