# Account Hierarchy

## Purpose

The hierarchy supports aggregation from detailed posting accounts to financial statements without changing the meaning of posted history.

## Levels

```text
Class
  -> Category
	  -> Account Family
		  -> Posting Account
			  -> Reporting Dimensions
```

Class and category are structural. Account family groups related economic meanings. Posting accounts accept journal lines; non-posting headers exist only for aggregation.

## Rules

- A posting account has exactly one active parent at a time.
- A non-posting account cannot receive journal lines.
- Parent totals equal the sum of active child accounts for the same reporting slice.
- Moving an account changes future reporting structure only; historical reports retain the original hierarchy version.
- The hierarchy must not encode customer, vendor, country, or product identity that belongs in dimensions.

## Example

```text
Liabilities
  -> Participant Payables
	  -> Vendor Payables
		  -> Vendor Settlement Payable
	  -> Tax Payables
		  -> Sales Tax Payable
```

## Related Documents

- [004-account-numbering.md](004-account-numbering.md)
- [015-account-lifecycle.md](015-account-lifecycle.md)
- [018-account-dimensions.md](018-account-dimensions.md)
