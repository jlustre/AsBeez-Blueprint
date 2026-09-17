# Invoice Delivery

> **Document:** 12-financial-system/090-invoicing/013-invoice-delivery.md

---

## Purpose

Invoice delivery sends an issued invoice or note through an approved channel and preserves evidence of recipient, content version, attempt, and outcome.

## Channels

- authenticated member/customer portal;
- verified email or electronic delivery;
- approved partner/vendor integration;
- tax or government submission channel; and
- controlled download or print workflow where permitted.

## Rules

Delivery does not change invoice payment status or prove receipt unless the applicable channel provides valid evidence. Content is rendered from the issued immutable version, localized for country/currency/language, and does not expose payment credentials or unnecessary personal data.

## Failures

Bounces, invalid destinations, provider failures, duplicate delivery, and recipient disputes are recorded and retried or escalated without changing invoice content or number.

## Related Documents

- [000-index.md](000-index.md)
- [005-invoice-generation.md](005-invoice-generation.md)
- [015-invoice-localization.md](015-invoice-localization.md)
- [016-invoice-compliance.md](016-invoice-compliance.md)
