# Payments

> **Document:** 12-financial-system/070-payments/000-index.md

---

## Purpose

This section defines payment domain capabilities, including methods, intents, authorization, capture, settlement, failures, retries, partial and split payments, provider integration, routing, reconciliation, security, APIs, events, and AI capabilities.

## Structure

- [001-overview.md](001-overview.md) - Overview
- [002-payment-domain-model.md](002-payment-domain-model.md) - Payment Domain Model
- [003-payment-methods.md](003-payment-methods.md) - Payment Methods
- [004-payment-intents.md](004-payment-intents.md) - Payment Intents
- [005-payment-authorization.md](005-payment-authorization.md) - Payment Authorization
- [006-payment-capture.md](006-payment-capture.md) - Payment Capture
- [007-payment-settlement.md](007-payment-settlement.md) - Payment Settlement
- [008-payment-failures.md](008-payment-failures.md) - Payment Failures
- [009-payment-retries.md](009-payment-retries.md) - Payment Retries
- [010-partial-payments.md](010-partial-payments.md) - Partial Payments
- [011-split-payments.md](011-split-payments.md) - Split Payments
- [012-offline-payments.md](012-offline-payments.md) - Offline Payments
- [013-bank-transfers.md](013-bank-transfers.md) - Bank Transfers
- [014-card-payments.md](014-card-payments.md) - Card Payments
- [015-digital-wallet-payments.md](015-digital-wallet-payments.md) - Digital Wallet Payments
- [016-payment-provider-integration.md](016-payment-provider-integration.md) - Payment Provider Integration
- [017-payment-routing.md](017-payment-routing.md) - Payment Routing
- [018-payment-reconciliation.md](018-payment-reconciliation.md) - Payment Reconciliation
- [019-payment-security.md](019-payment-security.md) - Payment Security
- [020-payment-api.md](020-payment-api.md) - Payment API
- [021-payment-events.md](021-payment-events.md) - Payment Events
- [022-payment-ai-capabilities.md](022-payment-ai-capabilities.md) - Payment AI Capabilities
- [023-future-roadmap.md](023-future-roadmap.md) - Future Roadmap

## Design Authority

Payments owns customer funding state and provider interaction. Orders own commercial completion, Tax owns tax assessment, Settlement owns vendor/partner obligations, Reward Finance owns reward financial treatment, Wallets own balance availability, and the General Ledger owns posted monetary accounting. Payment capture is an input to these workflows, not a substitute for them.

## Implementation Sequence

1. Approve countries, entities, currencies, payment methods, providers, and compliance requirements.
2. Implement typed intents, attempts, authorization, capture, refund, dispute, and settlement states.
3. Add provider adapters, idempotency, webhook verification, retries, and secure token handling.
4. Connect customer/order, tax, vendor/partner, reward, wallet, subledger, and GL mappings.
5. Implement reconciliation, exception aging, APIs, events, reporting, and governed AI assistance.
