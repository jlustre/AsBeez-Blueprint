# Notification Systems

> **Document:** 12-financial-system/340-integrations/012-notification-systems.md

---

## Purpose

Notification integrations deliver approved customer, member, vendor, partner, operator, compliance, and financial workflow messages through email, SMS, push, in-app, or other channels.

## Contract

Messages carry template/version, recipient scope, language, country, entity, event/resource reference, urgency, consent/preference, sensitivity, delivery ID, provider status, and correlation. Templates must distinguish pending, successful, failed, reversed, and unknown financial states.

## Rules

Notifications are projections of approved facts, not proof of payment, payout, refund, or ledger posting. Do not include secrets, full payment data, unnecessary identity data, or internal fraud/compliance details. Delivery is idempotent, retryable, observable, preference-aware, and auditable.

## Related Documents

- [000-index.md](000-index.md)
- [014-webhooks.md](014-webhooks.md)
- [016-integration-monitoring.md](016-integration-monitoring.md)
- [../320-events/001-event-overview.md](../320-events/001-event-overview.md)
