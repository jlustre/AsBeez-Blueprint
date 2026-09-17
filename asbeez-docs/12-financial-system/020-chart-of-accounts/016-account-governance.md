# Account Governance

> **Document:** 12-financial-system/020-chart-of-accounts/016-account-governance.md

---

## Ownership

Finance owns the chart of accounts. Accounting approves economic classification. Legal and Tax approve jurisdiction-sensitive treatment. Engineering implements the approved model and cannot create production posting accounts through an ungoverned migration.

## Required Account Metadata

Every account requires code, name, class, normal balance, parent, posting status, legal entity scope, currency policy, reporting mappings, owner, effective dates, and creation/change evidence.

## Change Process

1. Submit a documented business need and proposed account treatment.
2. Check for an existing account or reporting dimension before adding a new account.
3. Obtain accounting, tax/legal, and reporting approvals where applicable.
4. Define migration, opening balance, integration, and rollback handling.
5. Publish the versioned account definition and effective date.
6. Monitor first postings and reconcile reports after release.

## Controls

Segregate request, approval, implementation, and posting responsibilities. Production changes are auditable, reversible through successor definitions or compensating entries, and included in period-close review.

## Related Documents

- [000-index.md](000-index.md)
- [004-account-numbering.md](004-account-numbering.md)
- [015-account-lifecycle.md](015-account-lifecycle.md)
- [018-account-dimensions.md](018-account-dimensions.md)
