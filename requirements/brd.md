# TradeBook AR Ledger

## Business Requirements Document (BRD)

**Project Name:** TradeBook AR Ledger  
**Project Type:** Hackathon Project  
**Business Domain:** Financial Operations and Accounts Receivable  
**Document Status:** Hackathon Submission

## 1. Executive Summary

TradeBook AR Ledger is a browser-based financial management prototype designed to improve how businesses monitor and manage amounts owed by their customers.

For businesses that sell on credit, outstanding invoices represent expected revenue but can also create cash-flow uncertainty. Delayed payments, incomplete records, inconsistent credit controls, and limited visibility into customer payment behavior can make receivables management difficult.

TradeBook brings essential receivables workflows into a single interface, combining customer records, invoice tracking, payment allocation, overdue monitoring, collection reminders, estimated collection dates, aging analysis, and ledger reconciliation.

The business objective is to demonstrate a practical tool that helps users understand outstanding debt, identify collection priorities, and review related financial records.

## 2. Business Background

Many small businesses and growing enterprises manage customer credit using spreadsheets, paper-based records, or multiple disconnected applications.

As transaction volumes increase, it becomes harder to answer important questions:

- How much money do customers currently owe?
- Which invoices are overdue?
- Which customers are approaching or exceeding their credit limits?
- How have customers paid in the past?
- What collections might be expected in the coming weeks?
- Do the receivables records agree with the control account?
- Can important account activities be reviewed afterward?

TradeBook is designed around these practical business questions.

## 3. Business Problem

The primary problem is limited visibility and coordination across the accounts receivable process.

When customer balances, payment records, collection activities, and financial reports are managed separately, businesses may struggle to prioritize collection efforts and maintain consistent financial information.

The project addresses this problem by consolidating relevant records and calculations in one application.

## 4. Business Objectives

### BO-01: Improve Receivables Visibility

Provide a dashboard showing total receivables, overdue balances, disputed amounts, and customer exposure.

### BO-02: Improve Payment Tracking

Make invoices, receipts, payment allocations, and outstanding balances easier to review.

### BO-03: Support Credit Control

Provide configurable credit limits and warnings or restrictions for selected customer conditions.

### BO-04: Improve Collection Planning

Identify invoices requiring reminders and estimate expected collection dates using recorded payment behavior.

### BO-05: Support Financial Review

Provide receivables aging, provision estimates, ledger summaries, and reconciliation indicators.

### BO-06: Improve Activity Traceability

Maintain a local record of selected activities and provide an integrity-verification demonstration.

### BO-07: Reduce Manual Administrative Effort

Bring key receivables workflows into one interface and support reusable exports and backups.

## 5. Stakeholders

### Primary Stakeholders

**Business Owners**

Need a clear view of customer debt, overdue accounts, and expected cash collections.

**Accounts Receivable Personnel**

Need to create customer records, post transactions, allocate payments, and monitor balances.

**Credit Controllers**

Need to monitor credit exposure and identify customers who require attention.

**Finance Personnel**

Need to review aging reports, provisions, ledger entries, and reconciliation differences.

### Secondary Stakeholders

**Hackathon Judges**

Need to understand the business problem, the proposed solution, its implementation, and its practical value.

**Potential Future Integrators**

May evaluate how the product could connect to databases, payment services, accounting platforms, or other business systems.

These stakeholders describe the intended audience and future interests; the current application does not provide separate user accounts for them.

## 6. Business Requirements

| ID    | Business Requirement                                   | Expected Benefit                                               |
| ----- | ------------------------------------------------------ | -------------------------------------------------------------- |
| BR-01 | Centralize customer receivables records.               | Easier access to customer balances and transaction history.    |
| BR-02 | Track invoices and payments.                           | Better visibility into outstanding debt.                       |
| BR-03 | Allocate payments to invoices.                         | More accurate tracking of partially and fully paid invoices.   |
| BR-04 | Monitor customer credit limits.                        | Earlier visibility into excessive credit exposure.             |
| BR-05 | Identify overdue receivables.                          | Better prioritization of collection activities.                |
| BR-06 | Produce receivables aging summaries.                   | Clearer understanding of the age profile of debt.              |
| BR-07 | Estimate collection dates.                             | Better-informed short-term cash planning.                      |
| BR-08 | Estimate bad-debt provisions.                          | Greater visibility into potential receivables risk.            |
| BR-09 | Review ledger balances and reconciliation differences. | Easier identification of inconsistencies in financial records. |
| BR-10 | Maintain an activity trail.                            | Improved traceability of selected operations.                  |
| BR-11 | Export financial data and download backups.            | Easier analysis and local data preservation.                   |
| BR-12 | Support multiple currencies.                           | Better handling of customers billed in different currencies.   |

## 7. Business Process Overview

### Process 1: Customer Setup

1. The user opens the Customers section.
2. The user enters the customer's name and relevant account details.
3. The application generates a customer ID.
4. The user configures the customer's currency and credit limit.
5. The customer becomes available for transaction posting.

### Process 2: Invoice Posting

1. The user opens Post Entry.
2. The user selects the invoice transaction type.
3. The user selects a customer.
4. The user enters the transaction date, due date, description, amount, and exchange rate.
5. The application checks applicable credit restrictions.
6. The application records the transaction and associated ledger entries.
7. The transaction receives a reference and appears in the relevant views.

### Process 3: Payment Recording

1. The user selects the receipt or payment transaction type.
2. The user selects the relevant customer.
3. The user enters the payment amount and transaction details.
4. The user allocates the amount to outstanding invoices manually or through the oldest-first helper.
5. The application records the transaction and updates the resulting balances.

### Process 4: Receivables Monitoring

1. The user reviews the dashboard.
2. The user identifies overdue balances and credit-limit warnings.
3. The user opens the aging report for more detail.
4. The user reviews customer balances and relevant invoice records.
5. The user determines which accounts require follow-up.

### Process 5: Collection Follow-Up

1. The user opens the Collections section.
2. The application identifies invoices eligible for reminder stages.
3. The user selects an available notice action.
4. The application records the notice action and opens an email draft.
5. The user reviews and sends the email through their email application.

The application does not independently confirm email delivery.

### Process 6: Financial Review

1. The user opens the General Ledger section.
2. The user reviews debit and credit totals.
3. The user inspects the receivables reconciliation indicator.
4. The user investigates any reported differences.
5. The user exports the ledger if additional analysis is required.

## 8. Business Rules

### BRULE-01: Customer Identification

Each new customer receives a generated customer identifier.

### BRULE-02: Transaction References

Posted transactions receive generated references based on their transaction type.

### BRULE-03: Payment Allocation

Payment allocations must not exceed the transaction amount or the outstanding balance of an invoice under the implemented validation rules.

### BRULE-04: Credit Limits

A hard credit limit blocks invoice posting when the applicable limit would be exceeded. A soft limit requires confirmation before the user proceeds with an override.

### BRULE-05: Restricted Customers

Invoice posting is blocked for customers whose status is set to collections or written off.

### BRULE-06: Disputed Invoices

Invoices marked as disputed are excluded from the standard collection reminder queue.

### BRULE-07: Provisioning

Bad-debt provision estimates are calculated from configured percentages applied to aging balances.

### BRULE-08: Exchange Rates

Exchange rates are user-configured. Rates are recorded with posted transactions rather than automatically refreshed from an external service.

### BRULE-09: Audit Verification

The audit verification function checks the locally stored hash chain for inconsistencies. It does not establish that the records are protected against every form of modification.

### BRULE-10: Data Persistence

Application data is stored locally in the browser. Clearing browser storage may remove that data.

## 9. Business Benefits

### Improved Financial Visibility

The dashboard and aging views provide a consolidated picture of outstanding customer balances.

### More Organized Collection Activities

Staged reminders and expected payment estimates help users decide which accounts to review first.

### Better Credit Awareness

Credit-limit indicators help identify customers with elevated exposure.

### More Accessible Financial Review

Ledger summaries, reconciliation indicators, CSV exports, and transaction details support review and investigation.

### Increased Traceability

The local audit trail provides a reviewable history of selected activities.

### Reduced Fragmentation

The prototype demonstrates how multiple receivables tasks can be performed through one interface rather than separate spreadsheets and records.

These are intended business benefits. Actual financial improvement would need to be measured through real-world usage.

## 10. Business Success Criteria

The project can be evaluated using the following criteria:

- Customer records can be created and retrieved.
- Posted transactions appear in the ledger.
- Outstanding balances reflect tested payment allocations.
- Credit-limit rules behave as expected.
- Overdue invoices are visible in the dashboard and aging views.
- Collection notices are generated for eligible invoices.
- Collection estimates are displayed with appropriate confidence labels.
- Ledger summaries and reconciliation differences can be inspected.
- The user can export ledger data and download a backup.
- The audit verification function reports the status of the stored chain.

Future business evaluation could also measure days sales outstanding, overdue receivables as a percentage of total receivables, average collection time, and the proportion of invoices paid on time.

## 11. Business Risks

| Risk                                   | Business Impact                         | Proposed Response                                                                           |
| -------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| Inaccurate transaction entry           | Incorrect balances and reports.         | Validate input and test calculations.                                                       |
| Incorrect exchange rates               | Misleading base-currency figures.       | Make exchange-rate sources and assumptions explicit.                                        |
| Loss of local browser data             | Loss of access to recorded information. | Encourage backups and plan reliable cloud storage.                                          |
| Incorrect forecasting assumptions      | Poor collection planning.               | Present forecasts as estimates and improve them with validated history.                     |
| Unauthorized access to a shared device | Exposure of financial information.      | Introduce authentication, permissions, and stronger storage controls before production use. |
| Client-side audit manipulation         | Reduced trust in the activity history.  | Plan server-side logging and independent verification.                                      |

## 12. Business Constraints

- The current application uses browser-based storage.
- There is no centralized business database.
- There are no separate authenticated user roles.
- Exchange rates are manually configured.
- Collection email actions depend on an external email application.
- The prototype is not a replacement for professional accounting review or statutory reporting systems.

## 13. Future Business Opportunities

Potential future business capabilities include:

- Subscription-based access for businesses.
- Multi-company account management.
- Team access and permission controls.
- Cloud-based financial data synchronization.
- Automated email and messaging integrations.
- Bank and payment provider integrations.
- More advanced collection analytics.
- PDF customer statements and invoices.
- Integration with existing accounting systems.

These are possible product opportunities, not current features or confirmed commercial commitments.

## 14. Conclusion

TradeBook AR Ledger is a practical demonstration of how a browser-based application can organize customer receivables and provide actionable financial visibility.

By bringing together invoice tracking, payment allocation, credit monitoring, aging analysis, collections workflows, forecasting, and ledger review, the project addresses a recognizable business problem through a unified workflow.

The hackathon prototype establishes a foundation for future development toward a secure, scalable, and collaborative receivables management product.
