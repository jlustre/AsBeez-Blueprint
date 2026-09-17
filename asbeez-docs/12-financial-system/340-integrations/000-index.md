# Integrations

> **Document:** 12-financial-system/340-integrations/000-index.md

---

## Purpose

This section defines Financial System integrations with payment gateways, banking, payout providers, tax and FX providers, accounting platforms, ERP, BI, fraud and KYC/AML providers, notifications, data warehouse, and webhooks.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-payment-gateways.md](002-payment-gateways.md) - Payment Gateways
- [003-banking-integrations.md](003-banking-integrations.md) - Banking Integrations
- [004-payout-providers.md](004-payout-providers.md) - Payout Providers
- [005-tax-providers.md](005-tax-providers.md) - Tax Providers
- [006-fx-rate-providers.md](006-fx-rate-providers.md) - FX Rate Providers
- [007-accounting-platforms.md](007-accounting-platforms.md) - Accounting Platforms
- [008-erp-systems.md](008-erp-systems.md) - ERP Systems
- [009-business-intelligence.md](009-business-intelligence.md) - Business Intelligence
- [010-fraud-providers.md](010-fraud-providers.md) - Fraud Providers
- [011-kyc-aml-providers.md](011-kyc-aml-providers.md) - KYC AML Providers
- [012-notification-systems.md](012-notification-systems.md) - Notification Systems
- [013-data-warehouse.md](013-data-warehouse.md) - Data Warehouse
- [014-webhooks.md](014-webhooks.md) - Webhooks
- [015-integration-security.md](015-integration-security.md) - Integration Security
- [016-integration-monitoring.md](016-integration-monitoring.md) - Integration Monitoring
- [017-future-roadmap.md](017-future-roadmap.md) - Future Roadmap

## Design Authority

Financial Integration Architecture owns adapter boundaries, canonical mappings, provider capabilities, credentials, transport, callbacks, retries, evidence, reconciliation, monitoring, security, portability, and exit plans. Domain owners retain financial meaning; the General Ledger remains authoritative for posted monetary effects.

## Integration Authority

External providers, banks, ERPs, warehouses, and BI systems provide evidence or approved data exchange; they do not directly write AsBeez financial truth. Every integration is scoped by entity/country/currency, versioned, idempotent, observable, access-controlled, and reconciled where it can affect money, liability, tax, or reporting.

## Implementation Sequence

1. Establish adapter, capability, mapping, credential, security, callback, evidence, idempotency, retry, and monitoring standards.
2. Implement payment, banking, payout, tax, and FX provider integrations.
3. Implement accounting, ERP, BI, fraud, KYC/AML, notification, warehouse, and webhook integrations.
4. Add provider routing/failover, contract tests, settlement imports, reconciliation, incident response, and portability controls.
5. Validate outage, unknown outcome, duplicate, schema drift, security, residency, recovery, and financial-control scenarios.

## Related Documents

- [001-overview.md](001-overview.md)
- [002-payment-gateways.md](002-payment-gateways.md)
- [014-webhooks.md](014-webhooks.md)
- [015-integration-security.md](015-integration-security.md)
- [016-integration-monitoring.md](016-integration-monitoring.md)
- [../290-architecture/008-outbox-pattern.md](../290-architecture/008-outbox-pattern.md)
- [../320-events/002-event-contracts.md](../320-events/002-event-contracts.md)
