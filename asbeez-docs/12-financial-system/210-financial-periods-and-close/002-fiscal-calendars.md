# Fiscal Calendars

> **Document:** 12-financial-system/210-financial-periods-and-close/002-fiscal-calendars.md

---

## Purpose

Fiscal calendars define financial years, quarters, months, weeks, adjustment periods, holidays, and close deadlines for AsBeez entities and reporting scopes.

## Required Data

Calendar ID, entity/country scope, timezone, fiscal year start, period boundaries, quarter/year mapping, adjustment periods, close deadlines, status, and effective dates.

## Rules

One entity may use a local statutory calendar and a group management calendar, but mappings are explicit and historical. Calendars cannot overlap ambiguously, and changing a calendar creates a new version without moving posted entries silently.

## Close and Reporting

Calendar definitions drive posting cut-off, tax filing, treasury, budget, revenue, reserve, and management reporting deadlines. Late or cross-calendar entries retain original effective/posting dates and disclose the calendar/period treatment used.

## Related Documents

- [000-index.md](000-index.md)
- [003-accounting-periods.md](003-accounting-periods.md)
- [006-month-end-close.md](006-month-end-close.md)
- [008-year-end-close.md](008-year-end-close.md)
