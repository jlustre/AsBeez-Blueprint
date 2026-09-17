# Account Numbering

## Purpose

Account numbers provide stable machine and human references. They must be predictable without embedding mutable business facts.

## Recommended Format

```text
CC-FF-SSS
```

`CC` is the primary class, `FF` is the account family, and `SSS` is the posting account sequence. Examples: `11-10-001` cash operating account, `21-20-001` vendor payable, `41-10-001` marketplace fee revenue, `51-30-001` payment processing expense.

## Numbering Rules

- Numbers are unique within a legal entity and chart version.
- Numbers are never reused after posting activity.
- Leading zeroes and fixed width are mandatory.
- Dimensions such as country, currency, vendor, and channel are not appended to the account number.
- Reserved ranges are documented before use.
- Renaming an account requires a new display name or versioned metadata, not historical mutation.

## Account Code and Identity

The immutable account ID is the technical identity. The account number is the controlled business code and may be displayed in reports. Integrations must not infer class from string parsing; they use the account metadata contract.

## Related Documents

- [002-account-classification.md](002-account-classification.md)
- [018-account-dimensions.md](018-account-dimensions.md)
- [016-account-governance.md](016-account-governance.md)
