# FinanceHub — Enterprise Professional Finance Dashboard

A modern, high-performance, responsive full-stack Financial Analytics & Accounting ERP platform built with **React 19 + Vite** on the frontend, **Spring Boot 3.3.4 (Java 17)** on the backend, and **MySQL 8.0** with **Flyway** schema migrations.

---

## 🏛️ System Architecture

```
finance-dashboard/
├── backend/                                   # Spring Boot 3.3.4 (Java 17) REST API
│   ├── pom.xml                                # Maven build with Spring Data JPA, Web, Security, Validation, Flyway
│   └── src/
│       ├── main/
│       │   ├── java/com/finance/dashboard/
│       │   │   ├── FinanceDashboardApplication.java
│       │   │   ├── config/                    # CorsConfig (CORS origin mapping)
│       │   │   ├── security/                  # SecurityConfig (CSRF disabled for REST, stateless HTTP)
│       │   │   ├── common/                    # ApiResponse<T>, GlobalExceptionHandler, ResourceNotFoundException
│       │   │   ├── period/                    # FinancialPeriod (Quarterly/Monthly calendar entities)
│       │   │   ├── dashboard/                 # Summary aggregation, trends, AR/AP overdue, cash balances
│       │   │   └── finance/                   # 16 Finance submodules with Entity, DTO, Repo, Service, Controller
│       │   │       ├── profitloss/            # P&L statement, gross profit, operating & net profit
│       │   │       ├── balancesheet/          # Balance sheet, Accounting Equation (A = L + E), Debt-to-Equity
│       │   │       ├── cashflow/              # Operating, Investing, Financing, Opening & Closing Cash
│       │   │       ├── revenue/               # Inflow streams, customer, product, channel analytics
│       │   │       ├── expenses/              # OPEX ledger, approval workflows, department breakdowns
│       │   │       ├── cogs/                  # Direct materials, labor, direct overheads, unit COGS
│       │   │       ├── grossprofit/           # Gross profit margin %, unit economics contribution
│       │   │       ├── ebitda/                # Operating EBITDA, EBITDA margin %, Period variance bridge
│       │   │       ├── receivables/           # AR aging analysis (0-30, 31-60, 61-90, 90+ days overdue)
│       │   │       ├── payables/              # AP vendor liabilities, upcoming & overdue schedules
│       │   │       ├── gst/                   # GSTIN validation, CGST/SGST vs IGST tax engine
│       │   │       ├── payments/              # Payment gateways (Stripe, Razorpay, Bank Transfer), reconciliations
│       │   │       ├── refunds/               # Reversals ledger, idempotency checks, reason tracking
│       │   │       ├── taxcompliance/         # Statutory filings (GST, TDS, Corporate Tax, Advance Tax)
│       │   │       ├── forecasting/           # Growth models, assumptions, projected vs actual comparisons
│       │   │       └── breakeven/             # Fixed/variable cost thresholds, CM ratios, breakeven volume
│       │   └── resources/
│       │       ├── application.properties     # MySQL connection pool, Flyway config, Hibernate dialect
│       │       └── db/migration/              # Flyway SQL migrations
│       │           ├── V1__create_finance_core_tables.sql
│       │           ├── V2__create_invoice_payment_tables.sql
│       │           └── V3__create_tax_and_forecast_tables.sql
│       └── test/java/com/finance/dashboard/
│           └── FinanceCalculationTests.java   # Automated BigDecimal financial calculation tests
│
├── frontend/                                  # React 19 + Vite 6+ Financial Analytics Client
│   ├── package.json                           # Dependencies: React Router v7, Axios, Lucide React, Recharts
│   ├── vite.config.js                         # Proxy configured for /api to backend (port 5173 -> 8080)
│   ├── index.html                             # Enterprise branding, Inter typography, SEO meta
│   ├── .env.example                           # Sample frontend environment config
│   ├── .env                                   # VITE_API_BASE_URL=http://localhost:8080/api/v1
│   └── src/
│       ├── main.jsx                           # Application bootstrap with global stylesheet imports
│       ├── App.jsx                            # BrowserRouter container
│       ├── routes/
│       │   └── AppRoutes.jsx                  # Route table for Dashboard and all 16 submodules
│       ├── components/
│       │   ├── layout/                        # Sidebar (16 modules in exact order), Topbar, FinanceLayout
│       │   ├── common/                        # MetricCard, DataTable, LoadingState, ErrorState, EmptyState, ExportButton...
│       │   └── charts/                        # FinanceCharts (Area, Bar, Donut, Line, BreakevenCurve)
│       ├── pages/                             # 16 Dedicated module pages + Main Executive Dashboard
│       ├── services/                          # Axios API service client wrappers (17 services)
│       └── styles/                            # Clean, responsive CSS design tokens
│           ├── global.css                     # Design tokens, typography, CSS variables, utility classes
│           ├── sidebar.css                    # Fixed/collapsible navy navigation sidebar
│           ├── dashboard.css                  # KPI metric cards, charts grid, modern executive widgets
│           ├── tables.css                     # Financial ledgers, status badges, typography
│           └── forms.css                      # Modals, inputs, financial calculators, buttons
├── .gitignore
└── README.md
```

---

## 🎯 Exactly 16 Dedicated Finance Submodules

The application sidebar strictly adheres to the requested ordering:

| # | Sidebar Module Name | Route Path | Core Functionality & Features |
|---|---------------------|------------|-------------------------------|
| **0** | **Executive Dashboard** | `/dashboard` | High-level KPIs, Revenue/Expense trends, Cash balance, AR/AP summary, Overdue alerts, Recent transactions. |
| **1** | **Profit & Loss Statement (P&L)** | `/finance/profit-loss` | Revenue, COGS, Gross Profit, OPEX, Operating Profit, Taxes, Net Profit, Period vs Previous period variance. |
| **2** | **Balance Sheet & Capital Structure** | `/finance/balance-sheet` | Current & Non-Current Assets, Liabilities, Equity. Validates Accounting Equation: `Assets = Liabilities + Equity`. |
| **3** | **Cash Flow Statement & Liquidity** | `/finance/cash-flow` | Operating, Investing, and Financing Cash Flows. Calculates `Closing Cash = Opening Cash + Net Movement`. |
| **4** | **Revenue Intelligence & Inflows** | `/finance/revenue` | Inflow breakdown by customer, stream, product, channel, and monthly trajectory charts. |
| **5** | **Operating Expenses (OPEX)** | `/finance/operating-expenses` | Ledger with vendor, date, category, status workflow (Approved, Pending, Rejected), and expense creation modal. |
| **6** | **Cost of Goods Sold (COGS)** | `/finance/cogs` | Direct materials, direct labor, direct production overheads, unit cost calculations. |
| **7** | **Gross Profit & Unit Economics** | `/finance/gross-profit` | Gross profit margin %, Contribution margin per unit, pricing versus variable cost unit metrics. |
| **8** | **Operating EBITDA & Bridge** | `/finance/ebitda` | EBITDA calculation, EBITDA margin %, Waterfall bridge explaining changes between reporting periods. |
| **9** | **Accounts Receivable (AR)** | `/finance/accounts-receivable` | Aging schedules (Current, 1-30, 31-60, 61-90, 90+ days), customer balance tracking, invoice payment recording. |
| **10** | **Accounts Payable (AP)** | `/finance/accounts-payable` | Supplier liability tracking, due dates, outstanding balances, upcoming payout obligations. |
| **11** | **GST Tax Invoices Register** | `/finance/gst-invoices` | Indian GST compliance engine: 15-character GSTIN validator, CGST + SGST vs IGST tax split, taxable invoice generation. |
| **12** | **Payments & Gateway Settlement** | `/finance/payments` | Tracks Stripe, Razorpay, and Bank Wire settlement amounts, gateway transaction fees, and reconciliation states. |
| **13** | **Refunds & Reversals Ledger** | `/finance/refunds` | Reversal requests, approval flows, linked payment reference preservation, non-destructive audit trail. |
| **14** | **Statutory Tax Compliance** | `/finance/tax-compliance` | Filing reminders vs recorded filings for Corporate Tax, TDS, GST-3B, GSTR-1, Advance Tax with reference records. |
| **15** | **Financial Forecasting & Models** | `/finance/forecasting` | Projections for Revenue, OPEX, and Cash Flow with growth assumptions and variance analysis. |
| **16** | **Cost Structure & Breakeven Analysis** | `/finance/breakeven` | Interactive Breakeven calculator: Selling price, variable cost, fixed overheads, CM Ratio %, Breakeven Units & Breakeven Curve chart. |

---

## 🧮 Server-Authoritative Financial Integrity

- **Java BigDecimal**: All persisted financial calculations (Gross Profit, EBITDA, GST taxes, Contribution Margins, Breakeven Volumes, Balances) are computed with `java.math.BigDecimal` and `RoundingMode.HALF_UP` on the Spring Boot backend. JavaScript floating-point arithmetic is never used for persisted accounting figures.
- **Accounting Equation Validation**: The Balance Sheet module rigorously validates `Assets = Liabilities + Equity` and displays an explicit verification seal.
- **Idempotent Actions & Audit Trails**: Creation dates, update dates, and linked references are preserved; transaction histories are not deleted.

---

## 🚀 Quickstart & Development Instructions

### Prerequisites
- **Java**: OpenJDK 17 or higher
- **Node.js**: v18 or higher (v20+ recommended)
- **MySQL**: MySQL Server 8.0 running locally on port `3306`
- **Maven**: Maven 3.8+ (or use installed `mvn`)

### 1. Database Setup
Create the MySQL database:
```sql
CREATE DATABASE IF NOT EXISTS finance_dashboard_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Check `backend/src/main/resources/application.properties` (or override via environment variables):
```properties
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/finance_dashboard_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
```

Flyway will automatically run the migrations on Spring Boot startup:
- `V1__create_finance_core_tables.sql` (Financial periods, Revenue, Expenses, COGS, Balance Sheet items, Cash Flow items)
- `V2__create_invoice_payment_tables.sql` (AR Invoices, AP Bills, Payments, Refunds)
- `V3__create_tax_and_forecast_tables.sql` (GST Tax Invoices, Statutory Compliance, Forecasts, Breakeven models)

### 2. Backend Startup
```bash
cd backend
mvn clean compile
mvn test
mvn spring-boot:run
```
The REST API will start on **`http://localhost:8080`**.
API endpoints are available under the base path **`/api/v1`**.

### 3. Frontend Startup
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📡 Key REST API Endpoints

All endpoints are versioned under `/api/v1`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/dashboard/summary` | Executive dashboard metrics and summaries |
| `GET` | `/api/v1/dashboard/trends` | Monthly revenue, expense, and cash flow trends |
| `GET` | `/api/v1/periods` | List all quarterly and monthly financial periods |
| `GET` | `/api/v1/profit-loss` | P&L statement computed for selected period |
| `GET` | `/api/v1/balance-sheet` | Balance sheet with capital structure & accounting validation |
| `GET` | `/api/v1/cash-flow` | Cash flow statement with operating, investing, and financing items |
| `GET, POST` | `/api/v1/revenue` | Inflow ledger and revenue analytics |
| `GET, POST, PATCH` | `/api/v1/expenses` | OPEX records and approval status management |
| `GET, POST` | `/api/v1/cogs` | Cost of goods sold ledger and category breakdowns |
| `GET` | `/api/v1/gross-profit` | Gross profit analytics and unit economics |
| `GET` | `/api/v1/ebitda` | Operating EBITDA calculation and variance bridge |
| `GET, POST, PATCH` | `/api/v1/receivables` | Accounts receivable invoices and status tracking |
| `GET, POST, PATCH` | `/api/v1/payables` | Accounts payable bills and payment updates |
| `GET, POST` | `/api/v1/gst-invoices` | GST tax invoices register with CGST/SGST/IGST calculation |
| `GET, POST, PATCH` | `/api/v1/payments` | Payment transactions and settlement reconciliation |
| `GET, POST, PATCH` | `/api/v1/refunds` | Refund ledger and reversal processing |
| `GET, POST, PATCH` | `/api/v1/tax-compliance` | Statutory tax compliance records and filing tracker |
| `GET, POST, DELETE` | `/api/v1/forecasts` | Financial forecasting models and actual vs projected comparison |
| `GET, POST, DELETE` | `/api/v1/breakeven` | Cost structure and breakeven unit economics analysis |

---

## 🧪 Automated Testing

Automated tests in `backend/src/test/java/com/finance/dashboard/FinanceCalculationTests.java` verify:
1. **Breakeven Unit Economics**: Contribution Margin and Breakeven production volume calculations with `BigDecimal`.
2. **Indian GST Tax Engine**: Proper 50/50 split of intra-state CGST & SGST and inter-state IGST calculations.
3. **Accounting Equation**: Validation of `Assets = Liabilities + Equity`.

Run tests with:
```bash
cd backend
mvn test
```

---

## 🎨 Enterprise UI & Accessibility Features
- **Visual Design**: Professional dark navy sidebar navigation, clean light-gray content workspace, elevated white cards with subtle borders.
- **Responsive Layout**: Responsive grid layouts, collapsible sidebar for mobile and desktop screens.
- **Dynamic State Management**: Reusable loading skeletons, error states with retry actions, empty states, and modal confirmation dialogs.
- **Interactive Visualizations**: High-performance SVG charts using Recharts for Area trends, Bar comparisons, Donut breakdowns, and Breakeven curve intersections.
- **CSV Data Exporting**: Built-in CSV export button available across financial ledgers.
