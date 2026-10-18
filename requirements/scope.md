# TradeBook AR Ledger

## Project Scope Document

**Project Name:** TradeBook AR Ledger  
**Project Type:** Hackathon Prototype  
**Platform:** Browser-Based Web Application

## 1. Purpose

This document defines the scope of TradeBook AR Ledger for hackathon development, demonstration, and evaluation.

The project focuses on helping businesses manage customer receivables through a unified browser-based interface.

The scope distinguishes implemented prototype capabilities from features that may be developed in future versions.

## 2. Project Goals

The project aims to:

1. Demonstrate an organized customer receivables workflow.
2. Support invoice and payment tracking.
3. Provide visibility into outstanding and overdue balances.
4. Demonstrate basic credit-control functionality.
5. Generate receivables aging and collection estimates.
6. Present general ledger and reconciliation information.
7. Demonstrate a locally stored audit trail.
8. Provide a responsive interface with configurable display settings.

## 3. In-Scope Features

### 3.1 Dashboard and Financial Overview

- Summary of total receivables.
- Overdue and disputed balances.
- Days Sales Outstanding estimate.
- Average payment delay.
- Bad-debt provision estimate.
- Reconciliation status.
- Top debtor overview.
- Credit-limit warnings.

### 3.2 Customer Management

- Create customer records.
- Assign customer IDs.
- Configure billing currency.
- Configure soft or hard credit limits.
- Record customer email addresses.
- Change customer status.
- View customer statements.
- Access supported write-off workflows.

### 3.3 Receivables Transactions

- Post invoices.
- Record receipts and payments.
- Post credit notes and debit notes.
- Generate transaction references.
- Record transaction dates, descriptions, amounts, and exchange rates.
- Inspect individual transaction details.
- View transaction-associated journal lines.
- Correct supported mistakes through adjustment transactions rather than editing posted entries.

### 3.4 Payment Allocation

- Apply receipts to outstanding invoices.
- Allocate payments manually.
- Allocate payments using the oldest-invoice-first helper.
- Track remaining invoice balances.
- Retain unapplied amounts on customer accounts.

### 3.5 Credit Controls

- Configure customer credit limits.
- Warn when soft limits are exceeded.
- Require confirmation for soft-limit overrides.
- Block invoice posting when hard limits are exceeded.
- Prevent invoice posting for customers in collections or written off.

### 3.6 Aging and Provisioning

- Group receivables into aging categories.
- Calculate balances by customer and aging bucket.
- Configure provision percentages.
- Estimate required bad-debt allowance.
- Post supported provision adjustment journals.

### 3.7 Collections and Forecasting

- Identify invoices eligible for collection notices.
- Generate staged collection reminders.
- Create email drafts through a mail application.
- Record notice actions in the audit trail.
- Estimate expected payment dates.
- Group expected collections by week.
- Display forecast confidence labels.

### 3.8 General Ledger and Reconciliation

- Generate ledger entries for supported transactions.
- Display account-level debit and credit totals.
- Present trial balance information.
- Review recent journal lines.
- Compare the receivables sub-ledger with the control account.
- Indicate reconciliation differences.

### 3.9 Audit and Integrity Demonstration

- Record selected application activities.
- Associate activities with timestamps and user labels.
- Link audit entries using hash values.
- Verify the locally stored hash chain.

### 3.10 Settings and Exports

- Configure the displayed user name.
- Configure base currency and exchange rates.
- Configure provision percentages.
- Add currency codes and rates.
- Export ledger data to CSV.
- Download a JSON backup.
- Load demonstration data.

### 3.11 User Interface

- Responsive layout.
- Light and dark themes.
- Navigation between application modules.
- Transaction detail modal.
- Status indicators and notifications.

## 4. Out-of-Scope Features

The following features are not part of the current implemented prototype scope.

### Authentication and User Administration

- Secure sign-in and registration.
- Password recovery.
- Multi-factor authentication.
- Separate user accounts.
- Role-based access permissions.
- Organization-level account isolation.

### Cloud Infrastructure

- Centralized database.
- Cross-device data synchronization.
- Real-time collaboration.
- Server-side backups.
- Automated disaster recovery.

### Automated External Integrations

- Direct payment processing.
- Automatic bank statement imports.
- Live exchange-rate feeds.
- Guaranteed email delivery.
- SMS and WhatsApp messaging integrations.
- Automatic synchronization with external accounting platforms.

### Advanced Document Processing

- Automated invoice extraction from uploaded files.
- OCR-based receipt processing.
- AI-generated credit-risk assessments.
- PDF invoice generation and advanced document templates.

### Enterprise Financial Operations

- Full statutory financial reporting.
- Tax filing and regulatory submissions.
- Audited accounting outputs.
- Multi-company consolidation.
- Production-grade fraud detection.
- Certified accounting-system integration.

These exclusions describe the current prototype and do not prevent future development.

## 5. Intended Users

- Small business owners.
- Accounts receivable staff.
- Finance personnel.
- Credit controllers.
- Business administrators.

The current prototype presents a single browser-based working context rather than separate authenticated user roles.

## 6. Deliverables

The hackathon project deliverables are:

1. TradeBook AR Ledger web application.
2. Dashboard for receivables monitoring.
3. Customer management interface.
4. Transaction posting and payment allocation workflows.
5. Aging and collection management modules.
6. General ledger and reconciliation interface.
7. Audit-trail integrity demonstration.
8. CSV export and JSON backup functionality.
9. Responsive styling and theme controls.
10. Product Requirements Document (`prd.md`).
11. Project Scope Document (`scope.md`).
12. Business Requirements Document (`brd.md`).
13. A project demonstration and submission description for Devpost.

## 7. Assumptions

- The user runs the application in a compatible modern browser.
- Browser storage is enabled.
- Users enter valid and accurate financial information.
- Exchange rates are supplied by the user.
- Demonstration data may be used during judging.
- Email draft functionality depends on the user's email environment.

## 8. Constraints

### Technical Constraints

- Application data is stored in browser `localStorage`.
- Data is not automatically synchronized across devices.
- Browser data may be lost when storage is cleared.
- The audit hash chain is generated and verified on the client side.
- The application does not include a server-side authentication layer.

### Financial Constraints

- Exchange-rate calculations depend on configured rates.
- Forecasts are estimates rather than guarantees.
- Accounting outputs require testing before use for real financial reporting.

### Hackathon Constraints

- The project prioritizes demonstrating a cohesive workflow over providing a complete enterprise accounting platform.
- Future enhancements should not be represented as existing functionality.

## 9. Dependencies

- A modern web browser with JavaScript enabled.
- Browser storage availability.
- The project's HTML, CSS, and JavaScript files.
- A compatible email application for initiating reminder drafts.

## 10. Acceptance Criteria

The project will be considered demonstrable against its intended scope when:

- A user can add a customer and view the resulting record.
- A user can post a transaction and retrieve its reference.
- Invoice balances respond appropriately to supported payment allocations.
- Credit-limit rules produce the expected warnings or restrictions in tested scenarios.
- Receivables aging and provision estimates are displayed.
- Eligible collection notices appear in the queue.
- Ledger entries and reconciliation indicators can be inspected.
- CSV and JSON exports can be initiated.
- The audit verification function can evaluate the stored chain.
- The main interface can be navigated in both light and dark themes.

Acceptance testing should verify these behaviors with controlled sample data.

## 11. Risks and Mitigations

| Risk                                        | Mitigation                                                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Browser data is deleted                     | Download regular JSON backups.                                                                          |
| Exchange rates are inaccurate               | Make rates configurable and clearly disclose their source.                                              |
| Accounting calculations contain defects     | Test calculations against known examples.                                                               |
| Local audit records are modified            | Explain the limits of client-side integrity checks and plan server-side logging.                        |
| Users assume the prototype is cloud-backed  | Clearly communicate the local-storage design.                                                           |
| Forecasts are treated as guaranteed         | Label forecasts as estimates.                                                                           |
| Sensitive data is stored on a shared device | Avoid production use with confidential financial data until stronger security controls are implemented. |

## 12. Future Scope

Possible later releases may include:

- Authentication and organization accounts.
- Cloud-based persistence.
- Permission-based access.
- Automated email delivery.
- Live exchange-rate integrations.
- PDF statements and invoice documents.
- Bank reconciliation.
- Automated testing and monitoring.
- Stronger audit logging and data recovery.
- Integration with external accounting tools.

## 13. Scope Summary

TradeBook AR Ledger focuses on the core receivables lifecycle: customer setup, transaction posting, payment allocation, credit monitoring, aging analysis, collection planning, and ledger review.

The hackathon deliverable is a functional browser-based prototype intended to demonstrate these workflows. Secure multi-user infrastructure, cloud synchronization, and production-grade financial controls remain outside the current scope.
