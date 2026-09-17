# Chart of Accounts Overview

## Purpose

The chart of accounts (CoA) is the controlled vocabulary for classifying posted financial activity. It defines account identity, normal balance, reporting role, ownership, and permitted use; it is not a substitute for the general ledger or subledger.

## Design Principles

- Use one canonical account definition per economic meaning.
- Keep account codes stable after posting; retire rather than reuse them.
- Separate account classification from reporting dimensions.
- Require balanced double-entry postings for every financial effect.
- Allow jurisdiction and entity configuration without creating uncontrolled local variants.
- Keep operational balances and reward units distinct from monetary accounts.

## Scope

This folder defines account classes, hierarchy, numbering, account families, clearing and suspense treatment, country and currency handling, lifecycle, and governance. Posting rules belong to the General Ledger; detailed transaction ownership belongs to the relevant financial bounded context.

## Related Documents

- [002-account-classification.md](002-account-classification.md)
- [004-account-numbering.md](004-account-numbering.md)
- [018-account-dimensions.md](018-account-dimensions.md)
- [016-account-governance.md](016-account-governance.md)
