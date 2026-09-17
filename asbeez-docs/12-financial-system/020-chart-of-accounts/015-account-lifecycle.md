# Account Lifecycle

> **Document:** 12-financial-system/020-chart-of-accounts/015-account-lifecycle.md

---

## States

```text
Draft -> Proposed -> Approved -> Active -> Restricted -> Retired
```

An account may be retired only when it has no unresolved balance, open workflow, or required future posting. Historical reports continue to use the account definition effective at the posting date.

## Transition Rules

- Draft accounts are editable but cannot receive postings.
- Proposed accounts require accounting owner, purpose, class, parent, dimensions, and policy mapping.
- Approved accounts await an effective date and migration or reporting plan.
- Active accounts may receive postings subject to period and dimension controls.
- Restricted accounts accept only explicitly approved correction or settlement activity.
- Retired accounts cannot receive ordinary postings and their number is never reused.

## Versioning

Changes to class, normal balance, posting permission, parent, or reporting mapping require a new account version or successor account. Display-name corrections may be metadata changes with audit evidence.

## Related Documents

- [000-index.md](000-index.md)
- [003-account-hierarchy.md](003-account-hierarchy.md)
- [016-account-governance.md](016-account-governance.md)
- [018-account-dimensions.md](018-account-dimensions.md)
