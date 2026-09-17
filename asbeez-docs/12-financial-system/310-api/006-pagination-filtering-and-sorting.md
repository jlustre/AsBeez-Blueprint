# Pagination Filtering And Sorting

> **Document:** 12-financial-system/310-api/006-pagination-filtering-and-sorting.md

---

## Purpose

List APIs provide bounded, repeatable, authorized access to statements, transactions, payments, payouts, invoices, events, exceptions, and reports.

## Pagination

Use opaque cursor pagination ordered by stable unique key plus creation/event time. Return cursor, page size, has-next, source/freshness, and snapshot or consistency metadata. Offset pagination is limited to non-authoritative small result sets.

## Filtering and Sorting

Filters are allowlisted by resource and scope. Date ranges, status, currency, entity, country, source, owner, and reference filters are validated server-side. Sorting is deterministic with a unique tie-breaker; clients cannot sort by hidden risk, authorization, or sensitive fields.

## Rules

Pagination never bypasses authorization or exposes another entity/country. Large queries are rate-limited, bounded, asynchronous, or served from certified/read-only projections. Export jobs retain requester, filter, source version, and delivery audit evidence.

## Related Documents

- [000-index.md](000-index.md)
- [003-authorization.md](003-authorization.md)
- [004-request-response-standards.md](004-request-response-standards.md)
- [020-reporting-api.md](020-reporting-api.md)
