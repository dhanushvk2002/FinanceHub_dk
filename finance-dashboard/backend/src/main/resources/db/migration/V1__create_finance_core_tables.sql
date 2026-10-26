-- ===================================================================
-- V1__create_finance_core_tables.sql
-- Core Financial Models: Periods, P&L, Balance Sheet, Cash Flow, OPEX, COGS, EBITDA
-- ===================================================================

-- Financial Periods
CREATE TABLE IF NOT EXISTS financial_periods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    period_name VARCHAR(50) NOT NULL UNIQUE,
    fiscal_year INT NOT NULL,
    quarter VARCHAR(10),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Revenue Records
CREATE TABLE IF NOT EXISTS revenue_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    period_id BIGINT,
    customer_name VARCHAR(150) NOT NULL,
    product_category VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    units_sold INT DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    gross_amount DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rev_period FOREIGN KEY (period_id) REFERENCES financial_periods(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Operating Expenses (OPEX)
CREATE TABLE IF NOT EXISTS operating_expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    period_id BIGINT,
    expense_category VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    vendor_name VARCHAR(150) NOT NULL,
    expense_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    approval_status VARCHAR(30) DEFAULT 'APPROVED',
    payment_status VARCHAR(30) DEFAULT 'PAID',
    approved_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_opex_period FOREIGN KEY (period_id) REFERENCES financial_periods(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cost Of Goods Sold (COGS)
CREATE TABLE IF NOT EXISTS cogs_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    period_id BIGINT,
    product_line VARCHAR(100) NOT NULL,
    direct_material_cost DECIMAL(15,2) NOT NULL,
    direct_labor_cost DECIMAL(15,2) NOT NULL,
    manufacturing_overhead DECIMAL(15,2) NOT NULL,
    freight_shipping_cost DECIMAL(15,2) DEFAULT 0.00,
    total_cogs DECIMAL(15,2) NOT NULL,
    units_produced INT NOT NULL,
    unit_cost DECIMAL(15,2) NOT NULL,
    record_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cogs_period FOREIGN KEY (period_id) REFERENCES financial_periods(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Balance Sheet Accounts & Line Items
CREATE TABLE IF NOT EXISTS balance_sheet_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    period_id BIGINT,
    classification VARCHAR(50) NOT NULL, -- CURRENT_ASSET, NON_CURRENT_ASSET, CURRENT_LIABILITY, NON_CURRENT_LIABILITY, EQUITY
    sub_category VARCHAR(100) NOT NULL,
    account_name VARCHAR(150) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    as_of_date DATE NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bs_period FOREIGN KEY (period_id) REFERENCES financial_periods(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cash Flow Records
CREATE TABLE IF NOT EXISTS cash_flow_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    period_id BIGINT,
    activity_type VARCHAR(50) NOT NULL, -- OPERATING, INVESTING, FINANCING
    item_description VARCHAR(200) NOT NULL,
    cash_inflow DECIMAL(15,2) DEFAULT 0.00,
    cash_outflow DECIMAL(15,2) DEFAULT 0.00,
    net_movement DECIMAL(15,2) NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cf_period FOREIGN KEY (period_id) REFERENCES financial_periods(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial financial periods
INSERT INTO financial_periods (period_name, fiscal_year, quarter, start_date, end_date, is_closed) VALUES
('Q1-2026', 2026, 'Q1', '2026-01-01', '2026-03-31', TRUE),
('Q2-2026', 2026, 'Q2', '2026-04-01', '2026-06-30', TRUE),
('Q3-2026', 2026, 'Q3', '2026-07-01', '2026-09-30', TRUE),
('Q4-2026', 2026, 'Q4', '2026-10-01', '2026-12-31', FALSE);

-- Seed revenue records
INSERT INTO revenue_records (period_id, customer_name, product_category, channel, transaction_date, units_sold, unit_price, gross_amount, discount_amount, net_amount) VALUES
(4, 'Acme Global Corp', 'Enterprise SaaS', 'Direct Sales', '2026-10-02', 1, 145000.00, 145000.00, 5000.00, 140000.00),
(4, 'Vertex Cloud Solutions', 'API Infrastructure', 'Partner', '2026-10-04', 12, 5000.00, 60000.00, 0.00, 60000.00),
(4, 'Starlight Logistics', 'Consulting & Setup', 'Direct Sales', '2026-10-05', 1, 35000.00, 35000.00, 2000.00, 33000.00),
(4, 'Horizon Fintech', 'Enterprise SaaS', 'Online', '2026-10-08', 5, 18000.00, 90000.00, 3000.00, 87000.00),
(4, 'Zenith Healthcare', 'Data Compliance Suite', 'Direct Sales', '2026-10-10', 2, 60000.00, 120000.00, 10000.00, 110000.00);

-- Seed OPEX
INSERT INTO operating_expenses (period_id, expense_category, department, vendor_name, expense_date, amount, description, approval_status, payment_status, approved_by) VALUES
(4, 'Cloud Infrastructure', 'Engineering', 'Amazon Web Services', '2026-10-01', 32500.00, 'Compute and RDS MySQL cluster hosting', 'APPROVED', 'PAID', 'CTO'),
(4, 'Payroll & Benefits', 'Operations', 'Gusto HR Services', '2026-10-05', 85400.00, 'Engineering and Finance core payroll', 'APPROVED', 'PAID', 'VP Finance'),
(4, 'Marketing & Advertising', 'Growth', 'Google Ads & LinkedIn', '2026-10-06', 18200.00, 'Q4 customer acquisition campaigns', 'APPROVED', 'PAID', 'CMO'),
(4, 'Office & Facilities', 'Administration', 'WeWork Real Estate', '2026-10-07', 12000.00, 'HQ Office space lease', 'APPROVED', 'PAID', 'COO'),
(4, 'Legal & Professional', 'Compliance', 'Baker & McKenzie', '2026-10-09', 9500.00, 'Statutory audit and governance consulting', 'APPROVED', 'PENDING', 'VP Finance');

-- Seed COGS
INSERT INTO cogs_records (period_id, product_line, direct_material_cost, direct_labor_cost, manufacturing_overhead, freight_shipping_cost, total_cogs, units_produced, unit_cost, record_date) VALUES
(4, 'Enterprise Server Appliances', 45000.00, 22000.00, 11000.00, 4500.00, 82500.00, 100, 825.00, '2026-10-03'),
(4, 'Edge IoT Gateways', 28000.00, 14000.00, 7500.00, 3200.00, 52700.00, 200, 263.50, '2026-10-07');

-- Seed Balance Sheet
INSERT INTO balance_sheet_items (period_id, classification, sub_category, account_name, amount, as_of_date, notes) VALUES
(4, 'CURRENT_ASSET', 'Cash & Equivalents', 'Operating Treasury Account', 680000.00, '2026-10-10', 'Silicon Valley Bank / Chase'),
(4, 'CURRENT_ASSET', 'Receivables', 'Trade Accounts Receivable', 245000.00, '2026-10-10', 'Net trade receivables'),
(4, 'CURRENT_ASSET', 'Inventory', 'Finished Goods & Component Stock', 115000.00, '2026-10-10', 'Warehoused valuation'),
(4, 'NON_CURRENT_ASSET', 'Property & Equipment', 'Data Centers & Lab Hardware', 420000.00, '2026-10-10', 'Capitalized fixed equipment'),
(4, 'NON_CURRENT_ASSET', 'Intangibles', 'Software IP & Patents', 190000.00, '2026-10-10', 'Capitalized R&D'),
(4, 'CURRENT_LIABILITY', 'Payables', 'Trade Accounts Payable', 135000.00, '2026-10-10', 'Due within 30 days'),
(4, 'CURRENT_LIABILITY', 'Accruals', 'Accrued Payroll & Statutory Taxes', 85000.00, '2026-10-10', 'Payroll liabilities'),
(4, 'NON_CURRENT_LIABILITY', 'Long-term Debt', 'Senior Term Loan 2028', 350000.00, '2026-10-10', '5.5% fixed interest bond'),
(4, 'EQUITY', 'Common Stock', 'Issued & Paid-up Share Capital', 500000.00, '2026-10-10', 'Founders & Seed investors'),
(4, 'EQUITY', 'Retained Earnings', 'Accumulated Reserves & Surplus', 580000.00, '2026-10-10', 'Cumulative surplus profit');

-- Seed Cash Flow
INSERT INTO cash_flow_records (period_id, activity_type, item_description, cash_inflow, cash_outflow, net_movement, transaction_date) VALUES
(4, 'OPERATING', 'Customer Receipts from Sales', 430000.00, 0.00, 430000.00, '2026-10-02'),
(4, 'OPERATING', 'Payments to Suppliers & Vendors', 0.00, 157600.00, -157600.00, '2026-10-04'),
(4, 'OPERATING', 'Salaries, Wages & Benefits Paid', 0.00, 85400.00, -85400.00, '2026-10-05'),
(4, 'INVESTING', 'Procurement of Server Infrastructure', 0.00, 45000.00, -45000.00, '2026-10-06'),
(4, 'FINANCING', 'Repayment of Short-term Borrowings', 0.00, 20000.00, -20000.00, '2026-10-08');
