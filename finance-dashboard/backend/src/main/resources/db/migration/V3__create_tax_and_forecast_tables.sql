-- ===================================================================
-- V3__create_tax_and_forecast_tables.sql
-- Submodules: Statutory Tax Compliance, Financial Forecasting, Breakeven Analysis Models
-- ===================================================================

-- Statutory Tax Compliance Obligations & Filings
CREATE TABLE IF NOT EXISTS tax_compliance_filings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tax_type VARCHAR(100) NOT NULL, -- Corporate Income Tax, GST GSTR-1, GST GSTR-3B, TDS / Withholding, Payroll Tax 941
    jurisdiction VARCHAR(100) NOT NULL, -- Federal US, India, California, Delaware
    tax_period VARCHAR(50) NOT NULL, -- Q3-2026, September 2026, Annual 2025
    due_date DATE NOT NULL,
    estimated_tax_amount DECIMAL(15,2) NOT NULL,
    amount_paid DECIMAL(15,2) DEFAULT 0.00,
    challan_acknowledgement_no VARCHAR(100),
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, FILED, PAID, OVERDUE, EXTENDED
    verified_statutory_status VARCHAR(50) DEFAULT 'SELF_RECORDED', -- SELF_RECORDED, AUDITOR_VERIFIED, GOVT_ACKNOWLEDGED
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Financial Forecasting Models & Projections
CREATE TABLE IF NOT EXISTS financial_forecasts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    forecast_month VARCHAR(20) NOT NULL, -- e.g. 2026-11, 2026-12, 2027-01
    projected_revenue DECIMAL(15,2) NOT NULL,
    projected_opex DECIMAL(15,2) NOT NULL,
    projected_cogs DECIMAL(15,2) NOT NULL,
    projected_cash_flow DECIMAL(15,2) NOT NULL,
    actual_revenue DECIMAL(15,2) DEFAULT 0.00,
    actual_opex DECIMAL(15,2) DEFAULT 0.00,
    revenue_growth_rate DECIMAL(5,2) DEFAULT 10.00,
    assumptions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cost Structure & Breakeven Models
CREATE TABLE IF NOT EXISTS breakeven_models (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_title VARCHAR(150) NOT NULL,
    product_or_service VARCHAR(150) NOT NULL,
    selling_price_per_unit DECIMAL(15,2) NOT NULL,
    variable_cost_per_unit DECIMAL(15,2) NOT NULL,
    monthly_fixed_costs DECIMAL(15,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Tax Compliance
INSERT INTO tax_compliance_filings (tax_type, jurisdiction, tax_period, due_date, estimated_tax_amount, amount_paid, challan_acknowledgement_no, status, verified_statutory_status, remarks) VALUES
('GST GSTR-1 (Outward Supplies)', 'India', 'September 2026', '2026-10-11', 68400.00, 68400.00, 'ARN-AA290926018821', 'FILED', 'GOVT_ACKNOWLEDGED', 'Filed successfully on GST Portal'),
('GST GSTR-3B (Summary Return)', 'India', 'September 2026', '2026-10-20', 68400.00, 0.00, NULL, 'PENDING', 'SELF_RECORDED', 'Tax liability payable post ITC reconciliation'),
('TDS Monthly Deposit (Section 194C/J)', 'India', 'September 2026', '2026-10-07', 24500.00, 24500.00, 'CHALLAN-ITNS281-9921', 'PAID', 'AUDITOR_VERIFIED', 'Deposited via NSDL Corporate Netbanking'),
('Federal Quarterly Estimated Tax (1120-W)', 'US Federal IRS', 'Q3-2026', '2026-09-15', 52000.00, 52000.00, 'EFTPS-884920194', 'FILED', 'GOVT_ACKNOWLEDGED', 'Paid through EFTPS system'),
('Delaware Annual Franchise Tax', 'Delaware SOS', 'FY 2026', '2027-03-01', 5000.00, 0.00, NULL, 'PENDING', 'SELF_RECORDED', 'Calculated under Alternative Authorized Shares method');

-- Seed Forecast Models
INSERT INTO financial_forecasts (model_name, forecast_month, projected_revenue, projected_opex, projected_cogs, projected_cash_flow, actual_revenue, actual_opex, revenue_growth_rate, assumptions) VALUES
('FY26-Q4 Baseline Model', '2026-10', 430000.00, 167600.00, 135200.00, 127200.00, 430000.00, 167600.00, 12.50, 'Actual month closed - targets met'),
('FY26-Q4 Baseline Model', '2026-11', 485000.00, 172000.00, 148000.00, 165000.00, 0.00, 0.00, 12.80, 'Enterprise client onboarding pipeline 3 deals'),
('FY26-Q4 Baseline Model', '2026-12', 550000.00, 180000.00, 165000.00, 205000.00, 0.00, 0.00, 13.40, 'Year-end contract renewals and license expansion'),
('FY27-Q1 Growth Model', '2027-01', 590000.00, 185000.00, 175000.00, 230000.00, 0.00, 0.00, 15.00, 'Expansion in APAC partner ecosystem');

-- Seed Breakeven Models
INSERT INTO breakeven_models (model_title, product_or_service, selling_price_per_unit, variable_cost_per_unit, monthly_fixed_costs, notes) VALUES
('Hardware Appliance Model', 'Enterprise Server Appliance', 1500.00, 825.00, 45000.00, 'CM per unit = $675. Breakeven = ~67 units/month'),
('SaaS Subscription Pro Tier', 'Cloud Platform Seat (Annual)', 360.00, 45.00, 32000.00, 'CM per unit = $315. Breakeven = ~102 seats/month'),
('Consulting & Deployment Pack', 'Custom Implementation Pack', 5000.00, 1800.00, 15000.00, 'CM per unit = $3,200. Breakeven = ~5 engagements/month');
