# TradeBook AR Ledger

## Product Requirements Document (PRD)

**Product Name:** TradeBook AR Ledger  
**Product Category:** Financial Management / Accounts Receivable  
**Project Type:** Hackathon Project  
**Platform:** Responsive Web Application  
**Status:** Working Prototype

## 1. Product Overview

TradeBook AR Ledger is a browser-based accounts receivable management application designed to help businesses organize customer debts, track invoices and payments, monitor overdue balances, and improve their visibility into expected cash flow.

Traditional receivables tracking often relies on spreadsheets, paper records, or disconnected accounting tools. These methods can make it difficult to identify overdue invoices, enforce credit limits, monitor collection activities, and maintain reliable financial records.

TradeBook addresses these challenges by bringing essential receivables workflows into one interface. It combines customer management, transaction recording, payment allocation, receivables aging, collection reminders, cash collection forecasting, and ledger reconciliation in a single application.

The project aims to make receivables management more organized, transparent, and actionable, particularly for small businesses and growing enterprises.

## 2. Problem Statement

Businesses that sell products or services on credit need a reliable way to track amounts owed by customers.

Without an organized receivables process, businesses may experience:

- Delayed identification of overdue invoices.
- Difficulty tracking partial payments and outstanding balances.
- Inconsistent enforcement of customer credit limits.
- Limited visibility into customer payment behavior.
- Poor forecasting of expected collections.
- Time-consuming financial reconciliation.
- Inadequate documentation of important account activities.

TradeBook aims to address these problems by consolidating receivables information and providing practical tools for monitoring, recording, and analyzing customer debt.

## 3. Product Vision

To provide businesses with a straightforward receivables management tool that turns customer debt records into clear financial information and actionable collection workflows.

## 4. Product Objectives

1. Centralize customer receivables information.
2. Make invoice balances and payment histories easier to monitor.
3. Identify overdue accounts and potential credit exposure.
4. Support multiple billing currencies and configurable exchange rates.
5. Improve collection planning through payment-history-based estimates.
6. Support financial review through ledger reports and reconciliation indicators.
7. Maintain a traceable record of important application activities.
8. Provide a responsive, accessible interface suitable for everyday business use.

## 5. Target Users

### Small and Medium-Sized Business Owners

Business owners who sell on credit and need to understand how much customers owe.

### Finance and Accounts Receivable Personnel

Staff responsible for invoices, receipts, outstanding balances, and account reconciliation.

### Credit Controllers

Personnel who monitor customer credit exposure, identify overdue accounts, and manage collection activities.

### Business Administrators

Users who configure application settings and review financial summaries.

These groups represent the intended audience. The current prototype does not implement separate authenticated roles or permissions.

## 6. Core Features and Requirements

### 6.1 Dashboard

The dashboard provides a summary of receivables performance.

It displays:

- Total receivables.
- Overdue balances.
- Amounts in dispute.
- Days Sales Outstanding (DSO) estimate.
- Average days to payment.
- Estimated bad-debt provision.
- Receivables reconciliation status.
- Customers with the highest outstanding balances.
- Customers exceeding their credit limits.

**Expected outcome:** Users can quickly understand their receivables position without manually reviewing every transaction.

### 6.2 Customer Management

Users can create and manage customer records.

Customer records include:

- Unique customer ID.
- Customer name.
- Billing currency.
- Credit limit.
- Credit-limit enforcement mode.
- Email address.
- Account status.

Users can also review customer balances, change account status, view statements, adjust credit limits, and initiate supported write-off workflows.

**Expected outcome:** Customer account information is organized and available for receivables operations.

### 6.3 Transaction and Invoice Management

The application supports recording the following transaction types:

- Invoices.
- Receipts or payments.
- Credit notes.
- Debit notes.

Each transaction can include a transaction date, description, amount, currency, exchange rate, customer reference, and applicable due date.

Posted entries receive generated references and are treated as immutable within the normal application workflow. Corrections are intended to be made through adjustment transactions rather than editing the original entry.

**Expected outcome:** Users maintain a consistent transaction history and can inspect individual financial entries.

### 6.4 Payment Allocation

Users can allocate receipts or credits against outstanding invoices for a customer.

The application supports manual allocation and an oldest-invoice-first allocation helper.

It tracks outstanding invoice balances after allocations and allows unapplied amounts to remain on account.

**Expected outcome:** Users can distinguish paid invoices, partially paid invoices, and outstanding customer debt.

### 6.5 Credit Limit Monitoring

Users can configure customer credit limits.

The application supports:

- Soft limits that display a warning and allow an explicitly confirmed override.
- Hard limits that block invoice posting when the configured limit would be exceeded.
- Warnings when customer balances exceed their limits.

Invoices are also blocked for customers marked as being in collections or written off.

**Expected outcome:** Businesses gain visibility into customer credit exposure and can apply basic credit-control rules.

### 6.6 Receivables Aging and Bad-Debt Provisioning

The aging module groups outstanding receivables into configurable reporting buckets:

- 0–30 days.
- 31–60 days.
- 61–90 days.
- Over 90 days.

Users can configure provision percentages for each aging bucket.

The application calculates estimated provisions and supports posting an adjustment to the bad-debt expense and allowance accounts.

**Expected outcome:** Users can identify older receivables and estimate potential bad-debt exposure.

### 6.7 Collections Management

The collections module identifies outstanding invoices that qualify for reminder stages.

Supported stages include:

- Friendly reminder.
- Payment overdue.
- Second notice.
- Final notice.
- Collections warning.

The application generates email drafts containing invoice and customer details. Users can initiate these drafts through their configured email application.

Disputed invoices are excluded from the standard reminder queue.

**Expected outcome:** Collection activities become more consistent and easier to track.

### 6.8 Expected Cash Collection Forecast

TradeBook estimates expected payment dates using invoice due dates and historical payment delays for each customer.

The application groups estimated collections into weekly periods and assigns a confidence label based on the number of historical payment observations.

**Expected outcome:** Users gain an indicative view of future collections.

Forecasts are estimates based on available records and should not be treated as guaranteed cash receipts.

### 6.9 General Ledger and Reconciliation

The application maintains general ledger entries associated with supported transactions.

Users can inspect:

- Account-level debit and credit totals.
- Trial balance information.
- Recent journal lines.
- Accounts receivable control-account reconciliation.
- Debit and credit balance checks.

The interface identifies differences between the customer sub-ledger and the receivables control account.

**Expected outcome:** Users can review the consistency of receivables records and associated accounting entries.

### 6.10 Audit Trail

The application records important activities, including customer creation, transaction posting, settings changes, disputes, credit-limit changes, and collection notices.

Audit entries include timestamps, user labels, action descriptions, references, details, and hash-chain values.

A verification function checks the recorded chain for inconsistencies.

The current implementation uses a browser-side hash-chain mechanism. It is an integrity-checking demonstration, not a substitute for a secure server-side, tamper-resistant audit system.

**Expected outcome:** Users can inspect a history of important actions and detect certain changes to stored audit records.

### 6.11 Settings and Data Management

Users can configure:

- Displayed user name.
- Base currency.
- Exchange rates.
- Aging provision percentages.
- Additional currency codes and exchange rates.

The application also supports downloading a JSON data backup and loading demonstration data.

### 6.12 Ledger Export

Users can export ledger transactions as a CSV file for further analysis in spreadsheet software.

### 6.13 Theme and Responsive Interface

TradeBook supports light and dark themes and uses responsive layouts to accommodate different screen sizes.

## 7. Functional Requirements

| ID    | Requirement                                                                  |
| ----- | ---------------------------------------------------------------------------- |
| FR-01 | The system shall allow users to create customer records.                     |
| FR-02 | The system shall generate references for posted transactions.                |
| FR-03 | The system shall calculate outstanding invoice balances.                     |
| FR-04 | The system shall support payment allocation against invoices.                |
| FR-05 | The system shall enforce configured soft and hard credit-limit rules.        |
| FR-06 | The system shall display receivables aging information.                      |
| FR-07 | The system shall calculate estimated bad-debt provisions.                    |
| FR-08 | The system shall identify invoices eligible for collection reminders.        |
| FR-09 | The system shall estimate future collections from available payment history. |
| FR-10 | The system shall display ledger balances and reconciliation information.     |
| FR-11 | The system shall record and verify its local audit hash chain.               |
| FR-12 | The system shall support configurable currencies and exchange rates.         |
| FR-13 | The system shall export ledger data to CSV.                                  |
| FR-14 | The system shall allow users to download a JSON data backup.                 |
| FR-15 | The system shall preserve supported application data in browser storage.     |

## 8. Non-Functional Requirements

### Usability

The interface should make common receivables tasks understandable, with clear navigation, labels, financial summaries, and status indicators.

### Responsiveness

The interface should adapt to desktop and mobile-sized screens.

### Data Persistence

The prototype should preserve data across browser sessions when browser storage remains available and is not cleared.

### Data Integrity

Transaction posting and payment allocation should maintain internally consistent records under supported workflows.

### Privacy

The prototype should avoid unnecessary transmission of financial data. Data stored in browser storage remains accessible to the browser environment and is not encrypted by this application.

### Performance

Common navigation, calculations, and rendering should remain responsive for typical demonstration datasets.

### Security

The prototype includes output escaping and an audit-integrity demonstration. Production deployment would require stronger authentication, authorization, server-side validation, secure storage, and independent security testing.

## 9. Data and Storage

The current implementation uses browser `localStorage` to persist application state.

The stored data includes customer records, transaction entries, ledger lines, audit records, currency settings, and configuration values.

This approach supports a self-contained demonstration but does not provide server synchronization, multi-user collaboration, or automatic recovery after browser data is deleted.

## 10. Success Metrics

Potential evaluation criteria for the hackathon demonstration include:

- Successful creation and retrieval of customer records.
- Correct calculation of outstanding balances for tested transactions.
- Successful allocation of partial and full payments.
- Correct identification of overdue invoices.
- Successful generation of aging summaries and provision estimates.
- Visibility of credit-limit warnings and hard-limit restrictions.
- Successful ledger CSV export and JSON backup.
- Successful audit-chain verification on an unchanged dataset.
- Clear presentation of receivables information on different screen sizes.

These are proposed evaluation criteria, not measured results.

## 11. Assumptions and Constraints

- Users provide accurate transaction details and exchange rates.
- The current application is intended primarily for demonstration and local use.
- Exchange rates are configurable inputs rather than a live market feed.
- Collection emails require a configured email application.
- Forecast results depend on the quality and volume of recorded payment history.
- Financial calculations should be independently tested before operational use.
- The prototype does not provide authenticated multi-user access or centralized cloud storage.

## 12. Future Enhancements

Potential future improvements include:

- Secure authentication and role-based access control.
- Cloud database and cross-device synchronization.
- Automated email delivery and collection scheduling.
- Live exchange-rate integrations.
- Importing invoices and customers from CSV.
- PDF invoice and customer statement generation.
- Automated tests for accounting calculations.
- Server-side audit logs and stronger integrity controls.
- Improved reporting and export options.
- Automated backups and data recovery.
- Integration with payment providers and accounting systems.

## 13. Conclusion

TradeBook AR Ledger demonstrates how a focused web application can bring together customer debt tracking, credit controls, collection workflows, receivables analysis, and ledger review.

Its primary value is making accounts receivable information easier to organize, interpret, and act upon. The prototype establishes a foundation for a more complete financial operations product while clearly identifying the security, storage, and collaboration capabilities required for production readiness.
